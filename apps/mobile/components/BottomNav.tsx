import React from 'react';
import { View } from 'react-native';
import { ChatBubbleIcon, CircleIconNav, UserIcon } from 'components/Icons';

export default function BottomNav() {
  return (
    <View className="bg-black/23 h-16 flex-row items-center justify-center gap-9 px-2 py-2.5">
      <View className="h-14 w-14">
        <ChatBubbleIcon />
      </View>
      <View className="h-14 w-14">
        <CircleIconNav />
      </View>
      <View className="h-14 w-14">
        <UserIcon />
      </View>
    </View>
  );
}
