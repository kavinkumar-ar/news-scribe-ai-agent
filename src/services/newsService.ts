
import { NewsResponse, Article } from '@/types';
import { toast } from 'sonner';

const BASE_URL = 'https://newsapi.org/v2';

// Mock articles to display when API fails
const MOCK_ARTICLES: Article[] = [
  {
    source: { id: 'cnn', name: 'CNN' },
    author: 'John Smith',
    title: 'New Climate Deal Reached at UN Summit',
    description: 'World leaders have agreed to a landmark climate deal that aims to limit global warming to 1.5 degrees Celsius.',
    url: 'https://example.com/climate-deal',
    urlToImage: 'https://picsum.photos/800/400?random=1',
    publishedAt: new Date().toISOString(),
    content: 'The deal includes commitments to phase out fossil fuels and increase renewable energy investments.'
  },
  {
    source: { id: 'bbc', name: 'BBC' },
    author: 'Jane Doe',
    title: 'AI Breakthrough Promises More Efficient Climate Modeling',
    description: 'New artificial intelligence models can predict climate patterns with unprecedented accuracy.',
    url: 'https://example.com/ai-climate',
    urlToImage: 'https://picsum.photos/800/400?random=2',
    publishedAt: new Date().toISOString(),
    content: 'The AI system processes satellite data to generate climate predictions 10x faster than previous methods.'
  },
  {
    source: { id: 'nytimes', name: 'New York Times' },
    author: 'Sam Johnson',
    title: 'Tech Companies Pledge Carbon Neutrality by 2030',
    description: 'Major technology firms have announced a joint initiative to become carbon neutral within the decade.',
    url: 'https://example.com/tech-carbon-neutral',
    urlToImage: 'https://picsum.photos/800/400?random=3',
    publishedAt: new Date().toISOString(),
    content: 'The initiative includes investments in renewable energy and carbon offset programs.'
  },
  {
    source: { id: 'reuters', name: 'Reuters' },
    author: 'Emma Wilson',
    title: 'Scientists Develop New Carbon Capture Technology',
    description: 'A breakthrough in carbon capture could significantly reduce atmospheric CO2 levels.',
    url: 'https://example.com/carbon-capture',
    urlToImage: 'https://picsum.photos/800/400?random=4',
    publishedAt: new Date().toISOString(),
    content: 'The technology can remove carbon dioxide from the atmosphere at a fraction of the current cost.'
  }
];

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
      toast.error('Using demo content: News API connection failed');
      
      // Return filtered mock articles if there's a query
      if (query) {
        const queryLower = query.toLowerCase();
        return MOCK_ARTICLES.filter(article => 
          article.title.toLowerCase().includes(queryLower) || 
          (article.description && article.description.toLowerCase().includes(queryLower))
        );
      }
      return MOCK_ARTICLES;
    }

    const data: NewsResponse = await response.json();
    return data.articles;
  } catch (error) {
    console.error('Error fetching news:', error);
    toast.error('Using demo content: News API connection failed');
    
    // Return filtered mock articles if there's a query
    if (query) {
      const queryLower = query.toLowerCase();
      return MOCK_ARTICLES.filter(article => 
        article.title.toLowerCase().includes(queryLower) || 
        (article.description && article.description.toLowerCase().includes(queryLower))
      );
    }
    return MOCK_ARTICLES;
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
      toast.error('Using demo content: News API connection failed');
      
      // Filter mock articles based on query
      const queryLower = query.toLowerCase();
      return MOCK_ARTICLES.filter(article => 
        article.title.toLowerCase().includes(queryLower) || 
        (article.description && article.description.toLowerCase().includes(queryLower))
      );
    }

    const data: NewsResponse = await response.json();
    return data.articles;
  } catch (error) {
    console.error('Error searching news:', error);
    toast.error('Using demo content: News API connection failed');
    
    // Filter mock articles based on query
    const queryLower = query.toLowerCase();
    return MOCK_ARTICLES.filter(article => 
      article.title.toLowerCase().includes(queryLower) || 
      (article.description && article.description.toLowerCase().includes(queryLower))
    );
  }
}
