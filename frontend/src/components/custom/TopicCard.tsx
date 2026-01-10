import { useNavigate } from 'react-router-dom';
import type { Topic } from '@/types';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

interface TopicCardProps {
  topic: Topic;
}

export default function TopicCard({ topic }: TopicCardProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/topics/${topic.topic_id}`);
  };

  return (
    <Card
      className="cursor-pointer hover:shadow-md transition-shadow"
      onClick={handleClick}
    >
      <CardHeader>
        <CardTitle className="text-2xl">{topic.title}</CardTitle>
        {topic.description && (
          <CardDescription>{topic.description}</CardDescription>
        )}
      </CardHeader>
    </Card>
  );
}
