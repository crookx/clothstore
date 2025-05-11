import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Upload, X } from 'lucide-react';
import { uploadToStorage } from '@/lib/storage';
import type { UploadResult } from '@/lib/storage';

interface ImageUploadProps {
  onUpload: (url: string) => void;
  maxSize?: number;
  aspectRatio?: number;
}

export function ImageUpload({ onUpload, maxSize = 5, aspectRatio }: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);

  const handleUpload = async (file: File) => {
    try {
        const result = await uploadToStorage(file);
        onUpload(result.url);
    } catch (error) {
        console.error('Upload failed:', error);
        // Handle error appropriately
    }
  };

  return (
    <div className="border-2 border-dashed rounded-lg p-4 text-center">
      {preview ? (
        <div className="relative">
          <img 
            src={preview} 
            alt="Preview" 
            className="max-w-full h-auto rounded"
          />
          <Button
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2"
            onClick={() => setPreview(null)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <Button variant="outline" onClick={() => document.getElementById('fileInput')?.click()}>
          <Upload className="h-4 w-4 mr-2" />
          Upload Image
        </Button>
      )}
      <input
        id="fileInput"
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleUpload(file);
        }}
      />
    </div>
  );
}