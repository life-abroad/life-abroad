import React from 'react';
import { View, Image, TouchableOpacity } from 'react-native';
import { Text } from './Text';

interface StoryItemProps {
  story: {
    user: {
      userAvatar: string;
      userName: string;
    };
    seen?: boolean;
  };
  index: number;
  onPress: (index: number) => void;
  size?: number;
  showUsername?: boolean;
  className?: string;
}

export function StoryItem({
  story,
  index,
  onPress,
  size = 60,
  showUsername = false,
  className = '',
}: StoryItemProps) {
  const isGray = story.seen ?? false;

  return (
    <TouchableOpacity
      className={`relative flex-row items-center gap-3 ${className}`}
      onPress={() => onPress(index)}>
      <Image
        source={{ uri: story.user.userAvatar }}
        className={`rounded-full ${index < 2 ? 'border-2 border-white' : ''} ${isGray ? 'opacity-100' : ''}`}
        style={{ height: size, width: size }}
      />
      {isGray && (
        <View
          pointerEvents="none"
          className="absolute rounded-full bg-[rgba(0,0,0,0.4)]"
          style={{ height: size, width: size }}
        />
      )}
      {showUsername && (
        <View className="flex-1">
          <Text className="text-sm font-semibold">{story.user.userName}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}
