import React, { useEffect, useRef, useCallback } from 'react';
import { View, Image, Animated, FlatList, TouchableOpacity, Platform } from 'react-native';
import { posts, stories } from './mockData';
import { CameraIcon } from 'components/Icons';
import { ImageViewer } from 'components/ImageViewer';
import Header from 'components/Header';
import { FeedList } from 'components/FeedList';
import { useImageViewer } from '../../hooks/useImageViewer';
import { ScrollView } from 'react-native-gesture-handler';

export const HomePage = ({ setHideNav }: { setHideNav: (hide: boolean) => void }) => {
  const flatListRef = useRef<FlatList>(null);
  const scrollY = useRef(new Animated.Value(0)).current;

  const {
    imageViewerVisible,
    hideProgressBar,
    hideTopBar,
    users,
    images,
    imageIndex,
    imageMeta,
    reactions,
    setImageIndex,
    setHideProgressBar,
    sethideTopBar,
    openImageViewer,
    closeImageViewer,
    handlePostImagePress,
  } = useImageViewer();

  useEffect(() => {
    setHideNav(imageViewerVisible);
  }, [imageViewerVisible]);

  const allStoryImages = stories.flatMap((s) => s.images ?? []);
  const allStoryUsers = stories.flatMap((s) => (s.images ?? []).map(() => s.user));
  const allStoryReactions = stories.flatMap((s) => (s.images ?? []).map(() => s.reactions ?? []));
  const allStoryMeta = stories.flatMap((s) =>
    (s.images ?? []).map(() => ({
      location: s.location,
      timestamp: s.timestamp,
    }))
  );

  const handleStoryPress = useCallback(
    (index: number) => {
      console.log('index', index);
      const initialIndex = stories
        .slice(0, index)
        .reduce((acc, s) => acc + (s.images?.length ?? 0), 0);
      console.log('initialIndex', initialIndex);

      openImageViewer(
        allStoryImages,
        allStoryUsers,
        initialIndex,
        {
          hideTopBar: false,
          hideProgressBar: false,
        },
        allStoryMeta,
        allStoryReactions
      );
    },
    [allStoryImages, allStoryUsers, allStoryMeta, allStoryReactions, openImageViewer]
  );

  return (
    <View className="relative flex-1">
      {/* Stories - Floating Header */}
      <Header scrollY={scrollY}>
        {/* Stories row */}
        <View className="relative py-3">
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={Platform.OS === 'web'}
            scrollEventThrottle={16}
            fadingEdgeLength={15}
            className="w-[82%]">
            <View className="flex-row items-center gap-2.5 pl-3">
              {stories.map((story, index) => {
                const isGray = story.seen ?? false;
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
          </ScrollView>
          <View className="absolute bottom-5 right-4 items-center justify-center">
            <CameraIcon size={35} />
          </View>
        </View>
      </Header>

      <FeedList
        ref={flatListRef}
        posts={posts}
        scrollY={scrollY}
        onImagePress={handlePostImagePress}
      />

      <ImageViewer
        images={images}
        imageIndex={imageIndex}
        setImageIndex={setImageIndex}
        users={users}
        isVisible={imageViewerVisible}
        onClose={closeImageViewer}
        hideProgressBar={hideProgressBar}
        hideTopBar={hideTopBar}
        setHideProgressBar={setHideProgressBar}
        sethideTopBar={sethideTopBar}
        imageMeta={imageMeta}
        reactions={reactions}
      />
    </View>
  );
};
