import { useState, useRef, useEffect } from 'react';
import { knowledgeBase } from './knowledgeBase';
import { queryDeepSeek, isValidApiKey } from './deepseek';

type Message = {
  role: 'user' | 'bot';
  text: string;
  timestamp: number;
};

type Props = {
  isDark: boolean;
};

export default function ChatBot({ isDark }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: 'bot', 
      text: 'Привет! 👋 Я AI-ассистент ProtoLab 3D — эксперт по 3D-печати. Могу ответить на 100+ вопросов о технологиях, материалах, ценах, сроках и многом другом!\n\nПримеры вопросов:\n• "Какой материал лучше для шестерни?"\n• "Расскажи про PLA"\n• "Какой принтер лучше для больших деталей?"\n• "Сколько стоит печать?"',
      timestamp: Date.now(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [apiKey, setApiKey] = useState<string>(() => {
    return localStorage.getItem('deepseek_api_key') || '';
  });
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);
  const [tempApiKey, setTempApiKey] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const bgCard = isDark ? 'bg-[#111827]' : 'bg-white';
  const bgCardAlt = isDark ? 'bg-[#0d1b2a]' : 'bg-gray-50';
  const textPrimary = isDark ? 'text-white' : 'text-gray-900';
  const textSecondary = isDark ? 'text-gray-300' : 'text-gray-700';
  const textMuted = isDark ? 'text-gray-400' : 'text-gray-500';
  const borderMain = isDark ? 'border-white/10' : 'border-gray-200';

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  // Улучшенная функция поиска ответа
  const findAnswer = (input: string): string => {
    const normalizedInput = input.toLowerCase().trim();
    
    // Массив всех подходящих ответов с их оценками
    const matches: { answer: string; score: number; index: number }[] = [];
    
    for (let i = 0; i < knowledgeBase.length; i++) {
      const entry = knowledgeBase[i];
      let score = 0;
      let matchedKeywords = 0;
      
      // Проверяем каждое ключевое слово
      for (const keyword of entry.keywords) {
        if (normalizedInput.includes(keyword)) {
          // Более длинные совпадения важнее
          score += keyword.length * 2;
          matchedKeywords++;
          
          // Бонус за точное совпадение слова
          const words = normalizedInput.split(/\s+/);
          if (words.includes(keyword)) {
            score += 5;
          }
        }
      }
      
      // Бонус за множественные совпадения
      if (matchedKeywords > 1) {
        score *= 1.5;
      }
      
      if (score > 0 && entry.answers.length > 0) {
        // Выбираем случайный ответ из доступных
        const randomAnswer = entry.answers[Math.floor(Math.random() * entry.answers.length)];
        matches.push({ answer: randomAnswer, score, index: i });
      }
    }
    
    // Сортируем по оценке
    matches.sort((a, b) => b.score - a.score);
    
    // Если есть совпадения
    if (matches.length > 0) {
      // Берём топ-3 ответа и выбираем случайно для разнообразия
      const topMatches = matches.slice(0, Math.min(3, matches.length));
      const randomMatch = topMatches[Math.floor(Math.random() * topMatches.length)];
      return randomMatch.answer;
    }
    
    // Если ничего не найдено - возвращаем специальный маркер для DeepSeek
    return 'Я эксперт по 3D-печати и могу помочь с вопросами о материалах, ценах, сроках и технологиях. Уточните ваш вопрос, пожалуйста!';
  };

  const handleSend = async () => {
    const text = input.trim();
    if (!text) return;

    const userMessage: Message = { role: 'user', text, timestamp: Date.now() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      // Сначала пытаемся найти ответ в базе знаний
      let answer = findAnswer(text);
      
      // Если ответ из fallback и есть API ключ - используем DeepSeek
      if (answer.includes('Уточните ваш вопрос') && apiKey) {
        try {
          // Собираем историю разговора для контекста
          const conversationHistory = messages
            .slice(-10) // Последние 10 сообщений для контекста
            .map(msg => ({
              role: msg.role === 'user' ? 'user' as const : 'assistant' as const,
              content: msg.text
            }));
          
          answer = await queryDeepSeek(apiKey, text, conversationHistory);
        } catch (error) {
          console.error('DeepSeek error:', error);
          // Если ошибка API - используем ответ из базы знаний
        }
      }
      
      setMessages(prev => [...prev, { role: 'bot', text: answer, timestamp: Date.now() }]);
    } catch (error) {
      setMessages(prev => [...prev, { 
        role: 'bot', 
        text: 'Извините, произошла ошибка при обработке запроса. Попробуйте ещё раз или обратитесь к нам напрямую в Telegram @ivanchay0937', 
        timestamp: Date.now() 
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSaveApiKey = () => {
    if (isValidApiKey(tempApiKey)) {
      setApiKey(tempApiKey);
      localStorage.setItem('deepseek_api_key', tempApiKey);
      setShowApiKeyInput(false);
      setTempApiKey('');
      setMessages(prev => [...prev, { 
        role: 'bot', 
        text: '✅ API ключ DeepSeek успешно сохранён! Теперь я могу отвечать на более сложные вопросы с помощью искусственного интеллекта.', 
        timestamp: Date.now() 
      }]);
    } else {
      alert('Неверный формат API ключа. Ключ должен начинаться с "sk-" и быть длиннее 20 символов.');
    }
  };

  const handleRemoveApiKey = () => {
    setApiKey('');
    localStorage.removeItem('deepseek_api_key');
    setMessages(prev => [...prev, { 
      role: 'bot', 
      text: 'API ключ удалён. Теперь я буду отвечать только на основе базы знаний.', 
      timestamp: Date.now() 
    }]);
  };

  const quickQuestions = [
    'Какой материал для шестерни?',
    'Расскажи про PLA',
    'Какой принтер лучше?',
    'Сколько стоит печать?',
  ];

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-[999] w-14 h-14 rounded-full bg-gradient-to-r from-cyan-500 to-purple-600 text-white shadow-lg shadow-cyan-500/30 flex items-center justify-center hover:scale-110 transition-transform duration-300`}
        title="AI-ассистент"
      >
        {isOpen ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        )}
      </button>

      {isOpen && (
        <div className={`fixed bottom-24 right-6 z-[999] w-[calc(100vw-3rem)] sm:w-96 h-[500px] max-h-[70vh] rounded-2xl ${bgCard} border ${borderMain} shadow-2xl flex flex-col overflow-hidden`}>
          <div className="bg-gradient-to-r from-cyan-500 to-purple-600 p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <span className="text-xl">🤖</span>
            </div>
            <div className="flex-1">
              <h3 className="text-white font-['Orbitron'] text-sm font-bold">AI-ассистент</h3>
              <p className="text-white/70 text-xs">
                {apiKey ? '✨ DeepSeek активен' : 'Эксперт по 3D-печати'}
              </p>
            </div>
            <button
              onClick={() => setShowApiKeyInput(!showApiKeyInput)}
              className="text-white/70 hover:text-white transition-colors"
              title="Настройки API"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
          </div>

          {/* API Key Input Modal */}
          {showApiKeyInput && (
            <div className={`${bgCardAlt} border-b ${borderMain} p-4 space-y-3`}>
              <div className="flex items-center justify-between">
                <h4 className={`font-['Orbitron'] text-sm font-bold ${textPrimary}`}>
                  🔑 DeepSeek API
                </h4>
                <button
                  onClick={() => setShowApiKeyInput(false)}
                  className={`${textMuted} hover:text-red-500 transition-colors`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              {apiKey ? (
                <div className="space-y-2">
                  <p className={`text-xs ${textSecondary}`}>
                    ✅ API ключ активен
                  </p>
                  <p className={`text-xs ${textMuted}`}>
                    Ключ: {apiKey.substring(0, 10)}...{apiKey.substring(apiKey.length - 4)}
                  </p>
                  <button
                    onClick={handleRemoveApiKey}
                    className="w-full py-2 px-4 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-400 text-sm font-medium transition-colors"
                  >
                    Удалить API ключ
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <p className={`text-xs ${textSecondary}`}>
                    Получите API ключ на{' '}
                    <a 
                      href="https://platform.deepseek.com/api_keys" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-cyan-400 hover:underline"
                    >
                      platform.deepseek.com
                    </a>
                  </p>
                  <input
                    type="password"
                    value={tempApiKey}
                    onChange={(e) => setTempApiKey(e.target.value)}
                    placeholder="sk-..."
                    className={`w-full px-3 py-2 rounded-lg ${bgCard} border ${borderMain} ${textPrimary} text-sm focus:outline-none focus:border-cyan-500/50 transition-colors`}
                  />
                  <button
                    onClick={handleSaveApiKey}
                    disabled={!tempApiKey}
                    className="w-full py-2 px-4 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm font-medium hover:from-cyan-400 hover:to-blue-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Сохранить API ключ
                  </button>
                  <p className={`text-xs ${textMuted}`}>
                    🔒 Ключ хранится только в вашем браузере
                  </p>
                </div>
              )}
            </div>
          )}

          <div className={`flex-1 overflow-y-auto p-4 space-y-3 ${isDark ? 'bg-[#0a0a1a]' : 'bg-gray-50'}`}>
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm whitespace-pre-line ${
                  msg.role === 'user'
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-br-md'
                    : `${bgCardAlt} ${textSecondary} border ${borderMain} rounded-bl-md`
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className={`${bgCardAlt} border ${borderMain} rounded-2xl rounded-bl-md px-4 py-3`}>
                  <div className="flex gap-1">
                    <div className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {messages.length <= 2 && (
            <div className={`px-4 py-2 border-t ${borderMain} flex flex-wrap gap-1.5`}>
              {quickQuestions.map((q, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setMessages(prev => [...prev, { role: 'user', text: q, timestamp: Date.now() }]);
                    setIsTyping(true);
                    setTimeout(() => {
                      setMessages(prev => [...prev, { role: 'bot', text: findAnswer(q), timestamp: Date.now() }]);
                      setIsTyping(false);
                    }, 500 + Math.random() * 800);
                  }}
                  className={`text-xs px-3 py-1.5 rounded-full border ${borderMain} text-gray-500 hover:text-cyan-400 hover:border-cyan-500/50 transition-colors`}
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          <div className={`p-3 border-t ${borderMain} ${bgCard}`}>
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Задайте вопрос..."
                className={`flex-1 ${bgCardAlt} border ${borderMain} rounded-xl px-4 py-2.5 ${textPrimary} text-sm focus:outline-none focus:border-cyan-500/50 transition-colors`}
              />
              <button
                onClick={handleSend}
                disabled={!input.trim()}
                className="w-10 h-10 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white flex items-center justify-center hover:from-cyan-400 hover:to-blue-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
