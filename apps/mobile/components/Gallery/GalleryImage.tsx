import { useResponsive } from 'contexts/ResponsiveContext';
import React, { useState } from 'react';
import { Image, useWindowDimensions } from 'react-native';
import { fitContainer } from 'react-native-zoom-toolkit';

type GalleryImageProps = {
  uri: string;
  index: number;
};

const GalleryImage: React.FC<GalleryImageProps> = ({ uri, index }) => {
  const { isDesktop } = useResponsive();
  const { width, height } = useWindowDimensions();
  const [resolution, setResolution] = useState<{
    width: number;
    height: number;
  }>({
    width: 1,
    height: 1,
  });
  const size = { width, height: isDesktop ? height - 25 : height }; // adding some padding on desktop

  return (
    <Image
      source={{ uri }}
      style={size}
      resizeMethod={'scale'}
      resizeMode={'contain'}
      onLoad={(e) => {
        setResolution({
          width: e.nativeEvent.source.width,
          height: e.nativeEvent.source.height,
        });
      }}
    />
  );
};

export default GalleryImage;
