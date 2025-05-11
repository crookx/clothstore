export interface FilterOptions {
  category?: string;
  priceRange: [number, number]; // [min, max]
  size?: string;
  sortBy: 'default' | 'price-low' | 'price-high' | 'newest'; // Add 'newest' if you plan to implement it
}