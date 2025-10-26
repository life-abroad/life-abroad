import React from 'react';
import { ImageBackground } from 'react-native';
import { useResponsive } from 'contexts/ResponsiveContext';

function CircleBg() {
  const { isDesktop } = useResponsive();

  return (
    <ImageBackground
      source={require('../assets/textures/circle.png')}
      resizeMode={`repeat`}
      style={{
        position: 'absolute',
        width: '100%',
        height: '100%',
        opacity: isDesktop ? 0.06 : 0.09,
      }}
      className={`absolute inset-0 `}
    />
  );
}

export default CircleBg;
