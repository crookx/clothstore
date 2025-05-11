'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PlusCircle, List } from 'lucide-react';
import BlogPostList from './components/blog-post-list';
import AddBlogPostForm from './components/add-blog-post-form';

export default function AdminBlogPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-primary">Blog Management</h1>

      <Tabs defaultValue="view-posts" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="add-post">
            <PlusCircle className="mr-2 h-4 w-4" /> Add New Post
          </TabsTrigger>
          <TabsTrigger value="view-posts">
            <List className="mr-2 h-4 w-4" /> View Posts
          </TabsTrigger>
        </TabsList>

        <TabsContent value="add-post">
          <AddBlogPostForm />
        </TabsContent>

        <TabsContent value="view-posts">
          <BlogPostList />
        </TabsContent>
      </Tabs>
    </div>
  );
}