import React from 'react';
import { ChatBubbleIcon, CircleIconNav, CircleLogo, UserIcon } from 'components/Icons';
import { Platform, View } from 'react-native';
import Blur from '../Blur';
import { Text } from '../Text';

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
    <View
      className={`h-screen border-r-[1px] border-white/10 bg-background-secondary px-4 pt-4 ${className}`}>
      {/* <Blur topBar /> */}
      <View className="" pointerEvents="box-none">
        <CircleLogo size={80} />
      </View>
      <View className="h-full w-full flex-col gap-14 py-8">
        <View className="ml-1 flex-row items-center gap-3">
          <ChatBubbleIcon
            size={Platform.OS === 'web' ? 30 : 40}
            onPress={() => setSelectedTab('chat')}
            active={selectedTab === 'chat'}
          />
          <Text className="text-lg font-medium">Chat</Text>
        </View>
        <View className="flex-row items-center gap-3">
          <CircleIconNav
            size={Platform.OS === 'web' ? 30 : 40}
            active={selectedTab === 'home'}
            onPress={() => setSelectedTab('home')}
          />
          <Text className="text-lg font-medium">Feed</Text>
        </View>
        <View className="flex-row items-center gap-3">
          <UserIcon
            size={Platform.OS === 'web' ? 30 : 40}
            onPress={() => setSelectedTab('profile')}
            active={selectedTab === 'profile'}
          />
          <Text className="text-lg font-medium">Profile</Text>
        </View>
      </View>
    </View>
  );
}
