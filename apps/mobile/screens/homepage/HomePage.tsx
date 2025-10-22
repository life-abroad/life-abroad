import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { View, Image, Animated, FlatList, TouchableOpacity } from 'react-native';
import { FeedPost } from '../../components/Post';
import { posts, stories } from './mockData';
import { CameraIcon, CircleLogo } from 'components/Icons';
import { Text } from 'components/Text';
import Blur from 'components/Blur';
import { ImageViewer } from 'components/ImageViewer';
import { User } from 'types/user';

export const HomePage = ({ setHideNav }: { setHideNav: (hide: boolean) => void }) => {
  const flatListRef = useRef<FlatList>(null);

  // Scroll animations
  const scrollY = useRef(new Animated.Value(0)).current;
  const diffClampScrollY = Animated.diffClamp(scrollY, 0, 300);
  const headerTranslateY = diffClampScrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [0, -100],
    extrapolate: 'clamp',
  });
  // Add opacity interpolation for fade effect
  const headerOpacity = diffClampScrollY.interpolate({
    inputRange: [0, 60, 90],
    outputRange: [1, 0.7, 0],
    extrapolate: 'clamp',
  });

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

  useEffect(() => {
    console.log('HomePage Current Index:', imageIndex);
  }, [imageIndex]);

  const allStoryImages = stories.flatMap((s) => s.images ?? []);
  // Create a users array where each user is repeated for each of their images
  const allStoryUsers = stories.flatMap((s) => (s.images ?? []).map(() => s.user));

  const handleStoryPress = useCallback(
    (index: number) => {
      console.log('index', index);
      const initialIndex = stories
        .slice(0, index)
        .reduce((acc, s) => acc + (s.images?.length ?? 0), 0);
      console.log('initialIndex', initialIndex);
      // data
      setImages(allStoryImages);
      setImageIndex(initialIndex);
      setUsers(allStoryUsers);
      // meta
      setImageViewerVisible(true);
      setHideCounter(true);
      setHideProgressBar(false);
    },
    [allStoryImages, allStoryUsers]
  );

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
      <Animated.View
        className="absolute left-0 right-0 top-0 h-40 py-0"
        style={{
          transform: [{ translateY: headerTranslateY }],
          opacity: headerOpacity,
        }}>
        <Blur topBar />
        <View className="px-4 pt-14">
          <CircleLogo size={80} />
        </View>
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
      </Animated.View>

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
