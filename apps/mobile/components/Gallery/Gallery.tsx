import React, { useCallback, useEffect, useRef } from 'react';
import { Gallery as GalleryIm, type GalleryType, TapGestureEvent } from 'react-native-zoom-toolkit';

import GalleryImage from './GalleryImage';
import { withTiming } from 'react-native-reanimated';

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

  const customTransition = (state: any) => {
    'worklet';
    const { index, vertical, scroll, gallerySize } = state;

    if (vertical) {
      const translateY = withTiming(index * gallerySize.height - scroll, { duration: 0 });
      return { transform: [{ translateY }] };
    }

    const translateX = withTiming(index * gallerySize.width - scroll, { duration: 0 });
    return { transform: [{ translateX }] };
  };

  useEffect(() => {
    console.log('Gallery Current Index:', currentIndex);
  }, [currentIndex]);

  return (
    <GalleryIm
      ref={ref}
      data={images}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      onTap={onTap}
      customTransition={customTransition}
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
