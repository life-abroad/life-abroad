import React, { useRef } from 'react';
import { View, Image, Animated, FlatList, TouchableOpacity } from 'react-native';
import { FeedPost } from '../../components/Post';
import { chats, bulletins } from './mockData';
import { CameraIcon, ChatBubbleIcon, CircleLogo } from 'components/Icons';
import { Text } from 'components/Text';
import Blur from 'components/Blur';
import ChatRow from 'components/ChatRow';

export const ChatPage = () => {
  // Scroll animations
  const scrollY = useRef(new Animated.Value(0)).current;
  const diffClampScrollY = Animated.diffClamp(scrollY, 0, 300);
  const headerTranslateY = diffClampScrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [0, -100],
    extrapolate: 'clamp',
  });
  // Add opacity interpolation for fade effect
  const headerOpacity = diffClampScrollY.interpolate({
    inputRange: [0, 60, 90],
    outputRange: [1, 0.7, 0],
    extrapolate: 'clamp',
  });
  const handleChatPress = (chatItem: (typeof chats)[0]) => {
    // Handle chat row press
    console.log('Chat pressed:', chatItem.user.userName);
  };

  return (
    <View className="flex-1 bg-background-secondary/80">
      {chats && chats.length > 0 ? (
        <FlatList
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
          onScroll={(event) => {
            scrollY.setValue(event.nativeEvent.contentOffset.y);
          }}
          scrollEventThrottle={16}
          className="flex-1"
          contentContainerStyle={{ paddingTop: 136, paddingBottom: 70 }}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View className="flex-1 items-center justify-center">
          <Text>No posts available</Text>
        </View>
      )}

      {/* bulletins - Floating Header */}
      <Animated.View
        className="absolute left-0 right-0 top-0 h-40 py-0"
        style={{
          transform: [{ translateY: headerTranslateY }],
          opacity: headerOpacity,
        }}>
        <Blur topBar />
        <View className="px-4 pt-14">
          <CircleLogo size={80} />
        </View>
        {/* bulletins row */}
        <View className="relative px-3 py-3">
          <View className="flex-row items-center gap-3">
            {bulletins.map((bulletin, index) => {
              const isGray = index >= bulletins.length - 2;
              return (
                <TouchableOpacity key={index} className="relative" onPress={() => 0}>
                  <Image
                    source={{ uri: bulletin.user.userAvatar }}
                    className={`h-[50] w-[50] rounded-full ${index < 2 ? 'border-2 border-white' : ''} ${isGray ? 'opacity-100' : ''}`}
                  />
                  {isGray && (
                    <View
                      pointerEvents="none"
                      className="absolute inset-0 rounded-full bg-[rgba(0,0,0,0.4)]"
                    />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
          <View className="absolute bottom-5 right-4 items-center justify-center">
            <ChatBubbleIcon size={35} onPress={() => {}} />
          </View>
        </View>
      </Animated.View>
    </View>
  );
};
