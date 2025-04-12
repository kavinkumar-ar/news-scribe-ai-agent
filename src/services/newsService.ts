
import { NewsResponse, Article } from '@/types';
import { toast } from 'sonner';

const BASE_URL = 'https://newsapi.org/v2';
// Use the provided API key directly in the code as requested
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
  },
  {
    source: { id: 'mit', name: 'MIT Technology Review' },
    author: 'Alex Johnson',
    title: 'GPT-5 Architecture Hints at Major Leap in AI Reasoning',
    description: 'Leaked presentations suggest the next generation of language models will feature advanced reasoning capabilities.',
    url: 'https://example.com/gpt5-architecture',
    urlToImage: 'https://picsum.photos/800/400?random=15',
    publishedAt: new Date().toISOString(),
    content: 'The new architecture reportedly introduces novel attention mechanisms that enhance long-term reasoning.'
  },
  {
    source: { id: 'forbes', name: 'Forbes' },
    author: 'Sarah Williams',
    title: 'Robotics Startups Attract Record Venture Capital in 2025',
    description: 'Investment in automation and robotics has reached unprecedented levels as labor shortages continue.',
    url: 'https://example.com/robotics-vc',
    urlToImage: 'https://picsum.photos/800/400?random=16',
    publishedAt: new Date().toISOString(),
    content: 'Companies developing warehouse automation and healthcare robots are seeing the strongest investor interest.'
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
  },
  {
    source: { id: 'science', name: 'Science Magazine' },
    author: 'Robert Chen',
    title: 'Ocean Acidification Accelerating at Alarming Rate',
    description: 'New research shows coral reefs may collapse sooner than previously predicted due to rising ocean acidity.',
    url: 'https://example.com/ocean-acidification',
    urlToImage: 'https://picsum.photos/800/400?random=17',
    publishedAt: new Date().toISOString(),
    content: 'The pH levels in key marine ecosystems have dropped more rapidly in the past five years than in the previous decade.'
  }
];

const TECH_MOCK_ARTICLES: Article[] = [
  {
    source: { id: 'verge', name: 'The Verge' },
    author: 'Thomas Wilson',
    title: 'Apple Unveils New Quantum Computing Initiative',
    description: 'Tech giant makes surprise announcement about major investment in quantum technology research.',
    url: 'https://example.com/apple-quantum',
    urlToImage: 'https://picsum.photos/800/400?random=9',
    publishedAt: new Date().toISOString(),
    content: 'The company plans to develop quantum-secure encryption for all its devices within three years.'
  },
  {
    source: { id: 'cnet', name: 'CNET' },
    author: 'Lisa Chen',
    title: '6G Research Consortium Formed by Leading Tech Companies',
    description: 'Major telecommunications firms join forces to define the next generation of wireless technology.',
    url: 'https://example.com/6g-consortium',
    urlToImage: 'https://picsum.photos/800/400?random=10',
    publishedAt: new Date().toISOString(),
    content: 'The group aims to have commercial 6G networks operational by 2030, promising speeds 50 times faster than 5G.'
  },
  {
    source: { id: 'wsj', name: 'Wall Street Journal' },
    author: 'Michael Brown',
    title: 'Neuromorphic Computing Chips Show Promise for Edge AI',
    description: 'New brain-inspired computing architectures could revolutionize artificial intelligence in mobile devices.',
    url: 'https://example.com/neuromorphic-computing',
    urlToImage: 'https://picsum.photos/800/400?random=11',
    publishedAt: new Date().toISOString(),
    content: 'These specialized chips consume a fraction of the power while performing complex AI tasks locally on devices.'
  }
];

const BUSINESS_MOCK_ARTICLES: Article[] = [
  {
    source: { id: 'bloomberg', name: 'Bloomberg' },
    author: 'Jennifer Adams',
    title: 'Central Banks Consider Digital Currency Collaboration',
    description: 'Major economies explore interoperable CBDCs to transform international payments.',
    url: 'https://example.com/cbdc-collaboration',
    urlToImage: 'https://picsum.photos/800/400?random=12',
    publishedAt: new Date().toISOString(),
    content: 'The initiative could reduce cross-border transaction costs by up to 80% and settlement times from days to seconds.'
  },
  {
    source: { id: 'ft', name: 'Financial Times' },
    author: 'Richard Morrison',
    title: 'Sustainable Investing Reaches Record $25 Trillion Globally',
    description: 'ESG funds now account for over 20% of all professionally managed assets worldwide.',
    url: 'https://example.com/esg-investing',
    urlToImage: 'https://picsum.photos/800/400?random=13',
    publishedAt: new Date().toISOString(),
    content: 'Regulatory changes and investor demand have accelerated the shift toward sustainability-focused investments.'
  },
  {
    source: { id: 'economist', name: 'The Economist' },
    author: 'Sarah Thompson',
    title: 'Supply Chain Resilience Becomes Top Corporate Priority',
    description: 'Companies are reshoring critical production after years of globalization.',
    url: 'https://example.com/supply-chain',
    urlToImage: 'https://picsum.photos/800/400?random=14',
    publishedAt: new Date().toISOString(),
    content: 'The trend marks a significant shift from just-in-time to just-in-case inventory management philosophies.'
  }
];

function getMockArticlesForQuery(query: string): Article[] {
  // Convert query to lowercase for case-insensitive matching
  const queryLower = query.toLowerCase();
  
  // Map common topics to their mock article collections
  const topicMap: Record<string, Article[]> = {
    'ai': AI_MOCK_ARTICLES,
    'artificial intelligence': AI_MOCK_ARTICLES,
    'climate': CLIMATE_MOCK_ARTICLES,
    'environment': CLIMATE_MOCK_ARTICLES,
    'warming': CLIMATE_MOCK_ARTICLES,
    'technology': TECH_MOCK_ARTICLES,
    'tech': TECH_MOCK_ARTICLES,
    '6g': TECH_MOCK_ARTICLES,
    'quantum': TECH_MOCK_ARTICLES,
    'business': BUSINESS_MOCK_ARTICLES,
    'finance': BUSINESS_MOCK_ARTICLES,
    'economy': BUSINESS_MOCK_ARTICLES,
    'investment': BUSINESS_MOCK_ARTICLES
  };
  
  // Check if query contains any of our predefined topics
  for (const [topic, articles] of Object.entries(topicMap)) {
    if (queryLower.includes(topic)) {
      // Return topic-specific articles plus some general articles for variety
      return [...articles, ...MOCK_ARTICLES.slice(0, 1)];
    }
  }
  
  // If no specific topic matched, search across all mock articles
  const allMockArticles = [
    ...AI_MOCK_ARTICLES,
    ...CLIMATE_MOCK_ARTICLES,
    ...TECH_MOCK_ARTICLES,
    ...BUSINESS_MOCK_ARTICLES,
    ...MOCK_ARTICLES
  ];
  
  // Filter mock articles based on query
  const matchingArticles = allMockArticles.filter(article => 
    article.title.toLowerCase().includes(queryLower) || 
    (article.description && article.description.toLowerCase().includes(queryLower))
  );
  
  return matchingArticles.length > 0 ? matchingArticles : MOCK_ARTICLES.slice(0, 3);
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
