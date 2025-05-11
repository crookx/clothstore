'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { fetchProducts } from '@/services/productService';
import type { Product } from '@/types/product';
import type { FilterOptions } from '@/types/filters';
import { ProductFilters } from '@/components/products/ProductFilters'; // Assuming this is the correct one
// import { ProductFilters } from '@/components/product/ProductFilters'; // Or this one if it's the intended one
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from 'lucide-react';
import { EnhancedSearchBar } from '@/components/products/EnhancedSearchBar';
import { ProductCard } from '@/components/ProductCard'; // <-- IMPORT YOUR FANCY CARD
// Cart and Wishlist contexts are used by ProductCard internally, no need to use them here for ProductCard props
// import { useCart } from '@/context/cart-context';
// import { useWishlist } from '@/context/wishlist-context';
import { useRouter } from 'next/navigation';             // <-- IMPORT ROUTER for auth redirect

const initialFilters: FilterOptions = {
  category: undefined,
  priceRange: [0, Infinity],
  size: undefined,
  sortBy: 'default'
};

export default function ProductsPage() {
  const [rawProducts, setRawProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]); // This will store the products after filtering and searching
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentFilters, setCurrentFilters] = useState<FilterOptions>(initialFilters);
  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([]);

  // These handlers are not needed here if ProductCard handles its own actions via context
  // const { toggleCartItem, isInCart } = useCart();
  // const { toggleWishlist, isInWishlist } = useWishlist();
  const router = useRouter();

  const categories = useMemo(() => 
    Array.from(new Set(rawProducts.map(p => p.category))) // Use rawProducts
  , [rawProducts]);

  useEffect(() => {
    async function loadProducts() {
      try {
        const fetchedProducts = await fetchProducts();
        if (fetchedProducts === null) {
          setError("Failed to load rawProducts");
          setRawProducts([]);
        } else {
          setRawProducts(fetchedProducts);
        }
      } catch (err) {
        console.error("Error loading products:", err);
        setError(err instanceof Error ? err.message : "Failed to load products");
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, []);

  useEffect(() => {
    setSearchSuggestions([
      'New Arrivals',
      'Best Sellers',
      'Sale Items',
      'Featured Products'
    ]);
  }, []);

  // Central useEffect for filtering and searching
  useEffect(() => {
    let results = [...rawProducts];

    // Apply search query
    if (searchQuery && typeof searchQuery === 'string') {
      const searchTerms = searchQuery.toLowerCase().split(' ');
      results = results.filter(product => {
        const searchableText = `${product.name || ''} ${product.description || ''} ${product.category || ''}`.toLowerCase();
        return searchTerms.every(term => searchableText.includes(term));      });
    }

    // Apply category filter
    if (currentFilters.category) {
      results = results.filter(p => p.category === currentFilters.category);
    }

    // Apply price range filter
    results = results.filter(p =>
      p.price >= currentFilters.priceRange[0] && p.price <= currentFilters.priceRange[1]
    );

    // Apply size filter
    if (currentFilters.size) {
      results = results.filter(p => p.sizes?.includes(currentFilters.size as string));
    }

    // Apply sorting
    results.sort((a, b) => {
      switch (currentFilters.sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        default:
          return 0;
      }
    });

    setFilteredProducts(results);
  }, [searchQuery, currentFilters, rawProducts]);


  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const handleEnhancedSearch = useCallback((query: string, category?: string) => {
    const searchQueryVal = String(query || '');
    setSearchQuery(searchQueryVal);
    setCurrentFilters(prev => ({
      ...prev,
      // If category is explicitly passed as empty string by search bar, treat as 'all' (undefined)
      // Otherwise, use the passed category or fallback to the previous category.
      category: category === '' ? undefined : (category || prev.category)
    }));
  }, []);

  const handleFilterChange = useCallback((filters: FilterOptions) => {
    setCurrentFilters(filters);
  }, []);




  // These handlers are not needed if ProductCard handles its own actions
  // const handleCartItemToggle = async (product: Product) => { 
  //   try {
  //     // This logic is now inside ProductCard or its context hooks
  //   } catch (error) {
  //     if (error === 'AUTH_REQUIRED') { 
  //       router.push('/login?redirect=' + encodeURIComponent(window.location.pathname));
  //     }
  //   }
  // };

  // const handleWishlistToggle = async (product: Product) => {
  //   try {
  //     // This logic is now inside ProductCard or its context hooks
  //   } catch (error) {
  //     if (error === 'AUTH_REQUIRED') { 
  //       router.push('/login?redirect=' + encodeURIComponent(window.location.pathname));
  //     }
  //   }
  // };


  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Our Products</h1>
        <EnhancedSearchBar
          onSearch={handleEnhancedSearch}
          categories={categories}
          suggestions={searchSuggestions}
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters Sidebar */}
        <aside className="lg:col-span-1">
          <ProductFilters 
            products={rawProducts} // Pass rawProducts here
            onFilterChange={handleFilterChange} 
          />
        </aside>

        {/* Products Grid */}
        <div className="lg:col-span-3">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Skeleton remains similar, but you might want to adjust it to match ProductCard structure if significantly different */}
              {[...Array(6)].map((_, i) => (
                <div key={i} className="border rounded-lg shadow-sm bg-card p-4">
                  <Skeleton className="h-48 w-full mb-4" />
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2 mb-4" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ))}
            </div>
          ) : error ? (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No products found matching your criteria.</p>
              <button 
                className="text-blue-500 underline" 
                onClick={() => {
                  setSearchQuery('');
                  handleSearch('');
                }}
              >
                Clear search and filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  // No need to pass these props, ProductCard uses context internally
                  // onToggleCartItem={handleCartItemToggle}
                  // onAddToWishlist={handleWishlistToggle}
                  // isInWishlist={isInWishlist(product.id)}
                  // isInCart={isInCart(product.id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}