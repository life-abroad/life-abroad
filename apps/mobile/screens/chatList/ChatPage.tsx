import React, { useCallback, useRef, useState } from 'react';
import { View, Image, Animated, FlatList, TouchableOpacity, ImageBackground } from 'react-native';
import { FeedPost } from '../../components/Post';
import { chats, bulletins } from './mockData';
import { CameraIcon, ChatBubbleIcon, CircleLogo } from 'components/Icons';
import { Text } from 'components/Text';
import Blur from 'components/Blur';
import ChatRow from 'components/ChatRow';
import Header from 'components/Bars/Header';
import { ScrollView } from 'react-native-gesture-handler';
import { LinearGradient } from 'expo-linear-gradient';
import CircleBg from 'components/CircleBg';
import { useResponsive } from 'contexts/ResponsiveContext';
import ResponsiveWrapper, { ResponsiveFullFlatListWrapper } from 'components/ResponsiveWrapper';

export const ChatPage = ({ className }: { className?: string }) => {
  const [headerHeight, setHeaderHeight] = useState<number>(190); // Default fallback
  // Memoize header height callback to prevent re-renders
  const handleHeaderHeightChange = useCallback((height: number) => {
    setHeaderHeight(height);
  }, []);

  const scrollY = useRef(new Animated.Value(0)).current;
  const { isDesktop, isWeb } = useResponsive();

  const handleChatPress = (chatItem: (typeof chats)[0]) => {
    // Handle chat row press
    console.log('Chat pressed:', chatItem.user.userName);
  };

  return (
    <View className={`flex-1 ${className}`}>
      <CircleBg />

      {chats && chats.length > 0 ? (
        <ResponsiveFullFlatListWrapper
          data={chats}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item }) => (
            <ChatRow
              user={item.user}
              unreadCount={item.unreadCount}
              lastMessage={item.lastMessage}
              timestamp={item.timestamp}
              onPress={() => handleChatPress(item)}
            />
          )}
          scrollY={scrollY}
          headerHeight={headerHeight}
        />
      ) : (
        <View className="flex-1 items-center justify-center bg-background">
          <Text>No posts available</Text>
        </View>
      )}

      {/* bulletins - Floating Header */}
      <Header scrollY={scrollY} onHeightChange={handleHeaderHeightChange}>
        {/* bulletins row */}
        <View className="relative py-3">
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            // onScroll={handleScroll}
            scrollEventThrottle={16}
            fadingEdgeLength={15}
            className="w-[100%]">
            <View className={`pl- flex-row items-center gap-2 px-3`}>
              {bulletins.map((bulletin, index) => {
                const isGray = index >= bulletins.length - 2;
                return (
                  <TouchableOpacity
                    key={index}
                    className="relative items-center"
                    onPress={() => 0}
                    activeOpacity={0.8}>
                    {/* Message bubble */}
                    <View className="z-10 -mb-3 h-[60px] w-[80px] justify-center overflow-hidden rounded-2xl bg-white px-1 py-2 shadow-md">
                      <Text className="text-center text-[0.6rem] leading-tight text-gray-900">
                        {bulletin.content}
                      </Text>
                    </View>
                    {/* Avatar */}
                    <Image
                      source={{ uri: bulletin.user.userAvatar }}
                      className={`h-[50] w-[50] rounded-full border-2 border-white`}
                    />
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>
        </View>
      </Header>
      <TouchableOpacity
        className="absolute bottom-24 right-2 size-16 items-center justify-center rounded-2xl bg-primary web:lg:bottom-2"
        activeOpacity={0.8}>
        <ChatBubbleIcon plus size={33} onPress={() => {}} />
      </TouchableOpacity>
    </View>
  );
};
