export interface Book {
  id: number;
  title: string;
  author: string;
  description: string;
  coverImage: string;
  category: string;
  tags: string[];
  rating: number;
  readingStatus: 'unread' | 'reading' | 'completed';
  progress: number;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export const mockBooks: Book[] = [
  {
    id: 1,
    title: 'JavaScript高级程序设计',
    author: 'Nicholas C. Zakas',
    description: '深入理解JavaScript语言核心概念和高级特性的权威指南。',
    coverImage: '/images/books/js-advanced.jpg',
    category: '编程技术',
    tags: ['JavaScript', '前端开发', '编程'],
    rating: 5,
    readingStatus: 'completed',
    progress: 100,
    notes: '非常经典的JavaScript教程，涵盖了语言的各个方面。',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z'
  },
  {
    id: 2,
    title: 'React技术揭秘',
    author: '卡颂',
    description: '深入React源码，理解React的工作原理和设计思想。',
    coverImage: '/images/books/react-deep.jpg',
    category: '编程技术',
    tags: ['React', '前端框架', '源码分析'],
    rating: 4,
    readingStatus: 'reading',
    progress: 65,
    notes: '对React内部机制的深度解析，帮助理解React的工作原理。',
    createdAt: '2024-01-05T00:00:00Z',
    updatedAt: '2024-01-20T00:00:00Z'
  },
  {
    id: 3,
    title: 'TypeScript编程',
    author: 'Boris Cherny',
    description: 'TypeScript从入门到精通的完整指南。',
    coverImage: '/images/books/typescript-programming.jpg',
    category: '编程技术',
    tags: ['TypeScript', '类型系统', '编程语言'],
    rating: 4,
    readingStatus: 'unread',
    progress: 0,
    notes: '',
    createdAt: '2024-01-10T00:00:00Z',
    updatedAt: '2024-01-10T00:00:00Z'
  }
];

export const mockBookCategories = [
  '编程技术',
  '计算机科学',
  '软件工程',
  '人工智能',
  '数据科学',
  '网络安全',
  '产品设计',
  '项目管理'
];

export const mockReadingStatuses = [
  { value: 'unread', label: '未读' },
  { value: 'reading', label: '在读' },
  { value: 'completed', label: '已读' }
];