import { ChatRow, Bulletin } from 'types/chat';

const chats: ChatRow[] = [
  {
    user: {
      userName: 'Nathan Baker',
      userAvatar:
        'https://img.freepik.com/free-photo/business-man-by-skyscraper_1303-13655.jpg?semt=ais_hybrid&w=740&q=80',
      userHandle: 'nbaker',
      profileUrl: '/users/nbaker',
    },
    unreadCount: 2,
    lastMessage: 'Hey! Are we still on for tomorrow?',
    timestamp: '2:45 PM',
  },
  {
    user: {
      userName: 'John Smith',
      userAvatar:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSFA9bLSF5x5jPFcYFikCLaNrFel6C8FfJpeyQYhmG-Xuc3yhuTYprL3iQApDAoc-5nZ28&usqp=CAU',
      userHandle: 'jsmith',
      profileUrl: '/users/jsmith',
    },
    unreadCount: 1,
    lastMessage: 'Sure! Let me check my schedule.',
    timestamp: '2:30 PM',
  },
  {
    user: {
      userName: 'Lisa Wong',
      userAvatar:
        'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
      userHandle: 'lwong',
      profileUrl: '/users/lwong',
    },
    unreadCount: 0,
    lastMessage: 'Got it, thanks!',
    timestamp: '1:15 PM',
  },
  {
    user: {
      userName: 'Maya Johnson',
      userAvatar:
        'https://images.rawpixel.com/image_800/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDIzLTA5L3Jhd3BpeGVsX29mZmljZV8zNF9waG90b19vZl9hZnJpY2FuLWFtZXJpY2FuX3dvbWFuX2NvbXBhbnlfd29ya19kNmM4MmJhNS1iYjA2LTRkN2EtYjJlMy1hNDZhNDYyMjA0ZmZfMS5qcGc.jpg',
      userHandle: 'mjohnson',
      profileUrl: '/users/mjohnson',
    },
    unreadCount: 0,
    lastMessage: 'Looking forward to it!',
    timestamp: '12:45 PM',
  },
];

const bulletins: Bulletin[] = [
  {
    user: {
      userName: 'Karen Foo',
      userHandle: 'kfoo',
      userAvatar:
        'https://img.freepik.com/free-photo/business-man-by-skyscraper_1303-13655.jpg?semt=ais_hybrid&w=740&q=80',
      profileUrl: '/users/kfoo',
    },
    timestamp: 'Yesterday, 10:01am',
    content: 'Anyone wanna grab coffee this weekend?',
  },
  {
    user: {
      userName: 'David Lee',
      userHandle: 'dlee',
      userAvatar:
        'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
      profileUrl: '/users/dlee',
    },
    timestamp: 'Yesterday, 9:30am',
    content: 'Good hiking trails nearby?',
  },
  {
    user: {
      userName: 'Emily Chen',
      userHandle: 'echen',
      userAvatar:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSFA9bLSF5x5jPFcYFikCLaNrFel6C8FfJpeyQYhmG-Xuc3yhuTYprL3iQApDAoc-5nZ28&usqp=CAU',
      profileUrl: '/users/echen',
    },
    timestamp: 'Yesterday, 8:45am',
    content: 'Tips for studying abroad in Europe?',
  },
  {
    user: {
      userName: 'Michael Brown',
      userHandle: 'mbrown',
      userAvatar:
        'https://images.rawpixel.com/image_800/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDIzLTA5L3Jhd3BpeGVsX29mZmljZV8zNF9waG90b19vZl9hZnJpY2FuLWFtZXJpY2FuX3dvbWFuX2NvbXBhbnlfd29ya19kNmM4MmJhNS1iYjA2LTRkN2EtYjJlMy1hNDZhNDYyMjA0ZmZfMS5qcGc.jpg',
      profileUrl: '/users/mbrown',
    },
    timestamp: 'Yesterday, 8:00am',
    content: 'Best local restaurants?',
  },
  {
    user: {
      userName: 'Sophia Garcia',
      userHandle: 'sgarcia',
      userAvatar:
        'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
      profileUrl: '/users/sgarcia',
    },
    timestamp: 'Yesterday, 7:30am',
    content: 'Anyone up for a language exchange?',
  },
];

export { chats, bulletins };
