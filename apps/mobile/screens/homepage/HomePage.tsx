import React, { useRef } from 'react';
import { View, Image, ScrollView, ImageBackground, Animated, Easing, FlatList } from 'react-native';
import { FeedPost } from '../../components/Post';
import { posts, stories } from './mockData';
import { CameraIcon, CircleLogo } from 'components/Icons';
import { Text } from 'components/Text';
import { BlurView } from 'expo-blur';

export const HomePage = () => {
  const scrollY = useRef(new Animated.Value(0)).current;
  const diffClampScrollY = Animated.diffClamp(scrollY, 0, 300);
  const headerTranslateY = diffClampScrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [0, -100],
    extrapolate: 'clamp',
  });

  return (
    <View className="flex-1">
      <FlatList
        data={posts}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }) => <FeedPost {...item} />}
        onScroll={(event) => {
          scrollY.setValue(event.nativeEvent.contentOffset.y);
        }}
        scrollEventThrottle={16}
        className="flex-1 pt-[140]"
      />

      {/* Stories - Floating Header */}
      <Animated.View
        className="absolute left-0 right-0 top-0 h-40 py-0"
        style={{ transform: [{ translateY: headerTranslateY }] }}>
        <ImageBackground
          source={require('../../assets/wood-grain.png')}
          resizeMode="repeat"
          className="absolute inset-0 opacity-25"
        />
        <BlurView intensity={80} tint="dark" className="absolute inset-0" />
        <View className="px-4">
          <CircleLogo size={80} />
        </View>
        <View className="flex-row items-center justify-between rounded-3xl px-3 py-3">
          <View className="flex-row items-center gap-2.5">
            {stories.map((story, index) => (
              <Image
                key={index}
                source={{ uri: story }}
                className="w-15 h-15 rounded-full"
                style={index < 2 ? { borderWidth: 2, borderColor: 'white' } : {}}
              />
            ))}
          </View>
          <CameraIcon />
        </View>
      </Animated.View>
    </View>
  );
};
