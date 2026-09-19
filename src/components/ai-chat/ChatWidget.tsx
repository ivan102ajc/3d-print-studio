import { useState, useRef, useEffect } from 'react';
import { processChatMessage, quickPriceEstimate, quickMaterialRecommendation } from '../../lib/ai/aiService';
import { MessageSquare, X, Send, Loader2, Sparkles } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ChatWidgetProps {
  isDark: boolean;
}

export default function ChatWidget({ isDark }: ChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Здравствуйте! 👋 Я AI-консультант ProtoLab 3D. Помогу подобрать материал и принтер, рассчитать примерную стоимость и ответить на вопросы о 3D-печати. С чего начнём?',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const bgCard = isDark ? 'bg-[#111827]' : 'bg-white';
  const bgCardAlt = isDark ? 'bg-[#0d1b2a]' : 'bg-gray-50';
  const textPrimary = isDark ? 'text-white' : 'text-gray-900';
  const textSecondary = isDark ? 'text-gray-300' : 'text-gray-700';
  const borderMain = isDark ? 'border-white/10' : 'border-gray-200';

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Проверяем, не является ли это запросом на расчёт стоимости
      const priceMatch = input.match(/стоимость|цена|сколько стоит|расчёт/i);
      if (priceMatch) {
        // Здесь можно добавить более сложную логику извлечения параметров
        // Пока просто отправляем в AI
      }

      // Отправляем в AI
      const conversationHistory = messages
        .slice(-10)
        .map(msg => ({
          role: msg.role as 'user' | 'assistant',
          content: msg.content,
        }));

      const response = await processChatMessage(input.trim(), conversationHistory);

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Извините, произошла ошибка. Пожалуйста, попробуйте ещё раз или свяжитесь с нами напрямую через Telegram @ivanchay0937.',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const suggestedQuestions = [
    'Какой материал выбрать?',
    'Сколько стоит печать?',
    'Какие сроки?',
    'Как оформить заказ?',
  ];

  const handleSuggestedQuestion = (question: string) => {
    setInput(question);
    setTimeout(() => handleSend(), 100);
  };

  const handleNewChat = () => {
    setMessages([
      {
        id: Date.now().toString(),
        role: 'assistant',
        content: 'Здравствуйте! 👋 Я AI-консультант ProtoLab 3D. Помогу подобрать материал и принтер, рассчитать примерную стоимость и ответить на вопросы о 3D-печати. С чего начнём?',
        timestamp: new Date(),
      },
    ]);
  };

  return (
    <>
      {/* Кнопка открытия чата */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-[999] w-14 h-14 rounded-full bg-gradient-to-r from-cyan-500 to-purple-600 text-white shadow-lg shadow-cyan-500/30 flex items-center justify-center hover:scale-110 transition-transform duration-300"
        title="AI-консультант"
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
      </button>

      {/* Окно чата */}
      {isOpen && (
        <div className={`fixed bottom-24 right-6 z-[999] w-[calc(100vw-3rem)] sm:w-96 h-[500px] max-h-[70vh] rounded-2xl ${bgCard} border ${borderMain} shadow-2xl flex flex-col overflow-hidden`}>
          {/* Заголовок */}
          <div className="bg-gradient-to-r from-cyan-500 to-purple-600 p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-white font-['Orbitron'] text-sm font-bold">AI-консультант</h3>
              <p className="text-white/70 text-xs">ProtoLab 3D</p>
            </div>
            <button
              onClick={handleNewChat}
              className="text-white/70 hover:text-white transition-colors text-xs"
              title="Новый диалог"
            >
              Новый
            </button>
          </div>

          {/* Сообщения */}
          <div className={`flex-1 overflow-y-auto p-4 space-y-3 ${isDark ? 'bg-[#0a0a1a]' : 'bg-gray-50'}`}>
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm whitespace-pre-line ${
                    msg.role === 'user'
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-br-md'
                      : `${bgCardAlt} ${textSecondary} border ${borderMain} rounded-bl-md`
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className={`${bgCardAlt} border ${borderMain} rounded-2xl rounded-bl-md px-4 py-3`}>
                  <Loader2 className="w-5 h-5 animate-spin text-cyan-500" />
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Быстрые вопросы */}
          {messages.length <= 2 && (
            <div className={`px-4 py-2 border-t ${borderMain} flex flex-wrap gap-1.5`}>
              {suggestedQuestions.map((q, i) => (
                <button
                  key={i}
                  onClick={() => handleSuggestedQuestion(q)}
                  className={`text-xs px-3 py-1.5 rounded-full border ${borderMain} ${textSecondary} hover:text-cyan-400 hover:border-cyan-500/50 transition-colors`}
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Поле ввода */}
          <div className={`p-3 border-t ${borderMain} ${bgCard}`}>
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Задайте вопрос..."
                disabled={isLoading}
                className={`flex-1 ${bgCardAlt} border ${borderMain} rounded-xl px-4 py-2.5 ${textPrimary} text-sm focus:outline-none focus:border-cyan-500/50 transition-colors disabled:opacity-50`}
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="w-10 h-10 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white flex items-center justify-center hover:from-cyan-400 hover:to-blue-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
