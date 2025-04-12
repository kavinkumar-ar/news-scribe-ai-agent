
import { UserPreference, UserInterest, ChatMessage } from '@/types';
import { generateUniqueId } from '@/lib/utils';

const USER_PREF_KEY = 'newsscribe_user_preferences';
const CHAT_HISTORY_KEY = 'newsscribe_chat_history';

export function saveUserPreference(preferences: Partial<UserPreference>): void {
  try {
    const existingPrefsStr = localStorage.getItem(USER_PREF_KEY);
    let existingPrefs: UserPreference | null = null;
    
    if (existingPrefsStr) {
      existingPrefs = JSON.parse(existingPrefsStr);
    }
    
    const updatedPrefs: UserPreference = {
      id: existingPrefs?.id || generateUniqueId(),
      interests: preferences.interests || existingPrefs?.interests || [],
      preferredSources: preferences.preferredSources || existingPrefs?.preferredSources || [],
      summarizedArticles: preferences.summarizedArticles || existingPrefs?.summarizedArticles || [],
      lastUpdated: new Date()
    };
    
    localStorage.setItem(USER_PREF_KEY, JSON.stringify(updatedPrefs));
  } catch (error) {
    console.error('Error saving user preferences:', error);
  }
}

export function getUserPreference(): UserPreference | null {
  try {
    const prefsStr = localStorage.getItem(USER_PREF_KEY);
    if (!prefsStr) return null;
    
    const prefs = JSON.parse(prefsStr);
    prefs.lastUpdated = new Date(prefs.lastUpdated);
    return prefs;
  } catch (error) {
    console.error('Error retrieving user preferences:', error);
    return null;
  }
}

export function addUserInterest(topic: string): void {
  try {
    const prefs = getUserPreference() || {
      id: generateUniqueId(),
      interests: [],
      preferredSources: [],
      summarizedArticles: [],
      lastUpdated: new Date()
    };
    
    // Check if interest already exists
    const existingInterest = prefs.interests.find(i => i.topic.toLowerCase() === topic.toLowerCase());
    
    if (existingInterest) {
      // Increase confidence if it already exists
      existingInterest.confidence = Math.min(existingInterest.confidence + 0.25, 1);
    } else {
      // Add new interest
      prefs.interests.push({
        topic,
        confidence: 0.5
      });
    }
    
    saveUserPreference(prefs);
  } catch (error) {
    console.error('Error adding user interest:', error);
  }
}

export function addSummarizedArticle(articleUrl: string): void {
  try {
    const prefs = getUserPreference() || {
      id: generateUniqueId(),
      interests: [],
      preferredSources: [],
      summarizedArticles: [],
      lastUpdated: new Date()
    };
    
    if (!prefs.summarizedArticles.includes(articleUrl)) {
      prefs.summarizedArticles.push(articleUrl);
      saveUserPreference(prefs);
    }
  } catch (error) {
    console.error('Error adding summarized article:', error);
  }
}

export function addPreferredSource(sourceName: string): void {
  try {
    const prefs = getUserPreference() || {
      id: generateUniqueId(),
      interests: [],
      preferredSources: [],
      summarizedArticles: [],
      lastUpdated: new Date()
    };
    
    if (!prefs.preferredSources.includes(sourceName)) {
      prefs.preferredSources.push(sourceName);
      saveUserPreference(prefs);
    }
  } catch (error) {
    console.error('Error adding preferred source:', error);
  }
}

export function saveChatMessages(messages: ChatMessage[]): void {
  try {
    localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(messages));
  } catch (error) {
    console.error('Error saving chat messages:', error);
  }
}

export function getChatMessages(): ChatMessage[] {
  try {
    const messagesStr = localStorage.getItem(CHAT_HISTORY_KEY);
    if (!messagesStr) return [];
    
    const messages = JSON.parse(messagesStr);
    return messages.map((msg: any) => ({
      ...msg,
      timestamp: new Date(msg.timestamp)
    }));
  } catch (error) {
    console.error('Error retrieving chat messages:', error);
    return [];
  }
}
