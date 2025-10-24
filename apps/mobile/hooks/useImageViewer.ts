import { useState, useCallback } from 'react';
import { User } from 'types/user';
import { Reaction } from 'types/post';

export interface ImageViewerConfig {
  hideTopBar?: boolean;
  hideProgressBar?: boolean;
}

export const useImageViewer = () => {
  // Image viewer meta
  const [imageViewerVisible, setImageViewerVisible] = useState(false);
  const [hideProgressBar, setHideProgressBar] = useState(false);
  const [hideTopBar, sethideTopBar] = useState(false);
  const [imageMeta, setImageMeta] = useState<Record<string, string>>({});

  // Image view data
  const [users, setUsers] = useState<User[]>([]);
  const [images, setImages] = useState<string[]>([]);
  const [imageIndex, setImageIndex] = useState(0);
  const [reactions, setReactions] = useState<Reaction[][]>([]);

  const openImageViewer = useCallback(
    (
      images: string[],
      users: User[],
      initialIndex: number = 0,
      config?: ImageViewerConfig,
      imageMeta?: Record<string, string>,
      reactions?: Reaction[][]
    ) => {
      setImages(images);
      setUsers(users);
      setImageIndex(initialIndex);
      setImageViewerVisible(true);
      sethideTopBar(config?.hideTopBar ?? false);
      setHideProgressBar(config?.hideProgressBar ?? false);
      setImageMeta(imageMeta ?? {});
      setReactions(reactions ?? []);
    },
    []
  );

  const closeImageViewer = useCallback(() => {
    setImageViewerVisible(false);
  }, []);

  const handlePostImagePress = useCallback(
    (
      images: string[],
      initialIndex = 0,
      user: User,
      imageMeta: Record<string, string>,
      postReactions?: Reaction[]
    ) => {
      // Create a users array where the same user is repeated for each image
      const usersArray = images.map(() => user);
      // Create reactions array - same reactions for each image in the post
      const reactionsArray = images.map(() => postReactions ?? []);
      openImageViewer(
        images,
        usersArray,
        initialIndex,
        {
          hideTopBar: false,
          hideProgressBar: true,
        },
        imageMeta,
        reactionsArray
      );
    },
    [openImageViewer]
  );

  return {
    // State
    imageViewerVisible,
    hideProgressBar,
    hideTopBar,
    users,
    images,
    imageIndex,
    imageMeta,
    reactions,
    // Setters
    setImageIndex,
    setHideProgressBar,
    sethideTopBar,
    setImageMeta,
    // Methods
    openImageViewer,
    closeImageViewer,
    handlePostImagePress,
  };
};
