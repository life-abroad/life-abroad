import { HomePage } from 'screens/homepage/HomePage';
import { ChatPage } from 'screens/chatList/ChatPage';
import { StatusBar } from 'expo-status-bar';
import BottomNav from 'components/BottomNav';
import './global.css';
import { View } from 'react-native';
import React, { useEffect } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import { MadimiOne_400Regular } from '@expo-google-fonts/madimi-one';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { PageTransition } from 'components/PageTransition';

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [selectedTab, setSelectedTab] = React.useState('home');

  const [fontsLoaded] = useFonts({
    MadimiOne_400Regular,
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <GestureHandlerRootView>
      <View className="flex-1 bg-background">
        <View className="flex-1">
          <PageTransition isActive={selectedTab === 'home'} direction="right">
            <HomePage />
          </PageTransition>
          <PageTransition isActive={selectedTab === 'chat'} direction="left">
            <ChatPage />
          </PageTransition>
        </View>
        <View className="absolute bottom-0 left-0 right-0 z-30">
          <BottomNav selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
        </View>
        <StatusBar style="light" translucent />
      </View>
    </GestureHandlerRootView>
  );
}
