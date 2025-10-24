import React from 'react';
import { View, Image, TouchableOpacity } from 'react-native';
import { Text } from './Text';
import { ChatRow as ChatRowType } from 'types/chat';

interface ChatRowProps extends ChatRowType {
  onPress?: () => void;
}

function ChatRow({ user, unreadCount, lastMessage, timestamp, onPress }: ChatRowProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="flex-row items-center bg-background-secondary px-4 py-3"
      activeOpacity={0.8}>
      {/* Avatar */}
      <Image source={{ uri: user.userAvatar }} className="h-14 w-14 rounded-full" />

      {/* Content */}
      <View className="ml-3 flex-1">
        <View className="mb-1 flex-row items-center justify-between">
          <Text className="text-base font-semibold text-foreground">{user.userName}</Text>
          <Text
            className={`text-xs ${unreadCount > 0 ? 'font-bold text-primary' : 'text-foreground-muted'}`}>
            {timestamp}
          </Text>
        </View>
        <View className="flex-row items-center justify-between">
          <Text
            className={`mr-2 flex-1 text-sm ${unreadCount > 0 ? 'text-foreground' : 'text-foreground-muted'}`}>
            {lastMessage}
          </Text>
          {unreadCount > 0 && (
            <View className="size-6 items-center justify-center rounded-full bg-primary">
              <Text className="text-sm font-extrabold text-white">{unreadCount}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default ChatRow;
