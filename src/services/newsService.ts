
import { NewsResponse, Article } from '@/types';
import { toast } from 'sonner';

const BASE_URL = 'https://newsapi.org/v2';
const API_KEY = '858d53bfd9114bb49e6638932279819c';

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

// Enhanced mock articles for specific topics
const AI_MOCK_ARTICLES: Article[] = [
  {
    source: { id: 'techcrunch', name: 'TechCrunch' },
    author: 'Maria Rodriguez',
    title: 'OpenAI Announces Breakthrough in Multimodal Learning',
    description: 'Latest AI models can understand and generate content across text, images, and audio simultaneously.',
    url: 'https://example.com/openai-multimodal',
    urlToImage: 'https://picsum.photos/800/400?random=5',
    publishedAt: new Date().toISOString(),
    content: 'This breakthrough allows AI to process multiple types of information simultaneously, similar to human cognition.'
  },
  {
    source: { id: 'wired', name: 'Wired' },
    author: 'David Chen',
    title: 'AI Ethics Board Proposes New Industry Standards',
    description: 'A coalition of tech companies has formed an ethics committee to establish guidelines for responsible AI development.',
    url: 'https://example.com/ai-ethics',
    urlToImage: 'https://picsum.photos/800/400?random=6',
    publishedAt: new Date().toISOString(),
    content: 'The standards focus on transparency, accountability, and preventing algorithmic bias in AI systems.'
  }
];

const CLIMATE_MOCK_ARTICLES: Article[] = [
  {
    source: { id: 'natgeo', name: 'National Geographic' },
    author: 'Emily Watson',
    title: 'Arctic Sea Ice Reaches Record Low for March',
    description: 'Scientists report unprecedented melting as global temperatures continue to rise.',
    url: 'https://example.com/arctic-ice',
    urlToImage: 'https://picsum.photos/800/400?random=7',
    publishedAt: new Date().toISOString(),
    content: 'The rapid loss of sea ice is accelerating feedback loops that could lead to even faster warming.'
  },
  {
    source: { id: 'guardian', name: 'The Guardian' },
    author: 'James Miller',
    title: 'Global Carbon Emissions Bounce Back After Pandemic Dip',
    description: 'New data shows emissions have returned to pre-pandemic levels despite climate pledges.',
    url: 'https://example.com/emissions-rise',
    urlToImage: 'https://picsum.photos/800/400?random=8',
    publishedAt: new Date().toISOString(),
    content: 'Countries are failing to meet reduction targets set in the Paris Agreement, raising concerns about the 1.5°C goal.'
  }
];

function getMockArticlesForQuery(query: string): Article[] {
  const queryLower = query.toLowerCase();
  
  if (queryLower.includes('ai') || queryLower.includes('artificial intelligence')) {
    return [...AI_MOCK_ARTICLES, ...MOCK_ARTICLES.slice(0, 2)];
  }
  
  if (queryLower.includes('climate') || queryLower.includes('environment') || queryLower.includes('warming')) {
    return [...CLIMATE_MOCK_ARTICLES, ...MOCK_ARTICLES.slice(0, 2)];
  }
  
  // Filter mock articles based on query
  return MOCK_ARTICLES.filter(article => 
    article.title.toLowerCase().includes(queryLower) || 
    (article.description && article.description.toLowerCase().includes(queryLower))
  );
}

export async function fetchTopHeadlines(apiKey?: string, query?: string, sources?: string): Promise<Article[]> {
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
        'X-Api-Key': apiKey || API_KEY
      }
    });

    if (!response.ok) {
      console.error('Error fetching news:', response.status, response.statusText);
      toast.error('Using demo content: News API connection failed');
      
      // Return appropriate mock articles based on query
      if (query) {
        return getMockArticlesForQuery(query);
      }
      return MOCK_ARTICLES;
    }

    const data: NewsResponse = await response.json();
    return data.articles;
  } catch (error) {
    console.error('Error fetching news:', error);
    toast.error('Using demo content: News API connection failed');
    
    // Return appropriate mock articles based on query
    if (query) {
      return getMockArticlesForQuery(query);
    }
    return MOCK_ARTICLES;
  }
}

export async function searchNews(apiKey?: string, query: string = ''): Promise<Article[]> {
  try {
    const params = new URLSearchParams({
      q: query || 'news',
      language: 'en',
      sortBy: 'publishedAt'
    });

    const response = await fetch(`${BASE_URL}/everything?${params.toString()}`, {
      headers: {
        'X-Api-Key': apiKey || API_KEY
      }
    });

    if (!response.ok) {
      console.error('Error searching news:', response.status, response.statusText);
      toast.error('Using demo content: News API connection failed');
      
      // Return appropriate mock articles based on query
      return getMockArticlesForQuery(query);
    }

    const data: NewsResponse = await response.json();
    return data.articles;
  } catch (error) {
    console.error('Error searching news:', error);
    toast.error('Using demo content: News API connection failed');
    
    // Return appropriate mock articles based on query
    return getMockArticlesForQuery(query);
  }
}
