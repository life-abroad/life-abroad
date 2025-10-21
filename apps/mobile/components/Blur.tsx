import React from 'react';
import { ImageBackground, View } from 'react-native';
import { BlurView } from '@react-native-community/blur';
import { LinearGradient } from 'expo-linear-gradient';

function Blur({ topBar }: { topBar?: boolean }) {
  return (
    <View style={{ position: 'absolute', width: '100%', height: '100%', overflow: 'hidden' }}>
      {/* Frosted glass blur */}
      <BlurView
        style={{ position: 'absolute', width: '100%', height: '100%' }}
        blurType="dark"
        blurAmount={topBar ? 32 : 32}
        reducedTransparencyFallbackColor="black"
        blurRadius={15}
        // experimentalBlurMethod="dimezisBlurView"
      />
      {/* Background texture */}
      <ImageBackground
        source={require('../assets/wood-grain.png')}
        resizeMode="repeat"
        className={`absolute inset-0 ${topBar ? 'opacity-10' : 'opacity-15'}`}
      />
      {/* Black frosted overlay */}
      <View className="absolute inset-0 bg-black/25" />

      {/* Bottom edge subtle glow */}
      {!topBar ? (
        <>
          <LinearGradient
            colors={['rgba(255, 255, 255, 0)', 'rgba(200, 220, 255, 0.2)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            className="absolute bottom-0 left-0 right-0 h-2"
          />
          {/* Top edge highlight */}
          <LinearGradient
            colors={['rgba(255, 255, 255, 0.4)', 'rgba(255, 255, 255, 0)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 0.3 }}
            className="absolute left-0 right-0 top-0 h-1"
          />
        </>
      ) : (
        <LinearGradient
          colors={['rgba(255, 255, 255, 0.4)', 'rgba(255, 255, 255, 0)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 0.3 }}
          className="absolute bottom-[-3] left-0 right-0 h-1"
        />
      )}
      {/* Side Edges */}
      <LinearGradient
        colors={[
          'rgba(255, 255, 255, 0.1)',
          'rgba(200, 220, 255, 0.1)',
          'rgba(255, 255, 255, 0)',
          'rgba(180, 200, 255, 0.10)',
          'rgba(255, 255, 255, 0.15)',
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className={`absolute inset-0 ${topBar ? 'opacity-15' : 'opacity-10'}`}
      />
    </View>
  );
}

export default Blur;
