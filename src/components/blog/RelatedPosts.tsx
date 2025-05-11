'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { BlogPost } from '@/types/blog';

interface RelatedPostsProps {
  currentPost: BlogPost;
  allPosts: BlogPost[];
}

export function RelatedPosts({ currentPost, allPosts }: RelatedPostsProps) {
  const getRelatedPosts = () => {
    return allPosts
      .filter(post => 
        post.id !== currentPost.id && 
        (post.category === currentPost.category || 
         post.tags.some(tag => currentPost.tags.includes(tag)))
      )
      .slice(0, 3);
  };

  const relatedPosts = getRelatedPosts();

  if (relatedPosts.length === 0) return null;

  return (
    <section className="mt-12">
      <h3 className="text-2xl font-semibold mb-6">Related Posts</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {relatedPosts.map((post) => (
          <Link key={post.id} href={`/blog/${post.slug}`}>
            <Card className="h-full hover:shadow-md transition-shadow">
              <div className="relative aspect-video">
                <Image
                  src={post.imageUrl}
                  alt={post.title}
                  fill
                  className="object-cover rounded-t-lg"
                />
              </div>
              <CardContent className="p-4">
                <h4 className="font-semibold mb-2 line-clamp-2">{post.title}</h4>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {post.excerpt}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
}