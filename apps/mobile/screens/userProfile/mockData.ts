import { UserProfile } from 'types/user';

const user: UserProfile = {
  userName: 'Thomas Brown',
  userHandle: 'tbrown',
  userAvatar:
    'https://images.rawpixel.com/image_800/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDIzLTA5L3Jhd3BpeGVsX29mZmljZV8zNF9waG90b19vZl9hZnJpY2FuLWFtZXJpY2FuX3dvbWFuX2NvbXBhbnlfd29ya19kNmM4MmJhNS1iYjA2LTRkN2EtYjJlMy1hNDZhNDYyMjA0ZmZfMS5qcGc.jpg',
  profileUrl: '/users/tbrown',
  friends: [
    {
      userName: 'Nathan Baker',
      userHandle: 'nbaker',
      userAvatar:
        'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
      profileUrl: '/users/nbaker',
    },
    {
      userName: 'Lisa Wong',
      userHandle: 'lwong',
      userAvatar:
        'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
      profileUrl: '/users/lwong',
    },
    {
      userName: 'Maya Johnson',
      userHandle: 'mjohnson',
      userAvatar:
        'https://images.rawpixel.com/image_800/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDIzLTA5L3Jhd3BpeGVsX29mZmljZV8zNF9waG90b19vZl9hZnJpY2FuLWFtZXJpY2FuX3dvbWFuX2NvbXBhbnlfd29ya19kNmM4MmJhNS1iYjA2LTRkN2EtYjJlMy1hNDZhNDYyMjA0ZmZfMS5qcGc.jpg',
      profileUrl: '/users/mjohnson',
    },
  ],
  circles: [
    {
      name: 'Friends',
      color: '#FF5733',
      users: [
        {
          userName: 'Nathan Baker',
          userHandle: 'nbaker',
          userAvatar:
            'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
          profileUrl: '/users/nbaker',
        },
        {
          userName: 'Lisa Wong',
          userHandle: 'lwong',
          userAvatar:
            'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
          profileUrl: '/users/lwong',
        },
      ],
    },
    {
      name: 'Family',
      color: '#33C1FF',
      users: [
        {
          userName: 'Maya Johnson',
          userHandle: 'mjohnson',
          userAvatar:
            'https://images.rawpixel.com/image_800/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDIzLTA5L3Jhd3BpeGVsX29mZmljZV8zNF9waG90b19vZl9hZnJpY2FuLWFtZXJpY2FuX3dvbWFuX2NvbXBhbnlfd29ya19kNmM4MmJhNS1iYjA2LTRkN2EtYjJlMy1hNDZhNDYyMjA0ZmZfMS5qcGc.jpg',
          profileUrl: '/users/mjohnson',
        },
      ],
    },
    { name: 'Work', color: '#75FF33', users: [] },
  ],
  posts: [
    {
      user: {
        userName: 'Thomas Brown',
        userHandle: 'tbrown',
        userAvatar:
          'https://images.rawpixel.com/image_800/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDIzLTA5L3Jhd3BpeGVsX29mZmljZV8zNF9waG90b19vZl9hZnJpY2FuLWFtZXJpY2FuX3dvbWFuX2NvbXBhbnlfd29ya19kNmM4MmJhNS1iYjA2LTRkN2EtYjJlMy1hNDZhNDYyMjA0ZmZfMS5qcGc.jpg',
        profileUrl: '/users/tbrown',
      },
      location: 'Nara, Japan',
      timestamp: 'Yesterday, 10:01am',
      images: [
        'https://career-advice.jobs.ac.uk/wp-content/uploads/Japan-e1634207070862.jpg.optimal.jpg',
        'https://preview.redd.it/fopp0b1xu2151.jpg?width=640&crop=smart&auto=webp&s=b5aa6b1ccb57b53d4422adfcec2c24477a81df84',
        'https://121clicks.com/wp-content/uploads/2024/07/discover-japan-hisa-matsumura-01.jpg',
        'https://i.pinimg.com/564x/b1/3e/12/b13e1235906241a0f61923da76ade35d.jpg',
      ],
      // caption: 'View from Tokyo Tower',
      comment: 'Thomas Brown: Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      reactions: [
        {
          userAvatar:
            'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
          emoji: '❤️',
        },
      ],
    },
    {
      user: {
        userName: 'Thomas Brown',
        userHandle: 'tbrown',
        userAvatar:
          'https://images.rawpixel.com/image_800/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDIzLTA5L3Jhd3BpeGVsX29mZmljZV8zNF9waG90b19vZl9hZnJpY2FuLWFtZXJpY2FuX3dvbWFuX2NvbXBhbnlfd29ya19kNmM4MmJhNS1iYjA2LTRkN2EtYjJlMy1hNDZhNDYyMjA0ZmZfMS5qcGc.jpg',
        profileUrl: '/users/tbrown',
      },
      location: 'Tokyo, Japan',
      timestamp: 'Yesterday, 10:01am',
      images: [
        'https://www.gotokyo.org/en/destinations/southern-tokyo/roppongi/images/81_0154_1.jpg',
        'https://yotsuya.hotelkeihan.co.jp/wp-content/uploads/sites/394/2019/02/Tokyo-Tower.jpg',
        'https://dianathemama.com/wp-content/uploads/2018/02/fuji-proposal.jpg',
      ],
      // caption: 'View from Tokyo Tower',
      comment: 'Nathan Baker: Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      reactions: [
        {
          userAvatar:
            'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
          emoji: '❤️',
        },
        {
          userAvatar:
            'https://images.rawpixel.com/image_800/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDIzLTA5L3Jhd3BpeGVsX29mZmljZV8zNF9waG90b19vZl9hZnJpY2FuLWFtZXJpY2FuX3dvbWFuX2NvbXBhbnlfd29ya19kNmM4MmJhNS1iYjA2LTRkN2EtYjJlMy1hNDZhNDYyMjA0ZmZfMS5qcGc.jpg',
          emoji: '👍',
        },
      ],
    },
    {
      user: {
        userName: 'Thomas Brown',
        userHandle: 'tbrown',
        userAvatar:
          'https://images.rawpixel.com/image_800/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDIzLTA5L3Jhd3BpeGVsX29mZmljZV8zNF9waG90b19vZl9hZnJpY2FuLWFtZXJpY2FuX3dvbWFuX2NvbXBhbnlfd29ya19kNmM4MmJhNS1iYjA2LTRkN2EtYjJlMy1hNDZhNDYyMjA0ZmZfMS5qcGc.jpg',
        profileUrl: '/users/tbrown',
      },
      location: 'Tokyo, Japan',
      timestamp: 'Yesterday, 10:01am',
      images: [
        'https://www.holysmithereens.com/wp-content/uploads/2019/08/IMG_20190823_183442_979-1024x822.jpg',
      ],
      comment: 'Karen Lefoo: Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      reactions: [
        {
          userAvatar:
            'https://images.rawpixel.com/image_800/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDIzLTA5L3Jhd3BpeGVsX29mZmljZV8zNF9waG90b19vZl9hZnJpY2FuLWFtZXJpY2FuX3dvbWFuX2NvbXBhbnlfd29ya19kNmM4MmJhNS1iYjA2LTRkN2EtYjJlMy1hNDZhNDYyMjA0ZmZfMS5qcGc.jpg',
          emoji: '❤️',
        },
        {
          userAvatar:
            'https://api.builder.io/api/v1/image/assets/TEMP/e32a4adcef70ff364c7d655c7db4f440f66c7279?width=92',
          emoji: '😂',
        },
        {
          userAvatar:
            'https://img.freepik.com/free-photo/business-man-by-skyscraper_1303-13655.jpg?semt=ais_hybrid&w=740&q=80',
          emoji: '👏',
        },
      ],
    },
  ],
};

export { user };
