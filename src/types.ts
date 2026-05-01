export interface Category {
  id: string;
  name: string;
  slug: string;
  theme: string;
  imageUrl: string;
  enabled: boolean;
  createdAt: number;
  updatedAt: number;
  authorId: string;
}

export interface Story {
  id: string;
  title: string;
  slug: string;
  categoryId: string;
  theme: string;
  language: string;
  bannerUrl: string;
  thumbnailUrl: string;
  content: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string;
  readingTime: number;
  views: number;
  status: 'published' | 'draft';
  createdAt: number;
  updatedAt: number;
  authorId: string;
}

export interface AppSetting {
  id: string; // 'general', 'social', 'ads'
  type: string;
  payload: string; // JSON string
  updatedAt: number;
}
