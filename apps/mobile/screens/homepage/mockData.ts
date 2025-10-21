import { Post } from '../../types/post';

const posts: Post[] = [
  {
    userName: 'Nathan Baker',
    userHandle: 'nbaker',
    userAvatar:
      'https://www.pngitem.com/pimgs/m/627-6275754_chad-profile-pic-profile-photo-circle-png-transparent.png',
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
      'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
      'https://images.rawpixel.com/image_800/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDIzLTA5L3Jhd3BpeGVsX29mZmljZV8zNF9waG90b19vZl9hZnJpY2FuLWFtZXJpY2FuX3dvbWFuX2NvbXBhbnlfd29ya19kNmM4MmJhNS1iYjA2LTRkN2EtYjJlMy1hNDZhNDYyMjA0ZmZfMS5qcGc.jpg',
    ],
  },
  {
    userName: 'Nathan Baker',
    userHandle: 'nbaker',
    userAvatar:
      'https://api.builder.io/api/v1/image/assets/TEMP/d30722627ec835ca8e06d042247b444758373973?width=84',
    location: 'Tokyo, Japan',
    timestamp: 'Yesterday, 10:01am',
    images: [
      'https://api.builder.io/api/v1/image/assets/TEMP/637fb687298c11ba301a8a8bbe249161713fca66?width=880',
    ],
    comment: 'Karen Lefoo: Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    reactions: [
      'https://api.builder.io/api/v1/image/assets/TEMP/e32a4adcef70ff364c7d655c7db4f440f66c7279?width=92',
      'https://api.builder.io/api/v1/image/assets/TEMP/63d02802283446d3398286f440a78cb464c0c420?width=92',
      'https://api.builder.io/api/v1/image/assets/TEMP/a96e7f494de538eb263c3d497afd80c0a995b298?width=92',
    ],
  },
];

const stories = [
  'https://www.kindpng.com/picc/m/41-415494_profile-picture-in-circle-hd-png-download.png',
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSFA9bLSF5x5jPFcYFikCLaNrFel6C8FfJpeyQYhmG-Xuc3yhuTYprL3iQApDAoc-5nZ28&usqp=CAU',
  'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
  'https://images.rawpixel.com/image_800/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDIzLTA5L3Jhd3BpeGVsX29mZmljZV8zNF9waG90b19vZl9hZnJpY2FuLWFtZXJpY2FuX3dvbWFuX2NvbXBhbnlfd29ya19kNmM4MmJhNS1iYjA2LTRkN2EtYjJlMy1hNDZhNDYyMjA0ZmZfMS5qcGc.jpg',
];

export { posts, stories };
