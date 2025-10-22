import React, { useCallback, useRef } from 'react';
import { stackTransition, Gallery as GalleryIm, type GalleryType } from 'react-native-zoom-toolkit';

import GalleryImage from './GalleryImage';

const Gallery = ({
  images,
  currentIndex,
  onIndexChange,
}: {
  images: string[];
  currentIndex: number;
  onIndexChange: (index: number) => void;
}) => {
  const ref = useRef<GalleryType>(null);

  // Remember to memoize your callbacks properly to keep a decent performance
  const renderItem = useCallback((item: string, index: number) => {
    return <GalleryImage uri={item} index={index} />;
  }, []);

  const keyExtractor = useCallback((item: string, index: number) => {
    return `${item}-${index}`;
  }, []);

  const onTap = useCallback((_, index: number) => {
    console.log(`Tapped on index ${index}`);
  }, []);

  const transition = useCallback(stackTransition, []);

  return (
    <GalleryIm
      ref={ref}
      data={images}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      onTap={onTap}
      customTransition={transition}
      onIndexChange={onIndexChange}
      initialIndex={currentIndex}
    />
  );
};

export default Gallery;
