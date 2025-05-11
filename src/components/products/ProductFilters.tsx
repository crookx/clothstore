'use client';

import { useState, useMemo } from 'react';
import type { Product } from '@/types/product';
import type { FilterOptions } from '@/types/filters';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

// Define price ranges directly in the component or import from a dedicated config file
const appPriceRanges: { label: string; min: number; max: number }[] = [
  { label: 'Any Price', min: 0, max: Infinity },
  { label: 'KES 0 - KES 2500', min: 0, max: 2500 },
  { label: 'KES 2500 - KES 5000', min: 2500, max: 5000 },
  { label: 'KES 5000 - KES 10000', min: 5000, max: 10000 },
  { label: 'KES 10000+', min: 10000, max: Infinity },
];

interface ProductFiltersProps {
  products: Product[];
  onFilterChange: (filters: FilterOptions) => void;
}

const initialFilterOptions: FilterOptions = {
  category: undefined, // Or an empty string if your handler expects that for "all"
  priceRange: [0, Infinity], // Default to all prices
  size: undefined, // Or an empty string
  sortBy: 'default', // Or your preferred default sort
};

export function ProductFilters({ products, onFilterChange }: ProductFiltersProps) {
  const [currentFilters, setCurrentFilters] = useState<FilterOptions>(initialFilterOptions);

  const availableCategories = useMemo(() => {
    if (!products) return [];
    return [...new Set(products.map(p => p.category).filter(Boolean))].sort(); // Filter out empty/null categories
  }, [products]);

  const availableSizes = useMemo(() => {
    if (!products) return [];
    const sizes = [...new Set(products.flatMap(p => p.sizes || []).filter(Boolean))]; // Filter out empty/null sizes
    const order = ['NB', '0-3M', '3-6M', '6-9M', '9-12M', '12-18M', '18-24M', '1T', '2T', '3T', '4T', '5T', 'S', 'M', 'L', 'XL', 'XXL', 'One Size', 'Standard', 'Compact', 'Infant', 'Toddler', 'All Ages'];
    return sizes.sort((a, b) => {
        const indexA = order.indexOf(a);
        const indexB = order.indexOf(b);
        if (indexA === -1 && indexB === -1) return a.localeCompare(b); // both not in order, sort alphabetically
        if (indexA === -1) return 1; // a not in order, b is; b comes first
        if (indexB === -1) return -1; // b not in order, a is; a comes first
        return indexA - indexB; // both in order, sort by order
    });
  }, [products]);

  const handleCategoryChange = (value: string) => {
    const newFilters = {
      ...currentFilters,
      category: value === '_all_' ? undefined : value
    };
    setCurrentFilters(newFilters);
    onFilterChange(newFilters); // Call onFilterChange here
  };

  const handleSizeChange = (value: string) => {
    const newFilters = {
      ...currentFilters,
      size: value === '_all_' ? undefined : value
    };
    setCurrentFilters(newFilters);
    onFilterChange(newFilters); // Call onFilterChange here
  };

  const handlePriceChange = (value: string) => {
    const selectedRange = appPriceRanges.find(r => `${r.min}-${r.max}` === value);
    if (selectedRange) {
      const newFilters = {
        ...currentFilters,
        priceRange: [selectedRange.min, selectedRange.max] as [number, number]
      };
      setCurrentFilters(newFilters);
      onFilterChange(newFilters); // Call onFilterChange here
    }
  };

  const handleSortByChange = (value: FilterOptions['sortBy']) => {
    const newFilters = {
      ...currentFilters,
      sortBy: value
    };
    setCurrentFilters(newFilters);
    onFilterChange(newFilters); // Call onFilterChange here
  };

  const clearFilters = () => {
    setCurrentFilters(initialFilterOptions);
    onFilterChange(initialFilterOptions); // Call onFilterChange here
  };

  // Determine the string value for the price Select based on currentFilters.priceRange
  const currentPriceSelectValue = useMemo(() => {
    const [min, max] = currentFilters.priceRange;
    const matchedRange = appPriceRanges.find(r => r.min === min && r.max === max);
    return matchedRange ? `${matchedRange.min}-${matchedRange.max}` : `${appPriceRanges[0].min}-${appPriceRanges[0].max}`;
  }, [currentFilters.priceRange]);

  return (
    <div className="space-y-6 p-4 border rounded-lg shadow-sm bg-card">
      <h3 className="text-xl font-semibold mb-4">Filters</h3>

      <div>
        <Label htmlFor="sort-by" className="text-sm font-medium">Sort By</Label>
        <Select value={currentFilters.sortBy} onValueChange={handleSortByChange}>
          <SelectTrigger id="sort-by" className="w-full mt-1">
            <SelectValue placeholder="Select sort order" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="default">Relevance</SelectItem>
            <SelectItem value="price-low">Price: Low to High</SelectItem>
            <SelectItem value="price-high">Price: High to Low</SelectItem>
            {/* Add other sort options like 'newest' if your FilterOptions type supports it */}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="category-filter" className="text-sm font-medium">Category</Label>
        <Select value={currentFilters.category || '_all_'} onValueChange={handleCategoryChange}>
          <SelectTrigger id="category-filter" className="w-full mt-1">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="_all_">All Categories</SelectItem>
            {availableCategories.map(category => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="price-filter" className="text-sm font-medium">Price Range</Label>
        <Select value={currentPriceSelectValue} onValueChange={handlePriceChange}>
          <SelectTrigger id="price-filter" className="w-full mt-1">
            <SelectValue placeholder="Select price range" />
          </SelectTrigger>
          <SelectContent>
            {appPriceRanges.map((range: { label: string; min: number; max: number }) => (
              <SelectItem key={range.label} value={`${range.min}-${range.max}`}>
                {range.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="size-filter" className="text-sm font-medium">Size</Label>
        <Select value={currentFilters.size || '_all_'} onValueChange={handleSizeChange}>
          <SelectTrigger id="size-filter" className="w-full mt-1">
            <SelectValue placeholder="Select size" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="_all_">All Sizes</SelectItem>
            {availableSizes.map(size => (
              <SelectItem key={size} value={size}>
                {size}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Button onClick={clearFilters} variant="outline" className="w-full mt-4">
        Clear All Filters
      </Button>
    </div>
  );
}