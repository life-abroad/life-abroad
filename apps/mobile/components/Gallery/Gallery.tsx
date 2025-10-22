import React, { useCallback, useRef } from 'react';
import {
  stackTransition,
  Gallery as GalleryIm,
  type GalleryType,
  TapGestureEvent,
} from 'react-native-zoom-toolkit';

import GalleryImage from './GalleryImage';

const Gallery = ({
  images,
  currentIndex,
  onIndexChange,
  onVerticalPull,
}: {
  images: string[];
  currentIndex: number;
  onIndexChange: (index: number) => void;
  onVerticalPull: () => void;
}) => {
  const ref = useRef<GalleryType>(null);

  // Remember to memoize your callbacks properly to keep a decent performance
  const renderItem = useCallback((item: string, index: number) => {
    return <GalleryImage uri={item} index={index} />;
  }, []);

  const keyExtractor = useCallback((item: string, index: number) => {
    return `${item}-${index}`;
  }, []);

  const onTap = useCallback((e: TapGestureEvent, index: number) => {
    // console.log(`Tapped on index ${index}`);
  }, []);

  return (
    <GalleryIm
      ref={ref}
      data={images}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      onTap={onTap}
      customTransition={undefined}
      tapOnEdgeToItem={false}
      onIndexChange={onIndexChange}
      initialIndex={currentIndex}
      onSwipe={(direction) => {
        direction === 'up' || direction === 'down' ? onVerticalPull() : null;
      }}
    />
  );
};

export default Gallery;
