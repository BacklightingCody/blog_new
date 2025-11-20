import { User, UserRole, UserStatus } from '@/types/user';

export const mockUsers: User[] = [
  {
    id: 1,
    clerkId: 'clerk_admin_001',
    username: 'admin',
    email: 'admin@example.com',
    firstName: '管理员',
    lastName: '',
    imageUrl: '/images/avatars/admin.jpg',
    passwordHash: 'hashed_password_admin',
    role: UserRole.ADMIN,
    status: UserStatus.ACTIVE,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 2,
    clerkId: 'clerk_author_001',
    username: 'author',
    email: 'author@example.com',
    firstName: '作者',
    lastName: '',
    imageUrl: '/images/avatars/author.jpg',
    passwordHash: 'hashed_password_author',
    role: UserRole.USER,
    status: UserStatus.ACTIVE,
    createdAt: '2024-01-02T00:00:00Z',
    updatedAt: '2024-01-02T00:00:00Z'
  }
];

export const mockUserProfiles = mockUsers.map(user => ({
  userId: user.id,
  firstName: user.firstName || '用户',
  lastName: user.lastName || '',
  phone: '',
  address: '',
  website: '',
  socialLinks: {
    github: '',
    twitter: '',
    linkedin: ''
  },
  preferences: {
    theme: 'light' as const,
    language: 'zh-CN',
    notifications: {
      email: true,
      push: true,
      sms: false
    }
  }
}));