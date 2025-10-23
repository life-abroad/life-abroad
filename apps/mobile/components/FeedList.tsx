import React, { useRef, useMemo } from 'react';
import { View, Animated, FlatList } from 'react-native';
import { FeedPost } from '../components/Post';
import { Text } from '../components/Text';
import { User } from 'types/user';

interface FeedListProps {
  posts: any[];
  scrollY: Animated.Value;
  onImagePress: (images: string[], index: number, user: User) => void;
  paddingTop?: number;
  paddingBottom?: number;
}

export const FeedList = React.forwardRef<FlatList, FeedListProps>(
  ({ posts, scrollY, onImagePress, paddingTop = 136, paddingBottom = 70 }, ref) => {
    const feedList = useMemo(() => {
      if (!posts || posts.length === 0) {
        return (
          <View className="flex-1 items-center justify-center">
            <Text>No posts available</Text>
          </View>
        );
      }

      return (
        <FlatList
          ref={ref}
          data={posts}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item }) => (
            <FeedPost
              {...item}
              onImagePress={(images, index) => onImagePress(images, index, item.user)}
            />
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
    }, [posts, onImagePress, scrollY, paddingTop, paddingBottom, ref]);

    return <>{feedList}</>;
  }
);

FeedList.displayName = 'FeedList';
