'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { BlogPost } from '@/types/blog';
import { getFirebaseServices } from '@/lib/firebase/config';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

interface BlogEditorProps {
  post?: BlogPost;
  categories: string[];
  onSave: (post: Partial<BlogPost>) => void;
}

export function BlogEditor({ post, categories, onSave }: BlogEditorProps) {
  const [title, setTitle] = useState(post?.title || '');
  const [content, setContent] = useState(post?.content || '');
  const [category, setCategory] = useState(post?.category || '');
  const [excerpt, setExcerpt] = useState(post?.excerpt || '');
  const [tags, setTags] = useState(post?.tags?.join(', ') || '');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      const postData: Partial<BlogPost> = {
        title,
        content,
        category,
        excerpt,
        tags: tags.split(',').map(tag => tag.trim()),
        updatedAt: new Date(),
      };

      if (!post) {
        postData.createdAt = new Date();
        postData.slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      }

      await onSave(postData);
    } catch (error) {
      console.error('Error saving post:', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter post title"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="excerpt">Excerpt</Label>
        <Input
          id="excerpt"
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          placeholder="Brief description of the post"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">Category</Label>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="tags">Tags</Label>
        <Input
          id="tags"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="Enter tags separated by commas"
        />
      </div>

      <div className="space-y-2">
        <Label>Content</Label>
        <div className="min-h-[400px] border rounded-md">
          <ReactQuill
            theme="snow"
            value={content}
            onChange={setContent}
            className="h-[350px]"
          />
        </div>
      </div>

      <Button 
        onClick={handleSave} 
        disabled={saving}
        className="w-full md:w-auto"
      >
        {saving ? 'Saving...' : 'Save Post'}
      </Button>
    </div>
  );
}