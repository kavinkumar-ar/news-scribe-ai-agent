
import React from 'react';
import { ChatMessage as IChatMessage } from '@/types';
import { cn } from '@/lib/utils';
import { Newspaper, User } from 'lucide-react';

interface ChatMessageProps {
  message: IChatMessage;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === 'user';

  return (
    <div className={cn(
      'flex gap-3 mb-6',
      isUser ? 'justify-end' : 'justify-start'
    )}>
      {!isUser && (
        <div className="h-10 w-10 rounded-full bg-newsblue flex items-center justify-center text-white">
          <Newspaper size={20} />
        </div>
      )}
      
      <div className={cn(
        'max-w-[80%] rounded-lg p-4',
        isUser 
          ? 'bg-newsblue text-white rounded-tr-none'
          : 'bg-muted rounded-tl-none'
      )}>
        <div className="whitespace-pre-wrap">
          {message.content.split('\n').map((line, i) => {
            // Check for bullet points
            if (line.trim().startsWith("- ")) {
              return <div key={i} className="flex gap-2 my-1">
                <span>•</span>
                <span>{line.trim().substring(2)}</span>
              </div>;
            }
            
            // Check for bold text
            if (line.includes("**")) {
              const parts = line.split("**");
              return (
                <p key={i} className="mb-2">
                  {parts.map((part, j) => j % 2 === 0 
                    ? <span key={j}>{part}</span> 
                    : <strong key={j}>{part}</strong>
                  )}
                </p>
              );
            }
            
            // Regular line
            return line.trim() ? <p key={i} className="mb-2">{line}</p> : <br key={i} />;
          })}
        </div>
      </div>
      
      {isUser && (
        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
          <User size={20} />
        </div>
      )}
    </div>
  );
};

export default ChatMessage;
