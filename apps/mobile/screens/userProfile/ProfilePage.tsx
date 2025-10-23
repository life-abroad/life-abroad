import React, { useRef } from 'react';
import { View, Animated, Image, FlatList, TouchableOpacity, ImageBackground } from 'react-native';
import { chats, bulletins } from './mockData';
import { ChatBubbleIcon } from 'components/Icons';
import { Text } from 'components/Text';
import ChatRow from 'components/ChatRow';
import Header from 'components/Header';

export const ProfilePage = () => {
  const scrollY = useRef(new Animated.Value(0)).current;

  const handleChatPress = (chatItem: (typeof chats)[0]) => {
    // Handle chat row press
    console.log('Chat pressed:', chatItem.user.userName);
  };

  return (
    <View className="flex-1 bg-background-secondary">
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
          contentContainerStyle={{ paddingTop: 190, paddingBottom: 70 }}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View className="flex-1 items-center justify-center">
          <Text>No posts available</Text>
        </View>
      )}

      {/* bulletins - Floating Header */}
      <Header scrollY={scrollY}>
        <View className="relative px-3 py-3">
          <View className="max-w-24 flex-row items-center gap-2 "></View>
          <View className="absolute bottom-5 right-4 items-center justify-center">
            <ChatBubbleIcon size={35} onPress={() => {}} />
          </View>
        </View>
      </Header>
    </View>
  );
};
