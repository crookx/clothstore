import { render, screen } from '@testing-library/react';
import { ProductCard } from '@/components/ProductCard';
import type { Product } from '@/types/product';

describe('ProductCard', () => {
  const mockProduct: Product = {
    id: '1',
    name: 'Test Product',
    price: 99.99,
    image: '/test.jpg',
    description: 'Test description',
    imageUrls: ['/test.jpg'],
    category: 'test-category',
    stock: 10,
    createdAt: new Date(),
    updatedAt: new Date(),
    sizes: ['S', 'M', 'L'],
    colors: ['Black', 'White'],
    brand: 'Test Brand',
    isAvailable: true,
    dateAdded: new Date(),
    features: ['Feature 1', 'Feature 2'],
    rating: 4.5,
    reviews: [],
    discount: 0,
    sku: 'TEST123',
    relatedProducts: [],
    averageRating: 4.5,
    reviewCount: 0,
    totalReviews: 0,
    sizeGuide: 'size-guide.pdf'
  };

  it('renders product information correctly', () => {
    render(<ProductCard product={mockProduct} />);
    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('$99.99')).toBeInTheDocument();
  });
});