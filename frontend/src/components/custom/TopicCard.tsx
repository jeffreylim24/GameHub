import type { MouseEvent } from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Topic } from '@/types';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
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
import { Button } from '@/components/ui/button';
import { Pencil, Trash2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { deleteTopic } from '@/api/topics';
import TopicCardEdit from './TopicCardEdit';

interface TopicCardProps {
  topic: Topic;
  onDelete?: (topicId: number) => void;
  onUpdate?: (updatedTopic: Topic) => void;
  clickable?: boolean;
}

export default function TopicCard({ topic, onDelete, onUpdate, clickable = true }: TopicCardProps) {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const handleClick = () => {
    if (clickable && !isEditing) {
      navigate(`/topics/${topic.topic_id}`);
    }
  };

  const handleEditClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleUpdate = (updatedTopic: Topic) => {
    setIsEditing(false);
    if (onUpdate) {
      onUpdate(updatedTopic);
    }
  };

  const handleDeleteClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setShowDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      setIsDeleting(true);
      await deleteTopic(topic.topic_id);
      setShowDeleteDialog(false);
      if (onDelete) {
        onDelete(topic.topic_id);
      }
    } catch (error) {
      console.error('Failed to delete topic:', error);
      alert('Failed to delete topic. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  if (isEditing) {
    return <TopicCardEdit topic={topic} onCancel={handleCancelEdit} onUpdate={handleUpdate} />;
  }

  return (
    <>
      <Card
        className={clickable ? 'cursor-pointer hover:shadow-md transition-shadow' : ''}
        onClick={handleClick}
      >
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <CardTitle className="text-2xl">{topic.title}</CardTitle>
              {topic.description && (
                <CardDescription>{topic.description}</CardDescription>
              )}
            </div>
            {isAdmin && (
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleEditClick}
                  className="h-8 w-8"
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleDeleteClick}
                  className="h-8 w-8 text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
      </Card>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Topic</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{topic.title}"? This will permanently delete the topic and <strong>ALL posts and comments</strong> within it. This action cannot be undone.
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
