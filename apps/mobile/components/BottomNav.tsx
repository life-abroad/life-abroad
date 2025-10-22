import React from 'react';
import { ChatBubbleIcon, CircleIconNav, UserIcon } from 'components/Icons';
import { View } from 'react-native';
import Blur from './Blur';

export default function BottomNav({
  selectedTab,
  setSelectedTab,
}: {
  selectedTab: string;
  setSelectedTab: (tab: string) => void;
}) {
  return (
    <View className="h-20">
      <Blur />
      <View className="h-full w-full flex-row items-center justify-center gap-9 px-2 pb-5">
        <ChatBubbleIcon size={36} onPress={() => setSelectedTab('chat')} />
        <CircleIconNav
          size={40}
          active={selectedTab === 'home'}
          onPress={() => setSelectedTab('home')}
        />
        <UserIcon size={40} onPress={() => setSelectedTab('profile')} />
      </View>
    </View>
  );
}
