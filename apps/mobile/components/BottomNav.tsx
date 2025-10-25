import React from 'react';
import { ChatBubbleIcon, CircleIconNav, UserIcon } from 'components/Icons';
import { Platform, View } from 'react-native';
import Blur from './Blur';

export default function BottomNav({
  selectedTab,
  setSelectedTab,
  className,
}: {
  selectedTab: string;
  setSelectedTab: (tab: string) => void;
  className?: string;
}) {
  return (
    <View className={`${className}`}>
      <Blur />
      <View className="android:pb-5 h-full w-full flex-row items-center justify-center gap-12 px-2">
        <View className="mt-1">
          <ChatBubbleIcon
            size={Platform.OS === 'web' ? 30 : 40}
            onPress={() => setSelectedTab('chat')}
            active={selectedTab === 'chat'}
          />
        </View>
        <CircleIconNav
          size={Platform.OS === 'web' ? 30 : 40}
          active={selectedTab === 'home'}
          onPress={() => setSelectedTab('home')}
        />
        <UserIcon
          size={Platform.OS === 'web' ? 30 : 40}
          onPress={() => setSelectedTab('profile')}
          active={selectedTab === 'profile'}
        />
      </View>
    </View>
  );
}
