import React, { useCallback, useEffect, useRef } from 'react';
import { Gallery as GalleryIm, type GalleryType, TapGestureEvent } from 'react-native-zoom-toolkit';
import GalleryImage from './GalleryImage';
import { withTiming } from 'react-native-reanimated';

const Gallery = ({
  images,
  currentIndex,
  onIndexChange,
  onVerticalPull,
  setHideBars,
}: {
  images: string[];
  currentIndex: number;
  onIndexChange: (index: number) => void;
  onVerticalPull: () => void;
  setHideBars?: (hide: boolean) => void;
}) => {
  const ref = useRef<GalleryType>(null);
  const prevIndexRef = useRef<number>(currentIndex);

  // Remember to memoize your callbacks properly to keep a decent performance
  const renderItem = useCallback((item: string, index: number) => {
    return <GalleryImage uri={item} index={index} />;
  }, []);

  const keyExtractor = useCallback((item: string, index: number) => {
    return `${item}-${index}`;
  }, []);

  const onTap = useCallback((e: TapGestureEvent, index: number) => {
    // console.log(`Tapped on index ${index}`);
    setHideBars?.((prev) => !prev);
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

  // Update gallery index when currentIndex prop changes from outside
  useEffect(() => {
    if (currentIndex !== prevIndexRef.current && ref.current) {
      ref.current.setIndex(currentIndex, false);
      prevIndexRef.current = currentIndex;
    }
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
