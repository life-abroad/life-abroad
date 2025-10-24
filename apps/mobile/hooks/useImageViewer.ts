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
  const [imageMeta, setImageMeta] = useState<Record<string, string>>({});

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
      imageMeta?: Record<string, string>
    ) => {
      setImages(images);
      setUsers(users);
      setImageIndex(initialIndex);
      setImageViewerVisible(true);
      setHideCounter(config?.hideCounter ?? false);
      setHideProgressBar(config?.hideProgressBar ?? false);
      setImageMeta(imageMeta ?? {});
    },
    []
  );

  const closeImageViewer = useCallback(() => {
    setImageViewerVisible(false);
  }, []);

  const handlePostImagePress = useCallback(
    (images: string[], initialIndex = 0, user: User, imageMeta: Record<string, string>) => {
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
        imageMeta
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
    imageMeta,
    // Setters
    setImageIndex,
    setHideProgressBar,
    setHideCounter,
    setImageMeta,
    // Methods
    openImageViewer,
    closeImageViewer,
    handlePostImagePress,
  };
};
