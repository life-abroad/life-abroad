import React, { useEffect, useRef } from 'react';
import { View, Animated, FlatList } from 'react-native';
import { posts } from '../homepage/mockData';
import { ImageViewer } from 'components/ImageViewer';
import Header from 'components/Header';
import { FeedList } from 'components/FeedList';
import { useImageViewer } from '../../hooks/useImageViewer';

export const ProfilePage = ({ setHideNav }: { setHideNav: (hide: boolean) => void }) => {
  const flatListRef = useRef<FlatList>(null);
  const scrollY = useRef(new Animated.Value(0)).current;

  const {
    imageViewerVisible,
    hideProgressBar,
    hideCounter,
    users,
    images,
    imageIndex,
    setImageIndex,
    setHideProgressBar,
    setHideCounter,
    closeImageViewer,
    handlePostImagePress,
  } = useImageViewer();

  useEffect(() => {
    setHideNav(imageViewerVisible);
  }, [imageViewerVisible]);

  return (
    <View className="flex-1">
      <FeedList
        ref={flatListRef}
        posts={posts}
        scrollY={scrollY}
        onImagePress={handlePostImagePress}
      />

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
        onClose={closeImageViewer}
        hideProgressBar={hideProgressBar}
        hideCounter={hideCounter}
        setHideProgressBar={setHideProgressBar}
        setHideCounter={setHideCounter}
      />
    </View>
  );
};
