import React from 'react';
import { ImageBackground, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useResponsive } from 'contexts/ResponsiveContext';

function CircleBg() {
  const { isDesktop } = useResponsive();

  return (
    <View style={{ position: 'absolute', width: '100%', height: '100%' }}>
      <ImageBackground
        source={require('../assets/textures/circle.png')}
        resizeMode={isDesktop ? 'repeat' : 'cover'}
        style={{
          width: '100%',
          height: '100%',
          opacity: isDesktop ? 0.06 : 0.09,
        }}
        className={`absolute inset-0 `}
      />
      {!isDesktop && (
        <LinearGradient
          colors={['rgba(0,0,0,1)', 'rgba(0,0,0,0)']}
          start={[0, 0]}
          end={[0, 1]}
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
          }}
        />
      )}
    </View>
  );
}

export default CircleBg;
