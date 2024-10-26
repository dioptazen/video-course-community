export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  bio?: string;
  location?: string;
  website?: string;
  instagram?: string;
  twitter?: string;
  youtube?: string;
  facebook?: string;
  linkedin?: string;
  membershipDate: Date;
  profilePhoto?: string;
  timezone: string;
  followNotification: boolean;
  url: string;
}

export interface Group {
  id: number;
  name: string;
  logo: string;
  description: string;
  ownerId: number;
  url: string;
  memberCount: number;
  adminCount: number;
  onlineCount: number;
}

export interface GroupMember {
  groupId: number;
  userId: number;
  isAdmin: boolean;
}

export interface Topic {
  id: number;
  groupId: number;
  name: string;
}

export interface Post {
  id: number;
  groupId: number;
  userId: number;
  title: string;
  content: string;
  topicId?: number;
  createdAt: Date;
  likeCount: number;
  commentCount: number;
  isPinned: boolean;
}

export interface CourseModule {
  id: number;
  groupId: number;
  title: string;
  description: string;
  image?: string;
  parentId?: number;
  order: number;
  type: 'MAIN' | 'SECTION' | 'LESSON';
  videoUrl?: string;
}