
import { NewsResponse, Article } from '@/types';
import { toast } from 'sonner';

const BASE_URL = 'https://newsapi.org/v2';

export async function fetchTopHeadlines(apiKey: string, query?: string, sources?: string): Promise<Article[]> {
  try {
    const params = new URLSearchParams();
    params.append('language', 'en');
    
    if (query) {
      params.append('q', query);
    }
    
    if (sources) {
      params.append('sources', sources);
    } else {
      params.append('country', 'us');
    }

    const response = await fetch(`${BASE_URL}/top-headlines?${params.toString()}`, {
      headers: {
        'X-Api-Key': apiKey
      }
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Error fetching news:', error);
      toast.error('Failed to fetch news. Please check your API key.');
      return [];
    }

    const data: NewsResponse = await response.json();
    return data.articles;
  } catch (error) {
    console.error('Error fetching news:', error);
    toast.error('Failed to fetch news. Please try again later.');
    return [];
  }
}

export async function searchNews(apiKey: string, query: string): Promise<Article[]> {
  try {
    const params = new URLSearchParams({
      q: query,
      language: 'en',
      sortBy: 'publishedAt'
    });

    const response = await fetch(`${BASE_URL}/everything?${params.toString()}`, {
      headers: {
        'X-Api-Key': apiKey
      }
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Error searching news:', error);
      toast.error('Failed to search for news. Please check your API key.');
      return [];
    }

    const data: NewsResponse = await response.json();
    return data.articles;
  } catch (error) {
    console.error('Error searching news:', error);
    toast.error('Failed to search for news. Please try again later.');
    return [];
  }
}
