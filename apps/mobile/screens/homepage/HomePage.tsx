import React, { useRef } from 'react';
import { View, Image, ScrollView, ImageBackground, Animated, Easing, FlatList } from 'react-native';
import { FeedPost } from '../../components/Post';
import { posts, stories } from './mockData';
import { CameraIcon, CircleLogo } from 'components/Icons';
import { Text } from 'components/Text';
import { BlurView } from 'expo-blur';
import Blur from 'components/Blur';

export const HomePage = () => {
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

  return (
    <View className="flex-1">
      {posts && posts.length > 0 ? (
        <FlatList
          data={posts}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item }) => <FeedPost {...item} />}
          onScroll={(event) => {
            scrollY.setValue(event.nativeEvent.contentOffset.y);
          }}
          scrollEventThrottle={16}
          className="flex-1 pt-[138]"
        />
      ) : (
        <View className="flex-1 items-center justify-center">
          <Text>No posts available</Text>
        </View>
      )}

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
                <View key={index} className="relative">
                  <Image
                    source={{ uri: story }}
                    className={`h-[50] w-[50] rounded-full ${index < 2 ? 'border-2 border-white' : ''} ${isGray ? 'opacity-100' : ''}`}
                  />
                  {isGray && (
                    <View
                      pointerEvents="none"
                      className="absolute inset-0 rounded-full bg-[rgba(0,0,0,0.4)]"
                    />
                  )}
                </View>
              );
            })}
          </View>
          <View className="absolute bottom-3 right-4 items-center justify-center">
            <CameraIcon size={44} />
          </View>
        </View>
      </Animated.View>
    </View>
  );
};
