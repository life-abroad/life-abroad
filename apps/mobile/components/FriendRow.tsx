import React from 'react';
import { View, Image, TouchableOpacity } from 'react-native';
import { Text } from './Text';
import { User } from 'types/user';

interface FriendRowProps extends User {
  onPress?: () => void;
  className?: string;
}

export default function FriendRow({
  userName,
  userHandle,
  userAvatar,
  profileUrl,
  onPress,
  className,
}: FriendRowProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className={`flex-row items-center bg-background-secondary px-4 py-3 ${className}`}
      activeOpacity={0.8}>
      {/* Avatar */}
      <Image source={{ uri: userAvatar }} className="h-14 w-14 rounded-full" />

      {/* Content */}
      <View className="ml-3 flex-1">
        <View className="mb-1 flex-row items-center justify-between">
          <Text className="text-base font-semibold text-foreground">{userName}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}
