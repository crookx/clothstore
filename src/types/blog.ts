export interface BlogPost {
  id?: string;
  title: string;
  content: string;
  excerpt: string;
  slug: string;
  category: string;
  tags: string[];
  author: {
    name: string;
    image: string;
  };
  imageUrl: string;
  publishedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}