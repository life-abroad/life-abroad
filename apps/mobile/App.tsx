import { HomePage } from 'screens/homepage/HomePage';
import { StatusBar } from 'expo-status-bar';
import BottomNav from 'components/BottomNav';
import './global.css';
import { View } from 'react-native';
import { useEffect } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import { MadimiOne_400Regular } from '@expo-google-fonts/madimi-one';

SplashScreen.preventAutoHideAsync();

export default function App() {
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
    <View className="flex-1 bg-background-secondary">
      <View className="flex-1">
        <HomePage />
      </View>
      <View className="absolute bottom-0 left-0 right-0 z-50">
        <BottomNav />
      </View>
      <StatusBar style="light" translucent />
    </View>
  );
}
