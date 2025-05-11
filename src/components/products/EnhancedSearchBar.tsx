'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface EnhancedSearchBarProps {
  onSearch: (query: string, category?: string) => void;
  categories?: string[];
  suggestions?: string[];
}

export function EnhancedSearchBar({ 
  onSearch, 
  categories = [], 
  suggestions = [] 
}: EnhancedSearchBarProps) {
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Ensure searchTerm is a string before calling onSearch
    const query = String(searchTerm || '').trim();
    onSearch(query);
  }, [searchTerm, onSearch]);

  return (
    <div className="flex gap-2">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search products..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
    </div>
  );
}