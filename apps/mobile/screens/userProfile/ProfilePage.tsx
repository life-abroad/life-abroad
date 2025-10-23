import React, { useEffect, useRef } from 'react';
import { View, Animated, FlatList, Image, TouchableOpacity } from 'react-native';
import { posts } from '../homepage/mockData';
import { ImageViewer } from 'components/ImageViewer';
import Header from 'components/Header';
import { FeedList } from 'components/FeedList';
import { useImageViewer } from '../../hooks/useImageViewer';
import { user } from './mockData';
import { Text } from 'components/Text';
import { CircleIconNav, FriendsIcon, PostsIcon } from 'components/Icons';
import FriendRow from 'components/FriendRow';

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

  const [activeTab, setActiveTab] = React.useState<'posts' | 'friends' | 'circles'>('posts');

  return (
    <View className="flex-1 bg-background-secondary">
      {activeTab === 'posts' ? (
        <FeedList
          ref={flatListRef}
          posts={posts}
          scrollY={scrollY}
          onImagePress={handlePostImagePress}
          numColumns={2}
          paddingTop={155}
        />
      ) : activeTab === 'friends' ? (
        <FlatList
          ref={flatListRef}
          data={user.friends}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item }) => <FriendRow {...item} className={''} />}
          contentContainerStyle={{ paddingTop: 155, paddingBottom: 70 }}
          showsVerticalScrollIndicator={false}
          className="pt-2"
        />
      ) : activeTab === 'circles' ? (
        <FlatList
          ref={flatListRef}
          data={user.circles}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item }) => <Text className="p-4">{item.name}</Text>}
          contentContainerStyle={{ paddingTop: 155, paddingBottom: 70 }}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View className="flex-1 items-center justify-center">
          <Text className="text-lg">No {activeTab} to display</Text>
        </View>
      )}

      <Header scrollY={scrollY}>
        <View className="my-3 flex-row justify-between px-4">
          <View className="mt-3 flex-row items-center gap-3">
            <TouchableOpacity
              className="flex-col gap-2"
              onPress={() => setActiveTab('posts')}
              activeOpacity={0.9}>
              <PostsIcon active={activeTab === 'posts'} size={24} onPress={() => {}} />
              <Text className="text-md font-bold">Posts</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="flex-col gap-2"
              onPress={() => setActiveTab('friends')}
              activeOpacity={0.9}>
              <FriendsIcon active={activeTab === 'friends'} size={24} onPress={() => {}} />
              <Text className="text-md font-bold">Friends</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="flex-col gap-2"
              onPress={() => setActiveTab('circles')}
              activeOpacity={0.9}>
              <CircleIconNav active={activeTab === 'circles'} size={28} onPress={() => {}} />
              <Text className="text-md font-bold">Circles</Text>
            </TouchableOpacity>
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
