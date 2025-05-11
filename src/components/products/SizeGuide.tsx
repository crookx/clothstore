'use client';

import { useState } from 'react';
import { SizeGuide } from '@/types/product';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Ruler } from 'lucide-react';

interface SizeGuideProps {
  sizeGuide: SizeGuide[];
}

export function SizeGuideDialog({ sizeGuide }: SizeGuideProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Ruler className="mr-2 h-4 w-4" />
          Size Guide
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Size Guide</DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="py-2 text-left">Size</th>
                <th className="py-2 text-left">Chest</th>
                <th className="py-2 text-left">Waist</th>
                <th className="py-2 text-left">Hips</th>
                <th className="py-2 text-left">Length</th>
              </tr>
            </thead>
            <tbody>
              {sizeGuide.map((guide) => (
                <tr key={guide.size} className="border-b">
                  <td className="py-2">{guide.size}</td>
                  <td className="py-2">{guide.chest}</td>
                  <td className="py-2">{guide.waist}</td>
                  <td className="py-2">{guide.hips}</td>
                  <td className="py-2">{guide.length}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DialogContent>
    </Dialog>
  );
}