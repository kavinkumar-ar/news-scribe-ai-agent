
import { Article, UserPreference } from '@/types';
import { 
  NEWS_ASSISTANT_SYSTEM_PROMPT, 
  INTERESTS_EXTRACTION_PROMPT,
  SUMMARY_GENERATION_PROMPT,
  NEWS_RECOMMENDATION_PROMPT 
} from '@/lib/systemPrompts';
import { extractInterestsFromMessage } from '@/lib/utils';

export async function generateSummary(article: Article, apiKey: string): Promise<string> {
  // Simulate using the SUMMARY_GENERATION_PROMPT
  return new Promise((resolve) => {
    setTimeout(() => {
      const summary = `Summary generated using system prompt: ${SUMMARY_GENERATION_PROMPT}

Summary of "${article.title}": ${article.description || 'No description available.'}
      
The article was published by ${article.source.name} on ${new Date(article.publishedAt).toLocaleString()}.
${article.author ? `Author: ${article.author}` : ''}

Key points derived from the system prompt:
- Maintained original article's intent
- Provided clear, accessible language
- Included contextual insights

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
  // Simulate using NEWS_ASSISTANT_SYSTEM_PROMPT and NEWS_RECOMMENDATION_PROMPT
  return new Promise((resolve) => {
    setTimeout(() => {
      const mentionedInterests = extractInterestsFromMessage(message);
      
      let response = `Response generated using system prompts: 
      - ${NEWS_ASSISTANT_SYSTEM_PROMPT}
      - ${NEWS_RECOMMENDATION_PROMPT}\n\n`;
      
      if (userPrefs && userPrefs.interests.length > 0) {
        const topInterests = userPrefs.interests
          .sort((a, b) => b.confidence - a.confidence)
          .slice(0, 3)
          .map(i => i.topic);
          
        response += `Based on your interests in ${topInterests.join(', ')}, `;
      }
      
      if (mentionedInterests.length > 0) {
        response += `focusing on ${mentionedInterests.join(', ')}, `;
      }
      
      response += `here are some personalized news recommendations:\n\n`;
      
      recentArticles.slice(0, 3).forEach((article, index) => {
        response += `${index + 1}. **${article.title}** (${article.source.name})\n`;
        response += `   ${article.description || 'No description available.'}\n\n`;
      });
      
      resolve(response);
    }, 1000);
  });
}
