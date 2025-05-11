export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  imageUrls: string[];
  category: string;
  stock: number;
  createdAt: Date;
  updatedAt: Date;
  sizes: string[];
  colors: string[];
  brand: string;
  isAvailable: boolean;
  dateAdded: Date;
  features: string[];
  rating: number;
  reviews: Review[];
  discount: number;
  sku: string;
  relatedProducts?: string[];
  averageRating?: number;
  reviewCount?: number;
  totalReviews?: number;
  sizeGuide?: string;
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: Date;
  date: Date;
  verified: boolean;
}

export interface SizeGuide {
  size: string;
  chest: string;
  waist: string;
  hips: string;
  length: string;
}

export interface CartItem extends Product {
  quantity: number;
}