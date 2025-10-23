import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { View, Animated, FlatList } from 'react-native';
import { FeedPost } from '../../components/Post';
import { posts } from '../homepage/mockData';
import { Text } from 'components/Text';
import { ImageViewer } from 'components/ImageViewer';
import { User } from 'types/user';
import Header from 'components/Header';

export const ProfilePage = ({ setHideNav }: { setHideNav: (hide: boolean) => void }) => {
  const flatListRef = useRef<FlatList>(null);

  // Scroll animations
  const scrollY = useRef(new Animated.Value(0)).current;

  // Image viewer meta
  const [imageViewerVisible, setImageViewerVisible] = useState(false);
  const [hideProgressBar, setHideProgressBar] = useState(false);
  const [hideCounter, setHideCounter] = useState(false);

  useEffect(() => {
    setHideNav(imageViewerVisible);
  }, [imageViewerVisible]);

  // Image view data
  const [users, setUsers] = useState<User[]>([]);
  const [images, setImages] = useState<string[]>([]);
  const [imageIndex, setImageIndex] = useState(0);

  const handlePostImagePress = useCallback((images: string[], initialIndex = 0, user: any) => {
    // Create a users array where the same user is repeated for each image
    const usersArray = images.map(() => user);
    setImages(images);
    setImageIndex(initialIndex);
    setImageViewerVisible(true);
    setHideCounter(false);
    setHideProgressBar(true);
    setUsers(usersArray);
  }, []);

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
        ref={flatListRef}
        data={posts}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }) => (
          <FeedPost
            {...item}
            onImagePress={(images, index) => handlePostImagePress(images, index, item.user)}
          />
        )}
        onScroll={(event) => {
          scrollY.setValue(event.nativeEvent.contentOffset.y);
        }}
        scrollEventThrottle={16}
        className="flex-1"
        contentContainerStyle={{ paddingTop: 136, paddingBottom: 70 }}
        showsVerticalScrollIndicator={false}
        maintainVisibleContentPosition={{
          minIndexForVisible: 0,
        }}
      />
    );
  }, [posts, handlePostImagePress]);

  return (
    <View className="flex-1">
      {feedList}

      {/* Stories - Floating Header */}
      <Header scrollY={scrollY}>
        <View className="flex-row items-center justify-between px-4" />
      </Header>

      <ImageViewer
        images={images}
        imageIndex={imageIndex}
        setImageIndex={setImageIndex}
        users={users}
        isVisible={imageViewerVisible}
        onClose={() => {
          setImageViewerVisible(false);
        }}
        hideProgressBar={hideProgressBar}
        hideCounter={hideCounter}
        setHideProgressBar={setHideProgressBar}
        setHideCounter={setHideCounter}
      />
    </View>
  );
};
