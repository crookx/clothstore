import Link from 'next/link';
import Image from 'next/image';
import { formatDistanceToNow } from 'date-fns';
import { BlogPost } from '@/types/blog';

interface BlogListProps {
  posts: BlogPost[];
}

export function BlogList({ posts }: BlogListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {posts.map((post) => (
        <Link key={post.id} href={`/blog/${post.slug}`}>
          <article className="group cursor-pointer">
            <div className="relative aspect-video overflow-hidden rounded-lg">
              <Image
                src={post.imageUrl}
                alt={post.title}
                fill
                className="object-cover transition-transform group-hover:scale-105"
              />
            </div>
            
            <div className="mt-4">
              <span className="text-sm text-muted-foreground">
                {formatDistanceToNow(post.publishedAt, { addSuffix: true })}
              </span>
              <h3 className="text-xl font-semibold mt-2 group-hover:text-primary">
                {post.title}
              </h3>
              <p className="text-muted-foreground mt-2 line-clamp-2">
                {post.excerpt}
              </p>
              
              <div className="flex items-center mt-4">
                <Image
                  src={post.author.image}
                  alt={post.author.name}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
                <div className="ml-3">
                  <p className="text-sm font-medium">{post.author.name}</p>
                  <p className="text-sm text-muted-foreground">{post.category}</p>
                </div>
              </div>
            </div>
          </article>
        </Link>
      ))}
    </div>
  );
}