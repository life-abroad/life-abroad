import React, { useCallback, useEffect, useRef, useState } from 'react';
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
import CircleBg from 'components/CircleBg';
import { useResponsive } from 'contexts/ResponsiveContext';
import { LayoutDashboard } from 'lucide-react-native';
import { ResponsiveFullFlatListWrapper } from 'components/ResponsiveWrapper';

export const ProfilePage = ({
  setHideNav,
  className,
}: {
  setHideNav: (hide: boolean) => void;
  className?: string;
}) => {
  const { isWeb, isDesktop } = useResponsive();
  const [numColumns, setNumColumns] = useState<number>(2);
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

  const [headerHeight, setHeaderHeight] = useState<number>(133); // Default fallback
  // Memoize header height callback to prevent re-renders
  const handleHeaderHeightChange = useCallback((height: number) => {
    setHeaderHeight(height);
  }, []);

  const iconSize = isDesktop ? 30 : 24;

  return (
    <View className={`relative w-full flex-1 bg-background ${className}`}>
      <CircleBg />
      {activeTab === 'posts' ? (
        <FeedList
          ref={flatListRef}
          posts={posts}
          scrollY={scrollY}
          onImagePress={handlePostImagePress}
          numColumns={numColumns}
          numImagesPerPost={numColumns > 1 ? 1 : -1}
          paddingTop={headerHeight + (isDesktop ? 10 : 5)}
          displayPosterInfo={false}
          displayReactionControls={false}
          style={{ paddingHorizontal: '0.125rem' }}
        />
      ) : activeTab === 'friends' ? (
        <ResponsiveFullFlatListWrapper
          data={user.friends}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item }) => <FriendRow {...item} className={''} />}
          scrollY={scrollY}
          headerHeight={headerHeight}
        />
      ) : activeTab === 'circles' ? (
        selectedCircle ? (
          <ResponsiveFullFlatListWrapper
            data={selectedCircle.users}
            keyExtractor={(_, index) => index.toString()}
            renderItem={({ item }) => <FriendRow {...item} className={''} />}
            scrollY={scrollY}
            headerHeight={headerHeight}>
            <View className="px-4 py-3">
              <TouchableOpacity
                onPress={() => setSelectedCircle(null)}
                className="flex-row items-center gap-2">
                <Text className="text-xl text-foreground-secondary">‹</Text>
                <Text className="text-lg font-semibold text-foreground">{selectedCircle.name}</Text>
              </TouchableOpacity>
            </View>
          </ResponsiveFullFlatListWrapper>
        ) : (
          <ResponsiveFullFlatListWrapper
            data={user.circles}
            keyExtractor={(_, index) => index.toString()}
            renderItem={({ item }) => (
              <CircleRow circle={item} onPress={() => setSelectedCircle(item)} />
            )}
            scrollY={scrollY}
            headerHeight={headerHeight}
          />
        )
      ) : (
        <View className="flex-1 items-center justify-center">
          <Text className="text-lg">No {activeTab} to display</Text>
        </View>
      )}
      <Header scrollY={scrollY} onHeightChange={handleHeaderHeightChange}>
        <View className="flex-row justify-between px-4 py-3">
          <View className="mt-3 flex-row items-center gap-3">
            <TouchableOpacity
              className="flex-col gap-2"
              onPress={() => setActiveTab('posts')}
              activeOpacity={0.9}>
              <PostsIcon
                active={activeTab === 'posts'}
                size={iconSize}
                onPress={() => setActiveTab('posts')}
              />
              <Text className="text-md font-bold">Posts</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="flex-col gap-2"
              onPress={() => setActiveTab('friends')}
              activeOpacity={0.9}>
              <FriendsIcon
                active={activeTab === 'friends'}
                size={iconSize}
                onPress={() => setActiveTab('friends')}
              />
              <Text className="text-md font-bold">Friends</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="flex-col gap-2"
              onPress={() => setActiveTab('circles')}
              activeOpacity={0.9}>
              <CircleIconNav
                active={activeTab === 'circles'}
                size={iconSize}
                onPress={() => setActiveTab('circles')}
              />
              <Text className="text-md font-bold">Circles</Text>
            </TouchableOpacity>
          </View>
          <View className="-mt-[25px] flex-col items-center gap-1 web:lg:mt-0">
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
      {/* <TouchableOpacity
        className="absolute bottom-24 right-2 size-16 items-center justify-center rounded-2xl bg-primary web:lg:bottom-2"
        onPress={setNumColumns.bind(null, numColumns === 1 ? 2 : 1)}
        activeOpacity={0.8}>
        <LayoutDashboard size={33} className="text-foreground" />
      </TouchableOpacity> */}
    </View>
  );
};
