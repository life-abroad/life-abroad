import React from 'react';
import { View, TouchableOpacity, Image, ImageBackground } from 'react-native';
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
  // Get up to 4 users to display in the grid
  const displayUsers = circle.users.slice(0, 4);

  return (
    <TouchableOpacity
      onPress={onPress}
      className={`flex-row items-center justify-between bg-background-secondary px-4 py-4 ${className}`}
      activeOpacity={0.8}>
      {/* Circle indicator with member grid */}
      <View className="flex-row items-center gap-3">
        <View
          className="h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-white"
          style={{ borderWidth: 2, borderColor: circle.color }}>
          {displayUsers.length > 0 && (
            <View className="h-full w-full flex-row flex-wrap">
              {displayUsers.map((user, index) => (
                <View
                  key={index}
                  className="items-center justify-center"
                  style={{
                    width: displayUsers.length === 1 ? '100%' : '50%',
                    height: displayUsers.length === 1 || displayUsers.length === 2 ? '100%' : '50%',
                  }}>
                  <Image
                    source={{ uri: user.userAvatar }}
                    className="h-full w-full"
                    style={{ resizeMode: 'cover' }}
                  />
                </View>
              ))}
            </View>
          )}
        </View>

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
