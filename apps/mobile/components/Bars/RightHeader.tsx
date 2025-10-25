import React from 'react';
import { View, ScrollView } from 'react-native';
import { CircleLogo } from 'components/Icons';

interface RightHeaderProps {
  children?: React.ReactNode;
  className?: string;
}

function RightHeader({ children, className }: RightHeaderProps) {
  return (
    <View
      className={`h-screen border-l-[1px] border-white/10 bg-background-secondary ${className}`}>
      <View className="px-4 pt-4" pointerEvents="box-none">
        <CircleLogo size={80} />
      </View>
      <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
        {children}
      </ScrollView>
    </View>
  );
}

export default RightHeader;
