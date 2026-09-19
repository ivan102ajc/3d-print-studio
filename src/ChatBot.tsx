import { useState, useRef, useEffect } from 'react';
import { knowledgeBase } from './knowledgeBase';

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

  // Функция поиска ответа по ключевым словам
  const findAnswer = (input: string): string => {
    const normalizedInput = input.toLowerCase().trim();
    
    // Поиск по ключевым словам
    let bestMatch: { answer: string; score: number } | null = null;
    
    for (const entry of knowledgeBase) {
      let score = 0;
      
      for (const keyword of entry.keywords) {
        if (normalizedInput.includes(keyword)) {
          score += keyword.length;
        }
      }
      
      if (score > 0 && (!bestMatch || score > bestMatch.score)) {
        bestMatch = { answer: entry.answer, score };
      }
    }
    
    if (bestMatch) {
      return bestMatch.answer;
    }
    
    // Если ничего не найдено
    return 'Я эксперт по 3D-печати! 🤖 Могу рассказать о:\n\n• Технологиях и возможностях\n• Материалах (PLA, PETG, ABS, TPU, нейлон, карбон)\n• Принтерах (Bambu Lab, Creality, Z-Bolt)\n• Ценах и расчёте стоимости\n• Сроках и срочности\n• Постобработке и качестве\n• Файлах и подготовке\n• Доставке и логистике\n\nЗадайте конкретный вопрос — отвечу подробно! 💡';
  };

  const handleSend = () => {
    const text = input.trim();
    if (!text) return;

    const userMessage: Message = { role: 'user', text, timestamp: Date.now() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const answer = findAnswer(text);
      setMessages(prev => [...prev, { role: 'bot', text: answer, timestamp: Date.now() }]);
      setIsTyping(false);
    }, 500 + Math.random() * 800);
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
            <div>
              <h3 className="text-white font-['Orbitron'] text-sm font-bold">AI-ассистент</h3>
              <p className="text-white/70 text-xs">Эксперт по 3D-печати</p>
            </div>
          </div>

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
