import React, { useEffect, useRef } from 'react';
import { View, Animated, FlatList, Image } from 'react-native';
import { posts } from '../homepage/mockData';
import { ImageViewer } from 'components/ImageViewer';
import Header from 'components/Header';
import { FeedList } from 'components/FeedList';
import { useImageViewer } from '../../hooks/useImageViewer';
import { user } from './mockData';
import { Text } from 'components/Text';
import { CircleIconNav, FriendsIcon, PostsIcon } from 'components/Icons';

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
        numColumns={2}
      />

      <Header scrollY={scrollY}>
        <View className="my-3 flex-row justify-between px-4">
          <View className="mt-3 flex-row items-center gap-3">
            <View className="flex-col gap-2">
              <PostsIcon active={true} size={24} onPress={() => {}} />
              <Text className="text-md font-bold">Posts</Text>
            </View>
            <View className="flex-col gap-2">
              <FriendsIcon active={false} size={24} onPress={() => {}} />
              <Text className="text-md font-bold">Friends</Text>
            </View>
            <View className="flex-col gap-2">
              <CircleIconNav active={false} size={28} onPress={() => {}} />
              <Text className="text-md font-bold">Circles</Text>
            </View>
          </View>
          <View className="-mt-[25px] flex-col items-center gap-1">
            <Image
              source={{ uri: user.userAvatar }}
              className={`size-[70] rounded-full border-2 border-white`}
            />
            <View className="">
              <Text className="text-md font-madimi font-semibold">{user.userName}</Text>
            </View>
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
      />
    </View>
  );
};
