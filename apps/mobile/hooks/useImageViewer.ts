import { useState, useCallback } from 'react';
import { User } from 'types/user';

export interface ImageViewerConfig {
  hideCounter?: boolean;
  hideProgressBar?: boolean;
}

export const useImageViewer = () => {
  // Image viewer meta
  const [imageViewerVisible, setImageViewerVisible] = useState(false);
  const [hideProgressBar, setHideProgressBar] = useState(false);
  const [hideCounter, setHideCounter] = useState(false);
  const [location, setLocation] = useState<string>('hi');

  // Image view data
  const [users, setUsers] = useState<User[]>([]);
  const [images, setImages] = useState<string[]>([]);
  const [imageIndex, setImageIndex] = useState(0);

  const openImageViewer = useCallback(
    (
      images: string[],
      users: User[],
      initialIndex: number = 0,
      config?: ImageViewerConfig,
      location?: string
    ) => {
      setImages(images);
      setUsers(users);
      setImageIndex(initialIndex);
      setImageViewerVisible(true);
      setHideCounter(config?.hideCounter ?? false);
      setHideProgressBar(config?.hideProgressBar ?? false);
      setLocation(location || '');
    },
    []
  );

  const closeImageViewer = useCallback(() => {
    setImageViewerVisible(false);
  }, []);

  const handlePostImagePress = useCallback(
    (images: string[], initialIndex = 0, user: User, location: string) => {
      // Create a users array where the same user is repeated for each image
      const usersArray = images.map(() => user);
      openImageViewer(
        images,
        usersArray,
        initialIndex,
        {
          hideCounter: false,
          hideProgressBar: true,
        },
        location
      );
    },
    [openImageViewer]
  );

  return {
    // State
    imageViewerVisible,
    hideProgressBar,
    hideCounter,
    users,
    images,
    imageIndex,
    location,
    // Setters
    setImageIndex,
    setHideProgressBar,
    setHideCounter,
    setLocation,
    // Methods
    openImageViewer,
    closeImageViewer,
    handlePostImagePress,
  };
};
