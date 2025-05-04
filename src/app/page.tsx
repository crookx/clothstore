import ProductList from '@/components/product/product-list';
import { Product } from '@/types/product';

// Mock product data - replace with actual data fetching later
const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Cosmic Comfort Diapers',
    description: 'Ultra-soft diapers with nebulae print.',
    price: 29.99,
    category: 'Diapers',
    imageUrl: 'https://picsum.photos/seed/diaper1/400/300',
    stock: 100,
  },
  {
    id: '2',
    name: 'Starlight Stroller',
    description: 'Lightweight stroller that glides like a comet.',
    price: 249.99,
    category: 'Strollers',
    imageUrl: 'https://picsum.photos/seed/stroller1/400/300',
    stock: 20,
  },
  {
    id: '3',
    name: 'Galaxy Grabber Toy',
    description: 'Interactive toy with lights and sounds.',
    price: 19.99,
    category: 'Toys',
    imageUrl: 'https://picsum.photos/seed/toy1/400/300',
    stock: 50,
  },
  {
    id: '4',
    name: 'Nebula Onesie',
    description: 'Soft cotton onesie with a cosmic design.',
    price: 15.99,
    category: 'Clothes',
    imageUrl: 'https://picsum.photos/seed/onesie1/400/300',
    stock: 80,
  },
  {
    id: '5',
    name: 'Astro Crib Mobile',
    description: 'Soothing mobile with rotating planets.',
    price: 39.99,
    category: 'Nursery',
    imageUrl: 'https://picsum.photos/seed/mobile1/400/300',
    stock: 30,
  },
  {
    id: '6',
    name: 'Rocket Rattle',
    description: 'Easy-to-grip rattle shaped like a rocket.',
    price: 9.99,
    category: 'Toys',
    imageUrl: 'https://picsum.photos/seed/rattle1/400/300',
    stock: 120,
  },
];


export default function Home() {
  // In a real app, fetch products here, possibly from Firebase Firestore
  // const products = await fetchProducts();

  return (
    <div className="container mx-auto px-4 py-8">
       <h1 className="text-3xl font-bold mb-8 text-center text-primary">Explore Our Universe of Baby Gear</h1>
      <ProductList products={mockProducts} />
    </div>
  );
}
