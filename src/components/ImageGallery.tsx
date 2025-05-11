'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ImageGalleryProps {
  images: string[];
  productName: string;
}

export function ImageGallery({ images, productName }: ImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showZoom, setShowZoom] = useState(false);

  // Safety check - if no images, show placeholder
  if (!images || images.length === 0) {
    images = ['/placeholder-product.jpg'];
  }

  const navigate = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      setCurrentIndex(current => (current === 0 ? images.length - 1 : current - 1));
    } else {
      setCurrentIndex(current => (current === images.length - 1 ? 0 : current + 1));
    }
  };

  return (
    <div className="relative">
      {/* Main Image */}
      <div className="relative aspect-square overflow-hidden rounded-lg border">
        <Image
          src={images[currentIndex]}
          alt={`${productName} - Image ${currentIndex + 1}`}
          fill
          className="object-cover cursor-zoom-in"
          onClick={() => setShowZoom(true)}
          priority
        />

        {/* Navigation Buttons */}
        {images.length > 1 && (
          <div className="absolute inset-0 flex items-center justify-between p-4">
            <Button
              variant="secondary"
              size="icon"
              className="rounded-full bg-white/80 shadow-lg"
              onClick={(e) => {
                e.stopPropagation();
                navigate('prev');
              }}
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              className="rounded-full bg-white/80 shadow-lg"
              onClick={(e) => {
                e.stopPropagation();
                navigate('next');
              }}
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
          </div>
        )}

        {/* Zoom Button */}
        <Button
          variant="secondary"
          size="icon"
          className="absolute bottom-4 right-4 rounded-full bg-white/80 shadow-lg"
          onClick={() => setShowZoom(true)}
        >
          <ZoomIn className="h-4 w-4" />
        </Button>
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="mt-4 grid grid-cols-4 gap-4">
          {images.map((image, index) => (
            <button
              key={`${image}-${index}`} // ✅ Fixed: ensures unique key
              className={cn(
                "relative aspect-square overflow-hidden rounded-md border",
                currentIndex === index && "ring-2 ring-primary"
              )}
              onClick={() => setCurrentIndex(index)}
            >
              <Image
                src={image}
                alt={`${productName} - Thumbnail ${index + 1}`}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Zoom Dialog */}
      <Dialog open={showZoom} onOpenChange={setShowZoom}>
        <DialogContent className="max-w-screen-xl h-[90vh]">
          <div className="relative w-full h-full">
            <Image
              src={images[currentIndex]}
              alt={`${productName} - Zoomed Image`}
              fill
              className="object-contain"
              priority
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
