
export interface Article {
  source: {
    id: string | null;
    name: string;
  };
  author: string | null;
  title: string;
  description: string | null;
  url: string;
  urlToImage: string | null;
  publishedAt: string;
  content: string | null;
}

export interface NewsResponse {
  status: string;
  totalResults: number;
  articles: Article[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface UserInterest {
  topic: string;
  confidence: number;
}

export interface UserPreference {
  id: string;
  interests: UserInterest[];
  preferredSources: string[];
  summarizedArticles: string[];
  lastUpdated: Date;
}

export interface ApiKeyState {
  apiKey: string;
  isSet: boolean;
}
