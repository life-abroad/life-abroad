import React from 'react';
import { Image, ImageBackground, View } from 'react-native';
import { ChatBubbleIcon, CircleIconNav, UserIcon } from 'components/Icons';
import { BlurView } from 'expo-blur';

export default function BottomNav() {
  return (
    <View className="bg-black/23 h-20">
      <ImageBackground
        source={require('../assets/wood-grain.png')}
        resizeMode="repeat"
        className="absolute inset-0 opacity-25"
      />
      <BlurView intensity={80} tint="dark" className="absolute inset-0" />

      <View className="h-full w-full flex-row items-center justify-center gap-9 px-2 pb-5">
        <View className="items-center justify-center">
          <ChatBubbleIcon size={36} />
        </View>
        <View className="items-center justify-center">
          <CircleIconNav size={40} />
        </View>
        <View className="items-center justify-center">
          <UserIcon size={40} />
        </View>
      </View>
    </View>
  );
}
