'use client';

import { useState } from 'react';
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { motion, AnimatePresence } from "framer-motion";

interface ProductFiltersProps {
  categories: string[];
  onFilterChange: (filters: FilterState) => void;
  maxPrice: number;
}

interface FilterState {
  search: string;
  priceRange: [number, number];
  categories: string[];
}

export function ProductFilters({ categories, onFilterChange, maxPrice }: ProductFiltersProps) {
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    priceRange: [0, maxPrice],
    categories: []
  });

  const handleFilterChange = (newFilters: Partial<FilterState>) => {
    const updated = { ...filters, ...newFilters };
    setFilters(updated);
    onFilterChange(updated);
  };

  const clearFilters = () => {
    const reset: FilterState = {
      search: '',
      priceRange: [0, maxPrice] as [number, number],
      categories: []
    };
    setFilters(reset);
    onFilterChange(reset);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <div className="relative">
        <Input
          placeholder="Search products..."
          value={filters.search}
          onChange={(e) => handleFilterChange({ search: e.target.value })}
          className="pl-10"
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
      </div>

      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="price">
          <AccordionTrigger>Price Range</AccordionTrigger>
          <AccordionContent>
            <div className="px-2 pt-4">
              <Slider
                defaultValue={[0, maxPrice]}
                max={maxPrice}
                step={1}
                value={filters.priceRange}
                onValueChange={(value) => handleFilterChange({ priceRange: value as [number, number] })}
              />
              <div className="flex justify-between mt-2 text-sm">
                <span>${filters.priceRange[0]}</span>
                <span>${filters.priceRange[1]}</span>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="categories">
          <AccordionTrigger>Categories</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {categories.map((category) => (
                <div key={category} className="flex items-center space-x-2">
                  <Checkbox
                    id={category}
                    checked={filters.categories.includes(category)}
                    onCheckedChange={(checked) => {
                      const newCategories = checked
                        ? [...filters.categories, category]
                        : filters.categories.filter(c => c !== category);
                      handleFilterChange({ categories: newCategories });
                    }}
                  />
                  <label
                    htmlFor={category}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {category}
                  </label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {(filters.search || filters.categories.length > 0 || filters.priceRange[0] > 0 || filters.priceRange[1] < maxPrice) && (
        <Button
          variant="ghost"
          size="sm"
          onClick={clearFilters}
          className="w-full flex items-center justify-center gap-2"
        >
          <X className="h-4 w-4" />
          Clear Filters
        </Button>
      )}
    </motion.div>
  );
}