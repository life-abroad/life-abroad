import React from 'react';
import { View, Image, ScrollView, ImageBackground } from 'react-native';
import { FeedPost } from '../../components/Post';
import { posts, stories } from './mockData';
import { CameraIcon, CircleLogo } from 'components/Icons';
import { Text } from 'components/Text';

export const HomePage = () => {
  return (
    <View className="flex-1">
      {/* Stories */}
      <View className="h-40 py-0">
        <ImageBackground
          source={require('../../assets/wood-grain.png')}
          resizeMode="repeat"
          className="absolute inset-0 opacity-25"
        />
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
      </View>

      <ScrollView className="mt-1 flex-1">
        {posts.map((post, index) => (
          <FeedPost key={index} {...post} />
        ))}
      </ScrollView>
    </View>
  );
};
