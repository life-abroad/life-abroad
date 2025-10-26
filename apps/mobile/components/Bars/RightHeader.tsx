import React from 'react';
import { View, ScrollView } from 'react-native';
import { CircleLogo } from 'components/Icons';

interface RightHeaderProps {
  children?: React.ReactNode;
  className?: string;
}

function RightHeader({ children, className }: RightHeaderProps) {
  return (
    <View className={`h-screen border-l-[1px] border-white/10 bg-background ${className}`}>
      <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
        {children}
      </ScrollView>
    </View>
  );
}

export default RightHeader;
