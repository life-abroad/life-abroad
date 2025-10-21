import React from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity } from 'react-native';
import { FeedPost } from '../../components/Post';
import { posts, stories } from './mockData';
import { ChatBubbleIcon, CircleIconNav, CameraIcon, UserIcon } from 'components/Icons';

export const HomePage = () => {
  return (
    <View className="flex-1 bg-black">
      <View className="h-34 bg-black/24 px-0 py-3">
        <Text
          className="px-8 py-3 text-4xl font-normal text-white"
          style={{ fontFamily: 'System' }}>
          Circle
        </Text>
        <View className="right-90 top-19 absolute">
          <CameraIcon />
        </View>
        <View className="flex-row items-center gap-2.5 rounded-3xl px-3 py-3">
          {stories.map((story, index) => (
            <Image
              key={index}
              source={{ uri: story }}
              className="w-15 h-15 rounded-full"
              style={index < 2 ? { borderWidth: 2, borderColor: 'white' } : {}}
            />
          ))}
        </View>
      </View>

      <ScrollView className="mt-1 flex-1">
        {posts.map((post, index) => (
          <FeedPost key={index} {...post} />
        ))}
      </ScrollView>

      <View className="bg-black/23 h-16 flex-row items-center justify-center gap-9 px-2 py-2.5">
        <View className="h-14 w-14">
          <ChatBubbleIcon />
        </View>
        <View className="w-17 h-21 relative">
          <CircleIconNav />
        </View>
        <View className="w-15 h-15">
          <UserIcon />
        </View>
      </View>
    </View>
  );
};
