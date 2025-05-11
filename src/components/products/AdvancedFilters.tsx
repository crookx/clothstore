'use client';

import { useState } from 'react';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

interface FilterProps {
  onFilterChange: (filters: {
    priceRange: [number, number];
    sizes: string[];
    colors: string[];
  }) => void;
  maxPrice: number;
  availableSizes: string[];
  availableColors: string[];
}

export function AdvancedFilters({
  onFilterChange,
  maxPrice,
  availableSizes,
  availableColors,
}: FilterProps) {
  const [priceRange, setPriceRange] = useState<[number, number]>([0, maxPrice]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);

  const handlePriceChange = (value: [number, number]) => {
    setPriceRange(value);
    onFilterChange({
      priceRange: value,
      sizes: selectedSizes,
      colors: selectedColors,
    });
  };

  const handleSizeChange = (size: string, checked: boolean) => {
    const newSizes = checked
      ? [...selectedSizes, size]
      : selectedSizes.filter(s => s !== size);
    setSelectedSizes(newSizes);
    onFilterChange({
      priceRange,
      sizes: newSizes,
      colors: selectedColors,
    });
  };

  const handleColorChange = (color: string, checked: boolean) => {
    const newColors = checked
      ? [...selectedColors, color]
      : selectedColors.filter(c => c !== color);
    setSelectedColors(newColors);
    onFilterChange({
      priceRange,
      sizes: selectedSizes,
      colors: newColors,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-medium mb-2">Price Range</h3>
        <Slider
          value={priceRange}
          max={maxPrice}
          step={10}
          onValueChange={handlePriceChange}
        />
        <div className="flex justify-between mt-2 text-sm text-muted-foreground">
          <span>${priceRange[0]}</span>
          <span>${priceRange[1]}</span>
        </div>
      </div>

      <div>
        <h3 className="font-medium mb-2">Sizes</h3>
        <div className="grid grid-cols-2 gap-2">
          {availableSizes.map((size) => (
            <div key={size} className="flex items-center space-x-2">
              <Checkbox
                id={`size-${size}`}
                checked={selectedSizes.includes(size)}
                onCheckedChange={(checked) => 
                  handleSizeChange(size, checked as boolean)
                }
              />
              <Label htmlFor={`size-${size}`}>{size}</Label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-medium mb-2">Colors</h3>
        <div className="grid grid-cols-2 gap-2">
          {availableColors.map((color) => (
            <div key={color} className="flex items-center space-x-2">
              <Checkbox
                id={`color-${color}`}
                checked={selectedColors.includes(color)}
                onCheckedChange={(checked) => 
                  handleColorChange(color, checked as boolean)
                }
              />
              <Label htmlFor={`color-${color}`}>{color}</Label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}