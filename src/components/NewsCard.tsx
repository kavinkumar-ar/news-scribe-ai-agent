
import React from 'react';
import { Article } from '@/types';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatDate, truncateText } from '@/lib/utils';
import { ExternalLink, FileText } from 'lucide-react';

interface NewsCardProps {
  article: Article;
  onSummarize: (article: Article) => void;
}

const NewsCard: React.FC<NewsCardProps> = ({ article, onSummarize }) => {
  return (
    <Card className="overflow-hidden h-full flex flex-col hover:shadow-md transition-shadow duration-200">
      <CardHeader className="p-0">
        {article.urlToImage && (
          <div className="w-full h-48 overflow-hidden">
            <img 
              src={article.urlToImage} 
              alt={article.title} 
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/placeholder.svg';
              }}
            />
          </div>
        )}
      </CardHeader>
      <CardContent className="flex-grow py-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-newsblue">{article.source.name}</span>
          <span className="text-xs text-muted-foreground">{formatDate(article.publishedAt)}</span>
        </div>
        <h3 className="font-serif font-bold text-lg mb-2 line-clamp-2">{article.title}</h3>
        <p className="text-muted-foreground text-sm line-clamp-3">
          {truncateText(article.description || '', 150)}
        </p>
      </CardContent>
      <CardFooter className="pt-0 pb-4 flex items-center justify-between">
        <Button 
          variant="outline" 
          size="sm" 
          className="flex gap-1"
          onClick={() => onSummarize(article)}
        >
          <FileText size={16} />
          <span>Summarize</span>
        </Button>
        <Button 
          variant="link" 
          size="sm" 
          className="flex gap-1 text-newsblue"
          onClick={() => window.open(article.url, '_blank')}
        >
          <span>Read Full</span>
          <ExternalLink size={16} />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default NewsCard;
