import { Post } from '../../types/post';

const posts: Post[] = [
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
    comment: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
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
      userName: 'Nathan Baker',
      userHandle: 'nbaker',
      userAvatar:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSFA9bLSF5x5jPFcYFikCLaNrFel6C8FfJpeyQYhmG-Xuc3yhuTYprL3iQApDAoc-5nZ28&usqp=CAU',
      profileUrl: '/users/nbaker',
    },
    location: 'Tokyo, Japan',
    timestamp: 'Yesterday, 10:01am',
    images: [
      'https://www.gotokyo.org/en/destinations/southern-tokyo/roppongi/images/81_0154_1.jpg',
      'https://yotsuya.hotelkeihan.co.jp/wp-content/uploads/sites/394/2019/02/Tokyo-Tower.jpg',
      'https://dianathemama.com/wp-content/uploads/2018/02/fuji-proposal.jpg',
    ],
    // caption: 'View from Tokyo Tower',
    comment: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
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
      userName: 'Karen Foo',
      userHandle: 'kfoo',
      userAvatar:
        'https://img.freepik.com/free-photo/business-man-by-skyscraper_1303-13655.jpg?semt=ais_hybrid&w=740&q=80',
      profileUrl: '/users/kfoo',
    },
    location: 'Tokyo, Japan',
    timestamp: 'Yesterday, 10:01am',
    images: [
      'https://www.holysmithereens.com/wp-content/uploads/2019/08/IMG_20190823_183442_979-1024x822.jpg',
    ],
    comment: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
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
];

const stories: Post[] = [
  {
    user: {
      userName: 'Karen Foo',
      userHandle: 'kfoo',
      userAvatar:
        'https://img.freepik.com/free-photo/business-man-by-skyscraper_1303-13655.jpg?semt=ais_hybrid&w=740&q=80',
      profileUrl: '/users/kfoo',
    },
    location: 'Tokyo, Japan',
    timestamp: 'Yesterday, 10:01am',
    images: ['https://miro.medium.com/v2/resize:fit:960/1*UsE3NwWmZRZKY0qx_1RJeA.jpeg'],
    comment: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    reactions: [
      {
        userAvatar:
          'https://api.builder.io/api/v1/image/assets/TEMP/e32a4adcef70ff364c7d655c7db4f440f66c7279?width=92',
        emoji: '❤️',
      },
      {
        userAvatar:
          'https://api.builder.io/api/v1/image/assets/TEMP/63d02802283446d3398286f440a78cb464c0c420?width=92',
        emoji: '😂',
      },
      {
        userAvatar:
          'https://api.builder.io/api/v1/image/assets/TEMP/a96e7f494de538eb263c3d497afd80c0a995b298?width=92',
        emoji: '👏',
      },
    ],
    seen: false,
  },
  {
    user: {
      userName: 'John Smith',
      userHandle: 'jsmith',
      userAvatar:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSFA9bLSF5x5jPFcYFikCLaNrFel6C8FfJpeyQYhmG-Xuc3yhuTYprL3iQApDAoc-5nZ28&usqp=CAU',
      profileUrl: '/users/jsmith',
    },
    location: 'Tokyo, Japan',
    timestamp: 'Yesterday, 10:01am',
    images: ['https://routinelynomadic.com/wp-content/uploads/2024/09/IMG_9755.jpg'],
    comment: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    reactions: [
      {
        userAvatar:
          'https://api.builder.io/api/v1/image/assets/TEMP/e32a4adcef70ff364c7d655c7db4f440f66c7279?width=92',
        emoji: '❤️',
      },
      {
        userAvatar:
          'https://api.builder.io/api/v1/image/assets/TEMP/63d02802283446d3398286f440a78cb464c0c420?width=92',
        emoji: '😂',
      },
      {
        userAvatar:
          'https://api.builder.io/api/v1/image/assets/TEMP/a96e7f494de538eb263c3d497afd80c0a995b298?width=92',
        emoji: '👏',
      },
    ],
    seen: false,
  },
  {
    user: {
      userName: 'Lisa Wong',
      userHandle: 'lwong',
      userAvatar:
        'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
      profileUrl: '/users/lwong',
    },
    location: 'Tokyo, Japan',
    timestamp: 'Yesterday, 10:01am',
    images: ['https://c.stocksy.com/a/6CaM00/z9/5382350.jpg'],
    comment: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    reactions: [
      {
        userAvatar:
          'https://api.builder.io/api/v1/image/assets/TEMP/e32a4adcef70ff364c7d655c7db4f440f66c7279?width=92',
        emoji: '❤️',
      },
      {
        userAvatar:
          'https://api.builder.io/api/v1/image/assets/TEMP/63d02802283446d3398286f440a78cb464c0c420?width=92',
        emoji: '😂',
      },
      {
        userAvatar:
          'https://api.builder.io/api/v1/image/assets/TEMP/a96e7f494de538eb263c3d497afd80c0a995b298?width=92',
        emoji: '👏',
      },
    ],
    seen: true,
  },
  {
    user: {
      userName: 'Maya Johnson',
      userHandle: 'mjohnson',
      userAvatar:
        'https://images.rawpixel.com/image_800/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDIzLTA5L3Jhd3BpeGVsX29mZmljZV8zNF9waG90b19vZl9hZnJpY2FuLWFtZXJpY2FuX3dvbWFuX2NvbXBhbnlfd29ya19kNmM4MmJhNS1iYjA2LTRkN2EtYjJlMy1hNDZhNDYyMjA0ZmZfMS5qcGc.jpg',
      profileUrl: '/users/mjohnson',
    },
    location: 'Tokyo, Japan',
    timestamp: 'Yesterday, 10:01am',
    images: ['https://c.stocksy.com/a/4O7M00/z9/5271616.jpg'],
    comment: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    reactions: [
      {
        userAvatar:
          'https://api.builder.io/api/v1/image/assets/TEMP/e32a4adcef70ff364c7d655c7db4f440f66c7279?width=92',
        emoji: '❤️',
      },
      {
        userAvatar:
          'https://api.builder.io/api/v1/image/assets/TEMP/63d02802283446d3398286f440a78cb464c0c420?width=92',
        emoji: '😂',
      },
      {
        userAvatar:
          'https://img.freepik.com/free-photo/business-man-by-skyscraper_1303-13655.jpg?semt=ais_hybrid&w=740&q=80',
        emoji: '👏',
      },
    ],
    seen: true,
  },
  {
    user: {
      userName: 'David Lee',
      userHandle: 'dlee',
      userAvatar:
        'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
      profileUrl: '/users/dlee',
    },
    location: 'Tokyo, Japan',
    timestamp: 'Yesterday, 10:01am',
    images: [
      'https://media.istockphoto.com/id/1308888226/photo/tokyo-japan-cityscape-at-twilight-with-mount-fuji-in-background.jpg?s=612x612&w=0&k=20&c=1Yk2X1rH3KX1c1j8Z0n-LU5l9f9p3Z2V6vE1f1jvG5o=',
    ],
    comment: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    reactions: [
      {
        userAvatar:
          'https://api.builder.io/api/v1/image/assets/TEMP/e32a4adcef70ff364c7d655c7db4f440f66c7279?width=92',
        emoji: '❤️',
      },
      {
        userAvatar:
          'https://api.builder.io/api/v1/image/assets/TEMP/63d02802283446d3398286f440a78cb464c0c420?width=92',
        emoji: '😂',
      },
      {
        userAvatar:
          'https://img.freepik.com/free-photo/business-man-by-skyscraper_1303-13655.jpg?semt=ais_hybrid&w=740&q=80',
        emoji: '👏',
      },
    ],
    seen: true,
  },
  {
    user: {
      userName: 'Sophia Martinez',
      userHandle: 'smartinez',
      userAvatar:
        'https://images.rawpixel.com/image_800/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDIzLTA5L3Jhd3BpeGVsX29mZmljZV8zNF9waG90b19vZl9hZnJpY2FuLWFtZXJpY2FuX3dvbWFuX2NvbXBhbnlfd29ya19kNmM4MmJhNS1iYjA2LTRkN2EtYjJlMy1hNDZhNDYyMjA0ZmZfMS5qcGc.jpg',
      profileUrl: '/users/smartinez',
    },
    location: 'Tokyo, Japan',
    timestamp: 'Yesterday, 10:01am',
    images: [
      'https://media.istockphoto.com/id/1308888226/photo/tokyo-japan-cityscape-at-twilight-with-mount-fuji-in-background.jpg?s=612x612&w=0&k=20&c=1Yk2X1rH3KX1c1j8Z0n-LU5l9f9p3Z2V6vE1f1jvG5o=',
    ],
    comment: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    reactions: [
      {
        userAvatar:
          'https://api.builder.io/api/v1/image/assets/TEMP/e32a4adcef70ff364c7d655c7db4f440f66c7279?width=92',
        emoji: '❤️',
      },
      {
        userAvatar:
          'https://api.builder.io/api/v1/image/assets/TEMP/63d02802283446d3398286f440a78cb464c0c420?width=92',
        emoji: '😂',
      },
      {
        userAvatar:
          'https://img.freepik.com/free-photo/business-man-by-skyscraper_1303-13655.jpg?semt=ais_hybrid&w=740&q=80',
        emoji: '👏',
      },
    ],
    seen: true,
  },
];

export { posts, stories };
