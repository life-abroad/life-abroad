import React, { useEffect, useRef } from 'react';
import { View, Animated, FlatList, Image, TouchableOpacity, ImageBackground } from 'react-native';
import { posts } from '../homepage/mockData';
import { ImageViewer } from 'components/ImageViewer';
import Header from 'components/Bars/Header';
import { FeedList } from 'components/FeedList';
import { useImageViewer } from '../../hooks/useImageViewer';
import { user } from './mockData';
import { Text } from 'components/Text';
import { CircleIconNav, FriendsIcon, PostsIcon } from 'components/Icons';
import FriendRow from 'components/FriendRow';
import CircleRow from 'components/CircleRow';
import Blur from 'components/Blur';

export const ProfilePage = ({ setHideNav }: { setHideNav: (hide: boolean) => void }) => {
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
    closeImageViewer,
    handlePostImagePress,
  } = useImageViewer();

  useEffect(() => {
    setHideNav(imageViewerVisible);
  }, [imageViewerVisible]);

  const [activeTab, setActiveTab] = React.useState<'posts' | 'friends' | 'circles'>('posts');
  const [selectedCircle, setSelectedCircle] = React.useState<(typeof user.circles)[0] | null>(null);

  // Reset scroll position when changing tabs
  useEffect(() => {
    scrollY.setValue(0);
    if (flatListRef.current) {
      flatListRef.current.scrollToOffset?.({ offset: 0, animated: false });
    }
  }, [activeTab, selectedCircle]);

  return (
    <View className="flex-1 px-0.5">
      {activeTab === 'posts' ? (
        <FeedList
          ref={flatListRef}
          posts={posts}
          scrollY={scrollY}
          onImagePress={handlePostImagePress}
          numColumns={2}
          paddingTop={160}
          displayPosterInfo={false}
          displayReactionControls={false}
        />
      ) : activeTab === 'friends' ? (
        <FlatList
          ref={flatListRef}
          data={user.friends}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item }) => <FriendRow {...item} className={''} />}
          contentContainerStyle={{ paddingTop: 155, paddingBottom: 70 }}
          showsVerticalScrollIndicator={false}
          className="bg-background-secondary pt-2"
        />
      ) : activeTab === 'circles' ? (
        selectedCircle ? (
          <View className="mt-2 flex-1 bg-background-secondary">
            {/* Back button and circle name header */}
            <View className="absolute left-0 right-0 top-[155] z-10 border-b border-gray-200/10 bg-background-secondary px-4 py-3">
              <TouchableOpacity
                onPress={() => setSelectedCircle(null)}
                className="flex-row items-center gap-2">
                <Text className="text-xl text-foreground-secondary">‹</Text>
                <Text className="text-lg font-semibold text-foreground">{selectedCircle.name}</Text>
              </TouchableOpacity>
            </View>

            {/* Circle members list */}
            <FlatList
              ref={flatListRef}
              data={selectedCircle.users}
              keyExtractor={(_, index) => index.toString()}
              renderItem={({ item }) => <FriendRow {...item} className={''} />}
              contentContainerStyle={{ paddingTop: 200, paddingBottom: 70 }}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={
                <View className="flex-1 items-center justify-center p-8">
                  <Text className="text-center text-foreground-secondary">
                    No friends in this circle yet
                  </Text>
                </View>
              }
            />
          </View>
        ) : (
          <FlatList
            ref={flatListRef}
            data={user.circles}
            keyExtractor={(_, index) => index.toString()}
            renderItem={({ item }) => (
              <CircleRow circle={item} onPress={() => setSelectedCircle(item)} />
            )}
            contentContainerStyle={{ paddingTop: 155, paddingBottom: 70 }}
            showsVerticalScrollIndicator={false}
            className="mt-2 bg-background-secondary"
          />
        )
      ) : (
        <View className="flex-1 items-center justify-center">
          <Text className="text-lg">No {activeTab} to display</Text>
        </View>
      )}
      <Header scrollY={scrollY}>
        <View className="flex-row justify-between px-4 py-3">
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
        hideTopBar={hideTopBar}
        setHideProgressBar={setHideProgressBar}
        sethideTopBar={sethideTopBar}
        imageMeta={imageMeta}
        hideBottomBar={true}
        reactions={reactions}
      />
    </View>
  );
};
