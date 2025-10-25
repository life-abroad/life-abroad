import React, { useEffect, useRef, useCallback, useState } from 'react';
import {
  View,
  Image,
  Animated,
  FlatList,
  TouchableOpacity,
  Platform,
  useWindowDimensions,
} from 'react-native';
import { posts, stories } from './mockData';
import { CameraIcon } from 'components/Icons';
import { ImageViewer } from 'components/ImageViewer';
import Header from 'components/Bars/Header';
import { FeedList } from 'components/FeedList';
import { useImageViewer } from '../../hooks/useImageViewer';
import { ScrollView } from 'react-native-gesture-handler';
import { Text } from 'components/Text';
import { useHeader } from '../../contexts/HeaderContext';

export const HomePage = ({
  hideNav,
  setHideNav,
  className,
}: {
  hideNav: boolean;
  setHideNav: (hide: boolean) => void;
  className?: string;
}) => {
  const flatListRef = useRef<FlatList>(null);
  const scrollY = useRef(new Animated.Value(0)).current;
  const [headerHeight, setHeaderHeight] = useState<number>(136); // Default fallback
  const { setHeaderContent, setRightHeaderContent } = useHeader();
  const { width } = useWindowDimensions();
  const isDesktop = Platform.OS === 'web' && width >= 1024;

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

  const allStoryImages = stories.flatMap((s) => (s.images ?? []).map((img) => img.url));
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

  // Set mobile/tablet header content
  useEffect(() => {
    setHeaderContent(
      <Header scrollY={scrollY} onHeightChange={setHeaderHeight}>
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
    );
  }, [stories, handleStoryPress, scrollY, setHeaderContent]);

  // Set desktop right header content
  useEffect(() => {
    setRightHeaderContent(
      <View className="py-4">
        <View className="flex-col gap-3">
          {stories.map((story, index) => {
            const isGray = story.seen ?? false;
            return (
              <TouchableOpacity
                key={index}
                className="relative flex-row items-center gap-3"
                onPress={() => handleStoryPress(index)}>
                <Image
                  source={{ uri: story.user.userAvatar }}
                  className={`h-[60] w-[60] rounded-full ${index < 2 ? 'border-2 border-white' : ''} ${isGray ? 'opacity-100' : ''}`}
                />
                {isGray && (
                  <View
                    pointerEvents="none"
                    className="absolute inset-0 h-[60] w-[60] rounded-full bg-[rgba(0,0,0,0.4)]"
                  />
                )}
                <View className="flex-1">
                  <Text className="text-base font-semibold">{story.user.userName}</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    );
  }, [stories, handleStoryPress, setRightHeaderContent]);

  // Clear header content when component unmounts
  useEffect(() => {
    return () => {
      setHeaderContent(null);
      setRightHeaderContent(null);
    };
  }, [setHeaderContent, setRightHeaderContent]);

  return (
    <View className={`relative flex-1 bg-black ${className}`}>
      <FeedList
        ref={flatListRef}
        posts={posts}
        scrollY={scrollY}
        onImagePress={handlePostImagePress}
        paddingTop={isDesktop ? 5 : headerHeight}
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
