
import React from 'react';
import { Article } from '@/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/utils';
import { ExternalLink, Newspaper, X } from 'lucide-react';

interface ArticleSummaryProps {
  article: Article;
  summary: string;
  onClose: () => void;
}

const ArticleSummary: React.FC<ArticleSummaryProps> = ({ article, summary, onClose }) => {
  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="flex flex-row items-start justify-between pb-2">
        <div>
          <CardTitle className="font-serif text-xl mb-1">{article.title}</CardTitle>
          <CardDescription className="flex items-center gap-1">
            <Newspaper size={14} />
            <span>{article.source.name}</span>
            <span className="mx-1">•</span>
            <span>{formatDate(article.publishedAt)}</span>
            {article.author && (
              <>
                <span className="mx-1">•</span>
                <span>{article.author}</span>
              </>
            )}
          </CardDescription>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onClose}
        >
          <X size={18} />
        </Button>
      </CardHeader>
      <CardContent className="article-content">
        <div className="whitespace-pre-wrap">
          {summary.split('\n').map((line, i) => {
            // Check for bullet points
            if (line.trim().startsWith("- ")) {
              return <div key={i} className="flex gap-2 my-1">
                <span>•</span>
                <span>{line.trim().substring(2)}</span>
              </div>;
            }
            
            // Check for headings
            if (line.trim().startsWith("##")) {
              return <h2 key={i}>{line.trim().substring(2).trim()}</h2>;
            }
            
            // Regular line
            return line.trim() ? <p key={i}>{line}</p> : <br key={i} />;
          })}
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          variant="outline" 
          className="flex items-center gap-2"
          onClick={() => window.open(article.url, '_blank')}
        >
          <span>Read Full Article</span>
          <ExternalLink size={16} />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ArticleSummary;
