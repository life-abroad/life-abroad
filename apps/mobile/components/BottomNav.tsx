import React from 'react';
import { ChatBubbleIcon, CircleIconNav, UserIcon } from 'components/Icons';
import { View } from 'react-native';
import Blur from './Blur';

export default function BottomNav() {
  return (
    <View className="h-20">
      <Blur />
      <View className="h-full w-full flex-row items-center justify-center gap-9 px-2 pb-5">
        <ChatBubbleIcon size={36} />
        <CircleIconNav size={40} active />
        <UserIcon size={40} />
      </View>
    </View>
  );
}
