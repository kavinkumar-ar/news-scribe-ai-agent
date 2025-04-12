
import React from 'react';
import { UserInterest } from '@/types';
import { Bookmark, Trash2 } from 'lucide-react';

interface InterestsDisplayProps {
  interests: UserInterest[];
  onRemove?: (topic: string) => void;
}

const InterestsDisplay: React.FC<InterestsDisplayProps> = ({ interests, onRemove }) => {
  if (!interests || interests.length === 0) {
    return null;
  }

  // Sort interests by confidence
  const sortedInterests = [...interests].sort((a, b) => b.confidence - a.confidence);

  return (
    <div className="mb-4">
      <div className="flex items-center gap-2 mb-2 text-sm text-muted-foreground">
        <Bookmark size={16} />
        <span>Your Interests</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {sortedInterests.map((interest) => (
          <div 
            key={interest.topic}
            className="bg-muted px-3 py-1 rounded-full text-sm flex items-center gap-1"
          >
            <span>{interest.topic}</span>
            {onRemove && (
              <button 
                className="ml-1 text-muted-foreground hover:text-destructive"
                onClick={() => onRemove(interest.topic)}
              >
                <Trash2 size={14} />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default InterestsDisplay;
