'use client';

import Link from 'next/link';
import { Baby, Bath, Car, Shirt, Bed, Utensils, Shield, Gamepad2 } from 'lucide-react';
import { CATEGORIES } from '@/lib/constants';

const iconMap = {
  Shirt,
  Bed,
  Utensils,
  Shield,
  Bath,
  Car,
  Gamepad2,
  Baby,
} as const;

export default function FeaturedCategories() {
  const renderIcon = (iconName: keyof typeof iconMap) => {
    const Icon = iconMap[iconName];
    return <Icon className="h-12 w-12 mb-3 text-primary group-hover:text-accent transition-colors" />;
  };

  return (
    <section className="py-12 bg-muted/40 rounded-lg mb-12">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-10 text-primary">
          Shop by Category
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {CATEGORIES.map((category) => (
            <Link 
              key={category.id}
              href={category.href}
              className="group block text-center p-6 bg-card rounded-lg shadow-md hover:shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-1"
            >
              <div className="flex justify-center items-center mb-4">
                {renderIcon(category.icon as keyof typeof iconMap)}
              </div>
              <h3 className="text-xl font-semibold mb-2 text-card-foreground group-hover:text-accent transition-colors">
                {category.name}
              </h3>
              <p className="text-sm text-muted-foreground">
                {category.description}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}