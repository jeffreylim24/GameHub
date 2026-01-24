import type { MouseEvent } from 'react';
import { useState } from 'react';
import type { Post } from '@/types';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useAuth } from '@/contexts/AuthContext';
import { deletePost } from '@/api/posts';
import PostCardListView from './PostCardListView';
import PostCardDetailView from './PostCardDetailView';
import PostCardEdit from './PostCardEdit';

interface PostCardProps {
  post: Post;
  onDelete?: (postId: number) => void;
  onUpdate?: (updatedPost: Post) => void;
  variant?: 'list' | 'detail';
}

/**
 * Post container that switches between list, detail, and edit views.
 *
 * @remarks
 * Edit/delete actions are gated by author or admin permissions.
 *
 * @example
 * ```tsx
 * <PostCard post={post} variant="list" onUpdate={handleUpdate} />
 * ```
 */
export default function PostCard({ post, onDelete, onUpdate, variant = 'list' }: PostCardProps) {
  const { currentUserId, isAdmin } = useAuth();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const isAuthorOrAdmin = (currentUserId !== null && post.author_id === currentUserId) || isAdmin;

  const handleEditClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleUpdate = (updatedPost: Post) => {
    setIsEditing(false);
    if (onUpdate) {
      onUpdate(updatedPost);
    }
  };

  const handleDeleteClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setShowDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      setIsDeleting(true);
      await deletePost(post.post_id);
      setShowDeleteDialog(false);
      if (onDelete) {
        onDelete(post.post_id);
      }
    } catch (error) {
      console.error('Failed to delete post:', error);
      alert('Failed to delete post. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      {isEditing ? (
        <PostCardEdit post={post} onCancel={handleCancelEdit} onUpdate={handleUpdate} />
      ) : variant === 'detail' ? (
        <PostCardDetailView
          post={post}
          isAuthor={isAuthorOrAdmin}
          onEditClick={handleEditClick}
          onDeleteClick={handleDeleteClick}
        />
      ) : (
        <PostCardListView
          post={post}
        />
      )}

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Post</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{post.title}"? This action cannot be undone and will also delete all comments on this post.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
