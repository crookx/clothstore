// c:\clothstore\clothstore\src\lib\constants.ts

// Firebase configuration constants
export const FIREBASE_CONFIG = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Use a reliable placeholder service or your own Firebase Storage URL
export const PLACEHOLDER_IMAGE_URL = 'https://firebasestorage.googleapis.com/v0/b/futurebabies.appspot.com/o/defaults%2Fproduct-placeholder.jpg?alt=media';

export const CATEGORIES = [
  {
    id: 'clothing-apparel',
    name: 'Clothing & Apparel',
    icon: 'Shirt',
    href: '/category/clothing-apparel',
    description: 'Adorable and comfortable clothing for your little ones.',
  },
  {
    id: 'nursery-furniture',
    name: 'Nursery & Furniture',
    icon: 'Bed',
    href: '/category/nursery-furniture',
    description: 'Create the perfect space for your baby.',
  },
  {
    id: 'feeding-essentials',
    name: 'Feeding Essentials',
    icon: 'Utensils',
    href: '/category/feeding-essentials',
    description: 'Everything you need for feeding time.',
  },
  {
    id: 'health-safety',
    name: 'Health & Safety',
    icon: 'Shield',
    href: '/category/health-safety',
    description: 'Keep your baby safe and healthy.',
  },
  {
    id: 'bath-skincare',
    name: 'Bath & Skincare',
    icon: 'Bath',
    href: '/category/bath-skincare',
    description: 'Gentle care for delicate skin.',
  },
  {
    id: 'travel-gear',
    name: 'Travel Gear',
    icon: 'Car',
    href: '/category/travel-gear',
    description: 'Essential gear for adventures together.',
  },
  {
    id: 'play-learning',
    name: 'Play & Learning',
    icon: 'Gamepad2',
    href: '/category/play-learning',
    description: 'Toys and tools for development and fun.',
  },
  {
    id: 'baby-care',
    name: 'Baby Care',
    icon: 'Baby',
    href: '/category/baby-care',
    description: 'Daily care essentials for your baby.',
  },
] as const;

export const getCategoryById = (id: string) => CATEGORIES.find(cat => cat.id === id);