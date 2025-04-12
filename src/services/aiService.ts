
import { Article, UserPreference } from '@/types';
import { extractInterestsFromMessage } from '@/lib/utils';

export async function generateSummary(article: Article, apiKey: string): Promise<string> {
  // In a real application, this would call an actual AI API like Gemini or GPT
  // For demonstration purposes, we're just returning a simplified version of the article content
  return new Promise((resolve) => {
    setTimeout(() => {
      const summary = `Summary of "${article.title}": ${article.description || 'No description available.'} 
      
The article was published by ${article.source.name} on ${new Date(article.publishedAt).toLocaleString()}.
${article.author ? `Author: ${article.author}` : ''}

Key points:
- This is the main point from the article
- Another important detail from the article
- The article mentions relevant background information

Read the full article at: ${article.url}`;
      
      resolve(summary);
    }, 1000);
  });
}

export async function generateResponse(
  message: string, 
  userPrefs: UserPreference | null,
  recentArticles: Article[]
): Promise<string> {
  // Extract interests from the current message
  const mentionedInterests = extractInterestsFromMessage(message);
  
  // In a real application, this would call an actual AI API
  return new Promise((resolve) => {
    setTimeout(() => {
      let response = '';
      
      // If there's a user preference stored
      if (userPrefs && userPrefs.interests.length > 0) {
        const topInterests = userPrefs.interests
          .sort((a, b) => b.confidence - a.confidence)
          .slice(0, 3)
          .map(i => i.topic);
          
        response += `Based on your interests in ${topInterests.join(', ')}, `;
      }
      
      // If the user mentioned specific topics
      if (mentionedInterests.length > 0) {
        if (response) {
          response += `and specifically about ${mentionedInterests.join(', ')}, `;
        } else {
          response += `Regarding ${mentionedInterests.join(', ')}, `;
        }
      }
      
      // Complete the response with a summary of relevant articles
      if (recentArticles.length > 0) {
        response += `here's a summary of the latest news:\n\n`;
        
        recentArticles.slice(0, 3).forEach((article, index) => {
          response += `${index + 1}. **${article.title}** (${article.source.name})\n`;
          response += `   ${article.description || 'No description available.'}\n\n`;
        });
        
        if (recentArticles.length > 3) {
          response += `I found ${recentArticles.length - 3} more articles on this topic. Would you like me to summarize any specific one?`;
        } else {
          response += `Would you like me to learn more about any of these stories?`;
        }
      } else {
        // Add more variety to the "no results" response
        const noResultsResponses = [
          `I couldn't find recent news articles matching your query. Would you like me to search for something else?`,
          `I don't see any recent news about that topic. Perhaps try a different search term?`,
          `No recent articles found on this subject. What other topics interest you?`,
          `There don't seem to be recent news articles on that. Can I help you find information on another topic?`,
          `I don't have any recent articles about that. Would you like to explore a different subject?`
        ];
        
        response += noResultsResponses[Math.floor(Math.random() * noResultsResponses.length)];
      }
      
      resolve(response);
    }, 1000); // Reduced delay from 1500ms to 1000ms for faster response
  });
}
