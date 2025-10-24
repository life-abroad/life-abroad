import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Text } from './Text';

interface Circle {
  name: string;
  color: string;
  users: Array<{
    userName: string;
    userHandle: string;
    userAvatar: string;
    profileUrl: string;
  }>;
}

interface CircleRowProps {
  circle: Circle;
  onPress: () => void;
  className?: string;
}

export default function CircleRow({ circle, onPress, className }: CircleRowProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className={`flex-row items-center justify-between bg-background-secondary px-4 py-4 ${className}`}
      activeOpacity={0.8}>
      {/* Circle indicator */}
      <View className="flex-row items-center gap-3">
        <View className="h-12 w-12 rounded-full" style={{ backgroundColor: circle.color }} />

        {/* Content */}
        <View className="flex-1">
          <Text className="text-base font-semibold text-foreground">{circle.name}</Text>
          <Text className="text-sm text-foreground-secondary">
            {circle.users.length} {circle.users.length === 1 ? 'member' : 'members'}
          </Text>
        </View>
      </View>

      {/* Arrow indicator */}
      <Text className="text-xl text-foreground-secondary">›</Text>
    </TouchableOpacity>
  );
}
