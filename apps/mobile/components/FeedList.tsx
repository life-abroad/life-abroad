import React, { useMemo, useState, useEffect, useRef, useImperativeHandle } from 'react';
import { View, Animated, FlatList, ScrollView, Image, Dimensions } from 'react-native';
import { FeedPost } from '../components/Post';
import { Text } from '../components/Text';
import { User } from 'types/user';
import { Post, Reaction } from 'types/post';
import { ImageMeta } from '../hooks/useImageViewer';

const screenWidth = Dimensions.get('window').width;

interface FeedListProps {
  posts: Post[];
  scrollY: Animated.Value;
  onImagePress: (
    images: string[],
    index: number,
    user: User,
    imageMeta: ImageMeta,
    reactions?: Reaction[]
  ) => void;
  paddingTop?: number;
  paddingBottom?: number;
  numColumns?: number;
  displayPosterInfo?: boolean;
  displayReactionControls?: boolean;
}

interface FeedListHandle {
  scrollToOffset: (params: { offset: number; animated?: boolean | null }) => void;
}

export const FeedList = React.forwardRef<FeedListHandle, FeedListProps>(
  (
    {
      posts,
      scrollY,
      onImagePress,
      paddingTop = 136,
      paddingBottom = 70,
      numColumns = 1,
      displayPosterInfo = true,
      displayReactionControls = true,
    },
    ref
  ) => {
    const scrollViewRef = useRef<ScrollView | null>(null);
    const flatListRef = useRef<FlatList | null>(null);
    const [imageSizes, setImageSizes] = useState<Record<string, { width: number; height: number }>>(
      {}
    );

    // Expose scrollToTop method through ref
    useImperativeHandle(ref, () => ({
      scrollToOffset: ({ offset, animated }: { offset: number; animated?: boolean | null }) => {
        if (numColumns > 1 && scrollViewRef.current) {
          scrollViewRef.current.scrollTo({ y: offset, animated: animated ?? true });
        } else if (flatListRef.current) {
          flatListRef.current.scrollToOffset({ offset, animated: animated ?? true });
        }
      },
    }));

    // Preload image sizes for masonry layout
    useEffect(() => {
      if (numColumns > 1) {
        const loadImageSizes = async () => {
          const sizes: Record<string, { width: number; height: number }> = {};

          for (const post of posts) {
            for (const image of post.images) {
              if (!sizes[image]) {
                try {
                  await new Promise<void>((resolve) => {
                    Image.getSize(
                      image,
                      (width, height) => {
                        sizes[image] = { width, height };
                        resolve();
                      },
                      () => {
                        sizes[image] = { width: 1, height: 1 };
                        resolve();
                      }
                    );
                  });
                } catch (err) {
                  sizes[image] = { width: 1, height: 1 };
                }
              }
            }
          }

          setImageSizes(sizes);
        };

        loadImageSizes();
      }
    }, [posts, numColumns]);

    // Calculate post height based on images
    const calculatePostHeight = (post: Post): number => {
      let totalHeight = 0;

      // Header height
      totalHeight += displayPosterInfo ? 60 : 50;

      // Images height
      const columnWidth = screenWidth / numColumns;
      post.images.forEach((image) => {
        const size = imageSizes[image];
        if (size) {
          const imageHeight = (size.height / size.width) * columnWidth;
          totalHeight += imageHeight + 2; // 2px gap between images
        } else {
          totalHeight += 200; // fallback height
        }
      });

      // Footer height (approximate)
      totalHeight += displayReactionControls ? 100 : 80;

      // Margin
      totalHeight += 4;

      return totalHeight;
    };

    // Distribute posts into columns for masonry layout
    const masonryColumns = useMemo(() => {
      if (numColumns <= 1 || Object.keys(imageSizes).length === 0) {
        return null;
      }

      const columns: Post[][] = Array.from({ length: numColumns }, () => []);
      const columnHeights = Array(numColumns).fill(0);

      posts.forEach((post) => {
        // Find the shortest column
        const shortestColumnIndex = columnHeights.indexOf(Math.min(...columnHeights));

        // Add post to the shortest column
        columns[shortestColumnIndex].push(post);

        // Update column height
        columnHeights[shortestColumnIndex] += calculatePostHeight(post);
      });

      return columns;
    }, [posts, imageSizes, numColumns, displayPosterInfo, displayReactionControls]);

    const feedList = useMemo(() => {
      if (!posts || posts.length === 0) {
        return (
          <View className="flex-1 items-center justify-center">
            <Text>No posts available</Text>
          </View>
        );
      }

      return numColumns > 1 && masonryColumns ? (
        <Animated.ScrollView
          ref={scrollViewRef}
          onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], {
            useNativeDriver: false,
          })}
          scrollEventThrottle={16}
          contentContainerStyle={{ paddingTop, paddingBottom }}
          showsVerticalScrollIndicator={false}>
          <View className="flex-row" style={{ gap: 4 }}>
            {masonryColumns.map((column, columnIndex) => (
              <View key={columnIndex} className="flex-1" style={{ gap: 1 }}>
                {column.map((post, postIndex) => (
                  <FeedPost
                    key={`${columnIndex}-${postIndex}`}
                    {...post}
                    onImagePress={(images, index) =>
                      onImagePress(
                        images,
                        index,
                        post.user,
                        {
                          location: post.location,
                          timestamp: post.timestamp,
                        },
                        post.reactions
                      )
                    }
                    numColumns={numColumns}
                    displayPosterInfo={displayPosterInfo}
                    displayReactionControls={displayReactionControls}
                  />
                ))}
              </View>
            ))}
          </View>
        </Animated.ScrollView>
      ) : (
        <FlatList
          ref={flatListRef}
          data={posts}
          keyExtractor={(_, index) => index.toString()}
          numColumns={numColumns}
          renderItem={({ item }: { item: Post }) => (
            <View className={numColumns > 1 ? 'm-[0.3%] w-[49.7%]' : ''}>
              <FeedPost
                {...item}
                onImagePress={(images, index) =>
                  onImagePress(
                    images,
                    index,
                    item.user,
                    {
                      location: item.location,
                      timestamp: item.timestamp,
                    },
                    item.reactions
                  )
                }
                numColumns={numColumns}
                displayPosterInfo={displayPosterInfo}
                displayReactionControls={displayReactionControls}
              />
            </View>
          )}
          onScroll={(event) => {
            scrollY.setValue(event.nativeEvent.contentOffset.y);
          }}
          scrollEventThrottle={16}
          className="flex-1"
          contentContainerStyle={{ paddingTop, paddingBottom }}
          showsVerticalScrollIndicator={false}
          maintainVisibleContentPosition={{
            minIndexForVisible: 0,
          }}
        />
      );
    }, [
      posts,
      onImagePress,
      scrollY,
      paddingTop,
      paddingBottom,
      ref,
      numColumns,
      displayPosterInfo,
      displayReactionControls,
      masonryColumns,
    ]);

    return <>{feedList}</>;
  }
);

FeedList.displayName = 'FeedList';
