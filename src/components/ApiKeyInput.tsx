
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ApiKeyState } from '@/types';
import { Eye, EyeOff, Key } from 'lucide-react';

interface ApiKeyInputProps {
  apiKeyState: ApiKeyState;
  setApiKeyState: React.Dispatch<React.SetStateAction<ApiKeyState>>;
}

const API_KEY_STORAGE_KEY = 'newsscribe_api_key';

const ApiKeyInput: React.FC<ApiKeyInputProps> = ({ apiKeyState, setApiKeyState }) => {
  const [inputValue, setInputValue] = useState('');
  const [showKey, setShowKey] = useState(false);
  
  useEffect(() => {
    const savedApiKey = localStorage.getItem(API_KEY_STORAGE_KEY);
    if (savedApiKey) {
      setApiKeyState({ apiKey: savedApiKey, isSet: true });
    }
  }, [setApiKeyState]);

  const handleSaveKey = () => {
    if (inputValue.trim()) {
      localStorage.setItem(API_KEY_STORAGE_KEY, inputValue.trim());
      setApiKeyState({ apiKey: inputValue.trim(), isSet: true });
      setInputValue('');
    }
  };

  const handleResetKey = () => {
    localStorage.removeItem(API_KEY_STORAGE_KEY);
    setApiKeyState({ apiKey: '', isSet: false });
  };

  const toggleShowKey = () => {
    setShowKey(!showKey);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto border-highlight">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Key size={20} />
          News API Key Setup
        </CardTitle>
        <CardDescription>
          NewsScribe requires a News API key to fetch real-time news data. You can get a free API key by signing up at <a href="https://newsapi.org/" target="_blank" rel="noopener noreferrer" className="text-highlight underline">newsapi.org</a>
        </CardDescription>
      </CardHeader>
      <CardContent>
        {apiKeyState.isSet ? (
          <div>
            <p className="mb-2 font-medium">Your API key is set:</p>
            <div className="flex items-center gap-2">
              <Input
                type={showKey ? "text" : "password"} 
                value={apiKeyState.apiKey}
                readOnly
                className="bg-muted"
              />
              <Button 
                size="icon" 
                variant="outline"
                onClick={toggleShowKey}
              >
                {showKey ? <EyeOff size={18} /> : <Eye size={18} />}
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Input
              type="text"
              placeholder="Enter your News API key"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
            <Button onClick={handleSaveKey} disabled={!inputValue.trim()}>
              Save Key
            </Button>
          </div>
        )}
      </CardContent>
      {apiKeyState.isSet && (
        <CardFooter>
          <Button 
            variant="outline" 
            onClick={handleResetKey}
            className="text-destructive border-destructive hover:bg-destructive/10"
          >
            Reset API Key
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default ApiKeyInput;
