
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { Article, ChatMessage, ApiKeyState, UserPreference } from '@/types';
import ApiKeyInput from '@/components/ApiKeyInput';
import ChatMessageComponent from '@/components/ChatMessage';
import NewsCard from '@/components/NewsCard';
import ArticleSummary from '@/components/ArticleSummary';
import InterestsDisplay from '@/components/InterestsDisplay';
import { fetchTopHeadlines, searchNews } from '@/services/newsService';
import { generateUniqueId, extractInterestsFromMessage } from '@/lib/utils';
import { generateResponse, generateSummary } from '@/services/aiService';
import { addUserInterest, addPreferredSource, addSummarizedArticle, getUserPreference, saveUserPreference, saveChatMessages, getChatMessages } from '@/services/memoryService';
import { CircleHelpIcon, Newspaper, Send, Trash } from 'lucide-react';

const Index = () => {
  const [apiKeyState, setApiKeyState] = useState<ApiKeyState>({
    apiKey: '',
    isSet: false
  });
  const [userMessage, setUserMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [articleSummary, setArticleSummary] = useState('');
  const [userPreference, setUserPreference] = useState<UserPreference | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const savedMessages = getChatMessages();
    if (savedMessages.length > 0) {
      setChatMessages(savedMessages);
    } else {
      const welcomeMessage: ChatMessage = {
        id: generateUniqueId(),
        role: 'assistant',
        content: "👋 Welcome to NewsScribe! I'm your AI assistant to help you stay updated with news that matters to you. Ask me about any news topic, or try something like:\n\n- Summarize the latest developments in technology\n- What are the key points from today's top business news?\n- Tell me about recent climate change policy updates",
        timestamp: new Date()
      };
      setChatMessages([welcomeMessage]);
    }
    
    const preferences = getUserPreference();
    setUserPreference(preferences);
    
    const savedApiKey = localStorage.getItem('newsscribe_api_key');
    if (savedApiKey) {
      setApiKeyState({ apiKey: savedApiKey, isSet: true });
      fetchInitialNews(savedApiKey);
    }
  }, []);
  
  const fetchInitialNews = async (apiKey: string) => {
    try {
      const headlines = await fetchTopHeadlines(apiKey);
      setArticles(headlines);
    } catch (error) {
      console.error('Error fetching initial news:', error);
    }
  };

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
    
    if (chatMessages.length > 0) {
      saveChatMessages(chatMessages);
    }
  }, [chatMessages]);

  const handleSendMessage = async () => {
    if (!userMessage.trim() || !apiKeyState.isSet) return;
    
    const interests = extractInterestsFromMessage(userMessage);
    interests.forEach(topic => addUserInterest(topic));
    
    setUserPreference(getUserPreference());
    
    const newUserMessage: ChatMessage = {
      id: generateUniqueId(),
      role: 'user',
      content: userMessage,
      timestamp: new Date()
    };
    
    setChatMessages(prev => [...prev, newUserMessage]);
    setUserMessage('');
    setLoading(true);
    
    try {
      let relevantNews: Article[] = [];
      if (userMessage.includes('article') || userMessage.includes('summarize')) {
        relevantNews = await searchNews(apiKeyState.apiKey, userMessage);
      } else {
        relevantNews = await fetchTopHeadlines(apiKeyState.apiKey, userMessage);
      }
      
      if (relevantNews.length > 0) {
        setArticles(relevantNews);
        
        relevantNews.slice(0, 3).forEach(article => {
          if (article.source && article.source.name) {
            addPreferredSource(article.source.name);
          }
        });
      }
      
      const aiResponse = await generateResponse(
        userMessage, 
        getUserPreference(),
        relevantNews
      );
      
      const newAiMessage: ChatMessage = {
        id: generateUniqueId(),
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date()
      };
      
      setChatMessages(prev => [...prev, newAiMessage]);
    } catch (error) {
      console.error('Error handling message:', error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSummarizeArticle = async (article: Article) => {
    if (!apiKeyState.isSet) {
      toast.error('Please set your News API key first');
      return;
    }
    
    setSelectedArticle(article);
    setArticleSummary('');
    setLoading(true);
    
    try {
      const summary = await generateSummary(article, apiKeyState.apiKey);
      setArticleSummary(summary);
      
      if (article.url) {
        addSummarizedArticle(article.url);
      }
      
      if (article.source && article.source.name) {
        addPreferredSource(article.source.name);
      }
      
      setUserPreference(getUserPreference());
    } catch (error) {
      console.error('Error summarizing article:', error);
      toast.error('Failed to summarize article');
    } finally {
      setLoading(false);
    }
  };

  const handleClearChat = () => {
    const confirmClear = window.confirm('Are you sure you want to clear the chat? Your preferences and interests will be remembered.');
    if (confirmClear) {
      const welcomeMessage: ChatMessage = {
        id: generateUniqueId(),
        role: 'assistant',
        content: "Chat cleared. I still remember your interests and preferences. How can I help you with news today?",
        timestamp: new Date()
      };
      setChatMessages([welcomeMessage]);
      saveChatMessages([welcomeMessage]);
    }
  };

  const handleRemoveInterest = (topic: string) => {
    if (!userPreference) return;
    
    const updatedInterests = userPreference.interests.filter(
      interest => interest.topic !== topic
    );
    
    const updatedPreference = {
      ...userPreference,
      interests: updatedInterests
    };
    
    saveUserPreference(updatedPreference);
    setUserPreference(updatedPreference);
  };

  return (
    <div className="min-h-screen max-w-7xl mx-auto px-4 py-6 flex flex-col md:flex-row gap-6">
      {!apiKeyState.isSet ? (
        <ApiKeyInput apiKeyState={apiKeyState} setApiKeyState={setApiKeyState} />
      ) : selectedArticle ? (
        <div className="flex-grow">
          {articleSummary ? (
            <ArticleSummary 
              article={selectedArticle} 
              summary={articleSummary} 
              onClose={() => setSelectedArticle(null)} 
            />
          ) : (
            <div className="h-full flex items-center justify-center">
              <div className="flex flex-col items-center gap-3">
                <div className="animate-pulse-slow">
                  <Newspaper size={48} className="text-newsblue" />
                </div>
                <p className="text-lg font-medium">Generating summary...</p>
              </div>
            </div>
          )}
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-serif font-bold text-newsblue flex items-center gap-2">
              <Newspaper />
              <span>NewsScribe AI</span>
            </h1>
            {chatMessages.length > 1 && (
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center gap-1"
                onClick={handleClearChat}
              >
                <Trash size={16} />
                <span>Clear Chat</span>
              </Button>
            )}
          </div>
          
          {userPreference && userPreference.interests.length > 0 && (
            <InterestsDisplay 
              interests={userPreference.interests} 
              onRemove={handleRemoveInterest}
            />
          )}
          
          <div className="flex-grow bg-white border rounded-lg shadow-sm mb-4 flex flex-col">
            <ScrollArea className="flex-grow p-4">
              <div className="flex flex-col">
                {chatMessages.map((message) => (
                  <ChatMessageComponent key={message.id} message={message} />
                ))}
                {loading && (
                  <div className="flex justify-start mb-6">
                    <div className="bg-muted rounded-lg p-4 max-w-[80%] rounded-tl-none flex items-center gap-2">
                      <div className="animate-pulse-slow">
                        <Newspaper size={20} />
                      </div>
                      <p>Analyzing news...</p>
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>
            </ScrollArea>
            
            <Separator />
            
            <div className="p-4">
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex items-end gap-2"
              >
                <div className="flex-grow">
                  <Textarea
                    placeholder="Ask about news, request summaries, or specific topics..."
                    value={userMessage}
                    onChange={(e) => setUserMessage(e.target.value)}
                    className="resize-none"
                    rows={2}
                  />
                </div>
                <Button 
                  type="submit" 
                  disabled={!userMessage.trim() || loading || !apiKeyState.isSet}
                  className="bg-newsblue hover:bg-newsblue-light"
                >
                  <Send size={18} />
                </Button>
              </form>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Index;
