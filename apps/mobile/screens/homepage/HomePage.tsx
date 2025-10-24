import React, { useEffect, useRef, useCallback } from 'react';
import { View, Image, Animated, FlatList, TouchableOpacity } from 'react-native';
import { posts, stories } from './mockData';
import { CameraIcon } from 'components/Icons';
import { ImageViewer } from 'components/ImageViewer';
import Header from 'components/Header';
import { FeedList } from 'components/FeedList';
import { useImageViewer } from '../../hooks/useImageViewer';

export const HomePage = ({ setHideNav }: { setHideNav: (hide: boolean) => void }) => {
  const flatListRef = useRef<FlatList>(null);
  const scrollY = useRef(new Animated.Value(0)).current;

  const {
    imageViewerVisible,
    hideProgressBar,
    hideCounter,
    users,
    images,
    imageIndex,
    imageMeta,
    setImageIndex,
    setHideProgressBar,
    setHideCounter,
    openImageViewer,
    closeImageViewer,
    handlePostImagePress,
  } = useImageViewer();

  useEffect(() => {
    setHideNav(imageViewerVisible);
  }, [imageViewerVisible]);

  const allStoryImages = stories.flatMap((s) => s.images ?? []);
  const allStoryUsers = stories.flatMap((s) => (s.images ?? []).map(() => s.user));

  const handleStoryPress = useCallback(
    (index: number) => {
      console.log('index', index);
      const initialIndex = stories
        .slice(0, index)
        .reduce((acc, s) => acc + (s.images?.length ?? 0), 0);
      console.log('initialIndex', initialIndex);

      openImageViewer(allStoryImages, allStoryUsers, initialIndex, {
        hideCounter: true,
        hideProgressBar: false,
      });
    },
    [allStoryImages, allStoryUsers, openImageViewer]
  );

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
        {/* Stories row */}
        <View className="relative px-3 py-3">
          <View className="flex-row items-center gap-3">
            {stories.map((story, index) => {
              const isGray = index >= stories.length - 2;
              return (
                <TouchableOpacity
                  key={index}
                  className="relative"
                  onPress={() => handleStoryPress(index)}>
                  <Image
                    source={{ uri: story.user.userAvatar }}
                    className={`h-[50] w-[50] rounded-full ${index < 2 ? 'border-2 border-white' : ''} ${isGray ? 'opacity-100' : ''}`}
                  />
                  {isGray && (
                    <View
                      pointerEvents="none"
                      className="absolute inset-0 rounded-full bg-[rgba(0,0,0,0.4)]"
                    />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
          <View className="absolute bottom-5 right-4 items-center justify-center">
            <CameraIcon size={35} />
          </View>
        </View>
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
        imageMeta={imageMeta}
      />
    </View>
  );
};
