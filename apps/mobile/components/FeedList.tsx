import React, { useMemo, useState, useEffect, useRef, useImperativeHandle } from 'react';
import { View, Animated, FlatList, ScrollView, Image, Dimensions, Platform } from 'react-native';
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
  numImagesPerPost?: number;
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
      paddingTop = 0,
      paddingBottom = 70,
      numColumns = 1,
      displayPosterInfo = true,
      displayReactionControls = true,
      numImagesPerPost = -1,
    },
    ref
  ) => {
    const scrollViewRef = useRef<ScrollView | null>(null);
    const flatListRef = useRef<FlatList | null>(null);
    const [imageSizes, setImageSizes] = useState<Record<string, { width: number; height: number }>>(
      {}
    );
    const [containerWidth, setContainerWidth] = useState<number>(screenWidth);

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

    const handleLayout = (event: { nativeEvent: { layout: { width: number } } }) => {
      const { width } = event.nativeEvent.layout;
      setContainerWidth(width);
    };

    // Preload image sizes for masonry layout
    useEffect(() => {
      if (numColumns > 1) {
        const loadImageSizes = async () => {
          const sizes: Record<string, { width: number; height: number }> = {};

          for (const post of posts) {
            for (const image of post.images.slice(
              0,
              numImagesPerPost > 0 ? numImagesPerPost : post.images.length
            )) {
              if (!sizes[image.url]) {
                // Use dimensions from the Image interface directly
                sizes[image.url] = { width: image.width, height: image.height };
              }
            }
          }
          console.log('Loaded image sizes for masonry layout:', sizes);
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
      post.images
        .slice(0, numImagesPerPost > 0 ? numImagesPerPost : post.images.length)
        .forEach((image) => {
          const size = imageSizes[image.url];
          if (size) {
            const imageHeight = (size.height / size.width) * columnWidth;
            totalHeight += imageHeight + 2; // 2px gap between images
          } else {
            // Fallback using image dimensions directly
            const imageHeight = (image.height / image.width) * columnWidth;
            totalHeight += imageHeight + 2;
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
          <View className="flex-row" style={{ gap: 3 }}>
            {masonryColumns.map((column, columnIndex) => (
              <View key={columnIndex} className="flex-1" style={{ gap: 1 }}>
                {column.map((post, postIndex) => (
                  <FeedPost
                    key={`${columnIndex}-${postIndex}`}
                    {...post}
                    containerWidth={containerWidth}
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
          keyExtractor={(item, index) => `${item.user.userName}-${item.timestamp}-${index}`}
          numColumns={1}
          renderItem={({ item }: { item: Post }) => (
            <FeedPost
              {...item}
              containerWidth={containerWidth}
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
              numColumns={1}
              displayPosterInfo={displayPosterInfo}
              displayReactionControls={displayReactionControls}
            />
          )}
          removeClippedSubviews={Platform.OS !== 'web'}
          windowSize={Platform.OS === 'web' ? 10 : 21}
          maxToRenderPerBatch={Platform.OS === 'web' ? 5 : 10}
          updateCellsBatchingPeriod={Platform.OS === 'web' ? 100 : 50}
          initialNumToRender={5}
          onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], {
            useNativeDriver: false,
          })}
          scrollEventThrottle={16}
          contentContainerStyle={{ paddingTop, paddingBottom }}
          showsVerticalScrollIndicator={Platform.OS === 'web'}
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
      containerWidth,
    ]);

    return (
      <View style={{ flex: 1 }} onLayout={handleLayout}>
        {feedList}
      </View>
    );
  }
);

FeedList.displayName = 'FeedList';
