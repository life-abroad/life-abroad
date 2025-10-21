import React from 'react';
import { Image, ImageBackground, View } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';

function Blur() {
  return (
    <>
      {' '}
      {/* Frosted glass blur */}
      <BlurView
        intensity={25}
        tint="dark"
        className="absolute inset-0"
        experimentalBlurMethod="dimezisBlurView"
      />
      {/* Background texture */}
      <ImageBackground
        source={require('../assets/wood-grain.png')}
        resizeMode="repeat"
        className="absolute inset-0 opacity-15"
      />
      {/* Black frosted overlay */}
      <View className="absolute inset-0 bg-black/15" />
      {/* Light dispersion - multiple gradient layers */}
      {/* <LinearGradient
        colors={[
          'rgba(255, 255, 255, 0.1)',
          'rgba(200, 220, 255, 0.1)',
          'rgba(255, 255, 255, 0)',
          'rgba(180, 200, 255, 0.10)',
          'rgba(255, 255, 255, 0.15)',
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="absolute inset-0"
      /> */}
      {/* Light refraction gradient */}
      {/* Top edge highlight */}
      <LinearGradient
        colors={['rgba(255, 255, 255, 0.4)', 'rgba(255, 255, 255, 0)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 0.3 }}
        className="absolute left-0 right-0 top-0 h-1"
      />
      {/* Bottom edge subtle glow */}
      <LinearGradient
        colors={['rgba(255, 255, 255, 0)', 'rgba(200, 220, 255, 0.2)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        className="absolute bottom-0 left-0 right-0 h-2"
      />
    </>
  );
}

export default Blur;
