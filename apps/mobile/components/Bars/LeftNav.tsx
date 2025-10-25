import React from 'react';
import { ChatBubbleIcon, CircleIconNav, CircleLogo, UserIcon } from 'components/Icons';
import { Platform, TouchableOpacity, View } from 'react-native';
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
      className={`h-screen border-r-[1px] border-white/10 bg-background px-4 pt-4 ${className}`}>
      {/* <Blur topBar /> */}
      <View className="" pointerEvents="box-none">
        <CircleLogo size={80} />
      </View>
      <View className="h-full w-full flex-col gap-5 py-8">
        <TouchableOpacity
          className="ml-1 flex-row items-center gap-3"
          onPress={() => setSelectedTab('chat')}
          activeOpacity={0.7}>
          <ChatBubbleIcon
            size={Platform.OS === 'web' ? 30 : 40}
            onPress={() => setSelectedTab('chat')}
            active={selectedTab === 'chat'}
          />
          <Text className="text-lg font-medium">Chat</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="flex-row items-center gap-3"
          onPress={() => setSelectedTab('home')}
          activeOpacity={0.7}>
          <CircleIconNav
            size={Platform.OS === 'web' ? 30 : 40}
            active={selectedTab === 'home'}
            onPress={() => setSelectedTab('home')}
          />
          <Text className="text-lg font-medium">Feed</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="flex-row items-center gap-3"
          onPress={() => setSelectedTab('profile')}
          activeOpacity={0.7}>
          <UserIcon
            size={Platform.OS === 'web' ? 30 : 40}
            onPress={() => setSelectedTab('profile')}
            active={selectedTab === 'profile'}
          />
          <Text className="text-lg font-medium">Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
