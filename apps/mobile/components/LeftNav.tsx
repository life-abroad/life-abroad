import React from 'react';
import { ChatBubbleIcon, CircleIconNav, CircleLogo, UserIcon } from 'components/Icons';
import { Platform, View } from 'react-native';
import Blur from './Blur';

export default function LeftNav({
  selectedTab,
  setSelectedTab,
  className,
}: {
  selectedTab: string;
  setSelectedTab: (tab: string) => void;
  className?: string;
}) {
  return (
    <View className={`h-screen border-r-[1px] border-white ${className}`}>
      {/* <Blur topBar /> */}
      <View className="native:pt-14 px-4 web:pt-4" pointerEvents="box-none">
        <CircleLogo size={80} />
      </View>
      <View className="h-full w-full flex-col items-center justify-center gap-44 py-8">
        <View className="ml-1">
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
