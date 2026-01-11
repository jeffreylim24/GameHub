import type { MouseEvent } from 'react';
import { useState } from 'react';
import type { Comment } from '@/types';
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
import { deleteComment } from '@/api/comments';
import CommentCardListView from './CommentCardListView';
import CommentCardDetailView from './CommentCardDetailView';
import CommentCardEdit from './CommentCardEdit';

interface CommentCardProps {
  comment: Comment;
  onDelete?: (commentId: number) => void;
  onUpdate?: (updatedComment: Comment) => void;
  variant?: 'list' | 'detail';
}

export default function CommentCard({ comment, onDelete, onUpdate, variant = 'detail' }: CommentCardProps) {
  const { currentUserId } = useAuth();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const isAuthor = currentUserId !== null && comment.author_id === currentUserId;

  const handleEditClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleUpdate = (updatedComment: Comment) => {
    setIsEditing(false);
    if (onUpdate) {
      onUpdate(updatedComment);
    }
  };

  const handleDeleteClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setShowDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      setIsDeleting(true);
      await deleteComment(comment.comment_id);
      setShowDeleteDialog(false);
      if (onDelete) {
        onDelete(comment.comment_id);
      }
    } catch (error) {
      console.error('Failed to delete comment:', error);
      alert('Failed to delete comment. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      {isEditing ? (
        <CommentCardEdit comment={comment} onCancel={handleCancelEdit} onUpdate={handleUpdate} />
      ) : variant === 'detail' ? (
        <CommentCardDetailView
          comment={comment}
          isAuthor={isAuthor}
          onEditClick={handleEditClick}
          onDeleteClick={handleDeleteClick}
        />
      ) : (
        <CommentCardListView
          comment={comment}
        />
      )}

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Comment</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this comment? This action cannot be undone.
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
