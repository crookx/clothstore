'use client';

import { useState, useCallback } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useDebounce } from '@/hooks/useDebounce';

interface BlogSearchProps {
  onSearch: (term: string) => void;
  onCategorySelect: (category: string) => void;
  categories: string[];
  selectedCategory?: string;
}

export function BlogSearch({ onSearch, onCategorySelect, categories, selectedCategory }: BlogSearchProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 300);

  const handleSearch = useCallback((value: string) => {
    setSearchTerm(value);
    onSearch(value);
  }, [onSearch]);

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search posts..."
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          className="pl-10"
        />
      </div>
      <div className="flex flex-wrap gap-2">
        <Badge
          variant={!selectedCategory ? "default" : "outline"}
          className="cursor-pointer"
          onClick={() => onCategorySelect('')}
        >
          All
        </Badge>
        {categories.map((category) => (
          <Badge
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => onCategorySelect(category)}
          >
            {category}
          </Badge>
        ))}
      </div>
    </div>
  );
}