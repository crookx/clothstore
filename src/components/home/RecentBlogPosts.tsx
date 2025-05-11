'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getFirebaseServices } from '@/lib/firebase/config';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import Link from 'next/link';
import { format } from 'date-fns';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  slug: string;
  publishedAt: string;
}

export default function RecentBlogPosts() {
  const [posts, setPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    async function fetchRecentPosts() {
      const services = getFirebaseServices();
      if (!services) return;

      const postsRef = collection(services.db, 'blog_posts');
      const q = query(postsRef, orderBy('publishedAt', 'desc'), limit(3));
      const snapshot = await getDocs(q);
      
      setPosts(snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as BlogPost[]);
    }

    fetchRecentPosts();
  }, []);

  if (!posts.length) return null;

  return (
    <section className="py-12 mb-12">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold mb-8">Latest from Our Blog</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {posts.map((post) => (
            <Link href={`/blog/${post.slug}`} key={post.id}>
              <Card className="h-full hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="line-clamp-2">{post.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(post.publishedAt), 'MMMM d, yyyy')}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}