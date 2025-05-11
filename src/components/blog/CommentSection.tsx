'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { format } from 'date-fns';
import { getFirebaseServices } from '@/lib/firebase/config';
import { ThumbsUp, AlertCircle } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

interface Comment {
  id: string;
  userId: string;
  userName: string;
  userImage?: string;
  content: string;
  createdAt: Date;
  likes: number;
}

interface CommentSectionProps {
  postId: string;
}

export function CommentSection({ postId }: CommentSectionProps) {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const services = getFirebaseServices();
    if (!services) {
      setError('Comments unavailable');
      setLoading(false);
      return;
    }

    const unsubscribe = services.db
      .collection('blog_comments')
      .where('postId', '==', postId)
      .orderBy('createdAt', 'desc')
      .onSnapshot(
        (snapshot) => {
          const newComments = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt.toDate(),
          })) as Comment[];
          setComments(newComments);
          setLoading(false);
        },
        (err) => {
          setError('Failed to load comments');
          setLoading(false);
        }
      );

    return () => unsubscribe();
  }, [postId]);

  const handleSubmitComment = async () => {
    if (!user || !newComment.trim()) return;

    const services = getFirebaseServices();
    if (!services) return;

    try {
      await services.db.collection('blog_comments').add({
        postId,
        userId: user.uid,
        userName: user.displayName || 'Anonymous',
        userImage: user.photoURL,
        content: newComment.trim(),
        createdAt: new Date(),
        likes: 0,
      });

      setNewComment('');
    } catch (err) {
      setError('Failed to post comment');
    }
  };

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-semibold">Comments</h3>

      {user ? (
        <div className="space-y-4">
          <Textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Share your thoughts..."
            className="min-h-[100px]"
          />
          <Button onClick={handleSubmitComment}>Post Comment</Button>
        </div>
      ) : (
        <Alert>
          <AlertTitle>Please log in to comment</AlertTitle>
        </Alert>
      )}

      <div className="space-y-4">
        {comments.map((comment) => (
          <div key={comment.id} className="flex space-x-4">
            <Avatar>
              <AvatarImage src={comment.userImage} />
              <AvatarFallback>{comment.userName[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-medium">{comment.userName}</span>
                  <span className="text-sm text-muted-foreground ml-2">
                    {format(comment.createdAt, 'PP')}
                  </span>
                </div>
                <Button variant="ghost" size="sm">
                  <ThumbsUp className="h-4 w-4 mr-1" />
                  {comment.likes}
                </Button>
              </div>
              <p className="text-muted-foreground">{comment.content}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}