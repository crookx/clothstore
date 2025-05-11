'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { format } from 'date-fns';
import { BlogPost } from '@/types/blog';
import { getFirebaseServices } from '@/lib/firebase/config';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { CommentSection } from '@/components/blog/CommentSection';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { collection, query, where, limit, getDocs } from 'firebase/firestore';

export default function BlogPostPage() {
  const params = useParams();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPost() {
      if (!params.slug) return;

      try {
        const services = getFirebaseServices();
        if (!services) throw new Error('Firebase services not available');

        const blogPostsRef = collection(services.db, 'blog_posts');
        const q = query(
          blogPostsRef,
          where('slug', '==', params.slug),
          limit(1)
        );
        const postDoc = await getDocs(q);

        if (postDoc.empty) {
          setError('Post not found');
          return;
        }

        const postData = postDoc.docs[0].data() as BlogPost;
        setPost({ ...postData, id: postDoc.docs[0].id });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load post');
      } finally {
        setLoading(false);
      }
    }

    fetchPost();
  }, [params.slug]);

  if (loading) {
    return <BlogPostSkeleton />;
  }

  if (error || !post) {
    return (
      <Alert variant="destructive" className="max-w-3xl mx-auto mt-8">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error || 'Post not found'}</AlertDescription>
      </Alert>
    );
  }

  return (
    <article className="max-w-3xl mx-auto px-4 py-8">
      <div className="relative aspect-video mb-8 rounded-lg overflow-hidden">
        <Image
          src={post.imageUrl}
          alt={post.title}
          fill
          className="object-cover"
          priority
        />
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center">
            <Image
              src={post.author.image}
              alt={post.author.name}
              width={40}
              height={40}
              className="rounded-full"
            />
            <div className="ml-3">
              <p className="text-sm font-medium">{post.author.name}</p>
              <p className="text-sm text-muted-foreground">
                {format(post.publishedAt, 'MMMM d, yyyy')}
              </p>
            </div>
          </div>
          <span className="text-sm text-muted-foreground">•</span>
          <span className="text-sm text-muted-foreground">{post.category}</span>
        </div>

        <h1 className="text-4xl font-bold text-primary">{post.title}</h1>
        <div className="prose prose-blue max-w-none">
          {post.content}
        </div>

        <div className="flex gap-2 mt-6">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      <hr className="my-8" />

      <CommentSection postId={post.id || ''} />
    </article>
  );
}

function BlogPostSkeleton() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      <Skeleton className="aspect-video w-full rounded-lg" />
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-3 w-32" />
          </div>
        </div>
        <Skeleton className="h-12 w-3/4" />
        <div className="space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </div>
    </div>
  );
}