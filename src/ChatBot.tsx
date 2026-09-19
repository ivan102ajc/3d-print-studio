import { useState, useRef, useEffect } from 'react';

type Message = {
  role: 'user' | 'bot';
  text: string;
};

// База знаний - ответы на вопросы о 3D-печати
const knowledgeBase: { keywords: string[]; answer: string }[] = [
  {
    keywords: ['привет', 'здравствуй', 'добрый', 'хай', 'hello', 'hi', 'здарова', 'приветик'],
    answer: 'Здравствуйте! 👋 Я AI-ассистент ProtoLab 3D. Могу ответить на вопросы о 3D-печати, материалах, ценах и наших услугах. Что вас интересует?',
  },
  {
    keywords: ['кто ты', 'что ты', 'ты кто', 'ассистент', 'бот', 'робот'],
    answer: 'Я AI-ассистент ProtoLab 3D 🤖 Помогаю ответить на вопросы о 3D-печати, материалах, ценах и услугах нашей мастерской в Люберцах.',
  },
  {
    keywords: ['3d печать', '3д печать', 'трёхмерн', 'трехмерн', 'печать', 'напечатать', 'распечатать', 'печатаете'],
    answer: 'Мы печатаем по технологии FDM (послойное наплавление). Это надёжная технология для прототипов, корпусов, функциональных деталей и небольших серий. У нас 6 принтеров, что позволяет выполнять заказы быстро. 🖨',
  },
  {
    keywords: ['fdm', 'технология', 'метод', 'способ', 'как печатаете'],
    answer: 'FDM (Fused Deposition Modeling) — послойное наплавление пластика. Расплавленный пластик выдавливается через сопло и послойно создаёт объект. Подходит для функциональных деталей, прототипов, корпусов и DIY-проектов.',
  },
  {
    keywords: ['материал', 'пластик', 'pla', 'petg', 'abs', 'tpu', 'нейлон', 'карбон', 'материалы'],
    answer: 'Мы работаем с 6+ материалами:\n• PLA (8₽/г) — декор, прототипы\n• PETG (8₽/г) — прочность, универсальность\n• ABS (8₽/г) — термостойкость\n• TPU (15₽/г) — гибкие детали\n• PA12/PA6/PA66 (25₽/г) — инженерные\n• Карбононаполненные (30₽/г) — максимальная жёсткость',
  },
  {
    keywords: ['pla', 'пла', 'платить'],
    answer: 'PLA — самый популярный материал для декора и прототипов. Биоразлагаемый, легко печатается, хорошая детализация. Цена: 8₽/грамм. Не подходит для деталей, работающих при температуре выше 60°C.',
  },
  {
    keywords: ['petg', 'петг'],
    answer: 'PETG — отличный баланс прочности и простоты печати. Устойчив к ударам, влаге, химикатам. Температура эксплуатации до 80°C. Цена: 8₽/грамм. Идеален для функциональных деталей.',
  },
  {
    keywords: ['abs', 'абс'],
    answer: 'ABS — прочный и термостойкий пластик. Выдерживает температуры до 100°C. Устойчив к ударам. Цена: 8₽/грамм. Подходит для автомобильных деталей, корпусов электроники.',
  },
  {
    keywords: ['tpu', 'тпу', 'гибк', 'эластич', 'резинов'],
    answer: 'TPU — гибкий, эластичный материал, похожий на резину. Идеален для чехлов, прокладок, амортизаторов, гибких петель. Цена: 15₽/грамм.',
  },
  {
    keywords: ['нейлон', 'pa12', 'pa6', 'pa66', 'полиамид', 'инженерн'],
    answer: 'Нейлон (PA12/PA6/PA66) — инженерный материал с высокой прочностью, износостойкостью и термостойкостью. Используется для нагруженных деталей, шестерёнок, втулок. Цена: 25₽/грамм.',
  },
  {
    keywords: ['карбон', 'углепластик', 'карбонов', 'прочн', 'жёстк'],
    answer: 'Карбононаполненные композиты — максимальная жёсткость и прочность при малом весе. Идеальны для нагруженных конструкций, дронов, спортивных деталей. Цена: 30₽/грамм.',
  },
  {
    keywords: ['цена', 'стоимость', 'сколько стоит', 'прайс', 'расценк', 'рубл', 'денег'],
    answer: '💰 Наши цены:\n• PLA/PETG/ABS — от 8₽/грамм\n• TPU — от 15₽/грамм\n• Нейлон — от 25₽/грамм\n• Карбон — от 30₽/грамм\n• 3D-моделирование — 500₽/час\n• 3D-сканирование — по запросу\n\n🎁 Скидки: от 10 шт — 5%, от 20 шт — 10%, от 50 шт — 15%',
  },
  {
    keywords: ['скидк', 'дешевл', 'оптом', 'много', 'большой заказ', 'серия'],
    answer: '🎁 При больших заказах действуют скидки:\n• От 10 штук — 5%\n• От 20 штук — 10%\n• От 50 штук — 15%\n\nДля расчёта стоимости используйте наш калькулятор на сайте!',
  },
  {
    keywords: ['принтер', 'оборудовани', 'какой принтер', 'bambu', 'creality', 'z-bolt'],
    answer: 'У нас 6 принтеров:\n🖨 Bambu Lab P1S — 256×256×256 мм\n🖨 Creality K1 Max — 300×300×300 мм\n🖨 Flying Bear Ghost 4 — 255×210×210 мм\n🖨 Bambu Lab H2S — 256×256×256 мм\n🖨 Bambu Lab A1 Combo — 256×256×256 мм\n🖨 Z-Bolt S300 HT — 300×300×400 мм',
  },
  {
    keywords: ['объём', 'размер', 'максимальн', 'большой', 'габарит'],
    answer: 'Максимальный объём печати:\n• Creality K1 Max и Z-Bolt S300 HT: 300×300×300-400 мм\n• Остальные принтеры: 256×256×256 мм\n\nДля очень больших деталей возможна печать по частям с последующей склейкой.',
  },
  {
    keywords: ['срок', 'время', 'долго', 'быстро', 'когда готов', 'скорость'],
    answer: '⏱ Сроки зависят от сложности и объёма:\n• Простые детали — от 1 дня\n• Средние проекты — 2-5 дней\n• Сложные/большие заказы — 5-14 дней\n• Срочные заказы — +50% к стоимости\n\nБлагодаря 6 принтерам мы можем выполнять несколько заказов одновременно!',
  },
  {
    keywords: ['срочн', 'быстр', 'сегодня', 'завтра', 'горит'],
    answer: '⚡ Срочные заказы выполняем с наценкой +50%. Сроки зависят от сложности — от нескольких часов до 1-2 дней. Для уточнения свяжитесь с нами в Telegram или Max.',
  },
  {
    keywords: ['моделировани', '3d модел', 'создать модель', 'спроектироват', 'дизайн', 'чертеж'],
    answer: '🎨 Мы предлагаем 3D-моделирование:\n• Создание модели по чертежам/эскизам\n• Реверс-инжиниринг (модель по существующей детали)\n• Стоимость: 500₽/час\n\nМожем помочь с проектированием любой сложности!',
  },
  {
    keywords: ['сканировани', '3d scan', 'оцифровк', 'скопировать деталь'],
    answer: '📡 3D-сканирование — оцифровка физических объектов для создания точных 3D-моделей. Подходит для реверс-инжиниринга, копирования деталей, создания архивов. Стоимость уточняйте при обращении.',
  },
  {
    keywords: ['адрес', 'где находит', 'люберцы', 'гагарина', 'приехать', 'офис'],
    answer: '📍 Наш адрес: г. Люберцы, проспект Гагарина, дом 21\n\nМожете приехать для обсуждения заказа или забрать готовую работу. Также отправляем по всей России.',
  },
  {
    keywords: ['доставк', 'отправк', 'почта', 'россия', 'доставить', 'курьер'],
    answer: '📦 Отправляем заказы по всей России! Способы доставки:\n• Почта России\n• СДЭК\n• Boxberry\n• Другие транспортные компании\n\nСамовывоз: г. Люберцы, пр. Гагарина, 21',
  },
  {
    keywords: ['оплат', 'как оплатит', 'перевод', 'наличн', 'карт'],
    answer: '💳 Способы оплаты:\n• Перевод на карту (Сбербанк, Тинькофф)\n• СБП (Система быстрых платежей)\n• Наличные при самовывозе\n\nОплата после согласования заказа.',
  },
  {
    keywords: ['связ', 'контакт', 'телефон', 'telegram', 'телеграм', 'макс', 'написать'],
    answer: '📱 Свяжитесь с нами:\n• Telegram: @ivanchay0937\n• Max: через ссылку на сайте\n• Канал: @protolab_3d_pechat\n\nОтветим на все вопросы и поможем с заказом!',
  },
  {
    keywords: ['канал', 'чат', 'групп', 'подписат'],
    answer: '📢 Наш Telegram-канал: @protolab_3d_pechat\n\nТам мы публикуем:\n• Реальные заказы\n• Процесс работы\n• Тесты материалов\n• Полезную информацию о 3D-печати',
  },
  {
    keywords: ['makerworld', 'мейкерворлд', 'каталог', 'готовая модель', 'скачать'],
    answer: '🔍 На сайте MakerWorld (makerworld.com/ru) тысячи бесплатных готовых 3D-моделей. Выберите модель, скачайте файл и пришлите нам — мы напечатаем! Также есть MakerLab — генерация 3D-модели из фото с помощью ИИ.',
  },
  {
    keywords: ['makerlab', 'мейкерлаб', 'фото', 'из фото', 'нейросет', 'ии', 'ai'],
    answer: '📸 MakerLab — бесплатный инструмент от MakerWorld. Загружаете фотографию объекта, ИИ анализирует её и создаёт 3D-модель. Попробуйте на makerworld.com/ru/makerlab',
  },
  {
    keywords: ['качество', 'точность', 'погрешност', 'слой', 'разрешен'],
    answer: '🔬 Качество печати:\n• Высота слоя: от 0.12 мм\n• Точность: ±0.2 мм\n• Заполнение: 15-100% (по запросу)\n\nИспользуем качественные филаменты и калиброванные принтеры для лучшего результата.',
  },
  {
    keywords: ['цвет', 'расцветк', 'красн', 'синий', 'белый', 'черный', 'какого цвета'],
    answer: '🎨 Доступны различные цвета пластиков! Самые популярные: белый, чёрный, серый, красный, синий, зелёный, оранжевый. Также есть полупрозрачные, металлические и светящиеся в темноте пластики. Уточняйте наличие при заказе.',
  },
  {
    keywords: ['постобработк', 'шлифовк', 'покраск', 'доработк'],
    answer: '🔧 Возможна постобработка:\n• Шлифовка поверхности\n• Покраска\n• Склейка деталей\n• Установка вставок\n\nСтоимость зависит от объёма работ.',
  },
  {
    keywords: ['прототип', 'макет', 'образец', 'тест'],
    answer: '🧪 Печать прототипов — одно из наших основных направлений! Быстро и недорого создадим прототип вашего изделия для тестирования. PLA/PETG — отличный выбор для прототипов.',
  },
  {
    keywords: ['корпус', 'корпуса', 'корпусн', 'электроник', 'плат'],
    answer: '📦 Печатаем корпуса для электроники, плат, Arduino, Raspberry Pi и других устройств. PETG и ABS отлично подходят — прочные и термостойкие. Можем спроектировать корпус по вашей плате.',
  },
  {
    keywords: ['шестерён', 'шестерен', 'механизм', 'детал', 'запчасть', 'замен'],
    answer: '⚙️ Печатаем функциональные детали: шестерни, втулки, крепления, кронштейны, защёлки. Можем изготовить замену сломанной детали. Для нагруженных узлов рекомендуем нейлон или карбон.',
  },
  {
    keywords: ['фигурк', 'статуэтк', 'сувенир', 'подарок', 'декор'],
    answer: '🎭 Печатаем декоративные изделия: фигурки, статуэтки, сувениры, подарки. PLA — идеальный материал для декора, доступна высокая детализация и различные цвета.',
  },
  {
    keywords: ['diy', 'своими руками', 'хобби', 'мастер', 'самоделк'],
    answer: '🛠 Помогаем DIY-энтузиастам! Печатаем детали для ваших проектов: кронштейны, крепления, адаптеры, корпуса. Можем помочь с моделированием по вашему описанию.',
  },
  {
    keywords: ['одну штук', 'одн', 'в единственн', 'маленький заказ', 'один экземпляр'],
    answer: '✅ Принимаем заказы от 1 штуки! Минимального заказа нет. Даже одна деталь — это нормально. Стоимость рассчитывается по весу и сложности.',
  },
  {
    keywords: ['спасибо', 'благодар', 'круто', 'отлично', 'супер', 'молодец'],
    answer: 'Спасибо! 😊 Рад помочь! Если появятся ещё вопросы — обращайтесь. А для оформления заказа пишите нам в Telegram (@ivanchay0937) или Max.',
  },
  {
    keywords: ['пока', 'до свидания', 'прощай', 'всего хорошего', 'bye'],
    answer: 'До свидания! 👋 Если будут вопросы — я всегда здесь. Для заказа пишите в Telegram (@ivanchay0937) или Max. Хорошего дня!',
  },
];

function findAnswer(input: string): string {
  const normalizedInput = input.toLowerCase().trim();
  
  // Точное совпадение по ключевым словам
  let bestMatch: { answer: string; score: number } | null = null;
  
  for (const item of knowledgeBase) {
    let score = 0;
    for (const keyword of item.keywords) {
      if (normalizedInput.includes(keyword)) {
        score += keyword.length; // Более длинные совпадения важнее
      }
    }
    if (score > 0 && (!bestMatch || score > bestMatch.score)) {
      bestMatch = { answer: item.answer, score };
    }
  }
  
  if (bestMatch) return bestMatch.answer;
  
  // Если ничего не найдено
  return 'Извините, я не нашёл ответа на этот вопрос. 😕\n\nПопробуйте спросить о:\n• Материалах (PLA, PETG, ABS, TPU)\n• Ценах и скидках\n• Оборудовании\n• Сроках выполнения\n• 3D-моделировании и сканировании\n• Контактах и доставке\n\nИли свяжитесь с нами напрямую:\n📱 Telegram: @ivanchay0937\n📱 Max: через ссылку на сайте';
}

type Props = {
  isDark: boolean;
};

export default function ChatBot({ isDark }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'bot', text: 'Привет! 👋 Я AI-ассистент ProtoLab 3D. Задайте мне вопрос о 3D-печати, материалах, ценах или наших услугах!' },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
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

  const handleSend = () => {
    const text = input.trim();
    if (!text) return;

    const userMessage: Message = { role: 'user', text };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Имитация задержки "печатания"
    setTimeout(() => {
      const answer = findAnswer(text);
      setMessages(prev => [...prev, { role: 'bot', text: answer }]);
      setIsTyping(false);
    }, 500 + Math.random() * 800);
  };

  const quickQuestions = [
    'Какие материалы есть?',
    'Сколько стоит печать?',
    'Какие сроки?',
    'Где вы находитесь?',
  ];

  return (
    <>
      {/* Кнопка открытия чата */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-[999] w-14 h-14 rounded-full bg-gradient-to-r from-cyan-500 to-purple-600 text-white shadow-lg shadow-cyan-500/30 flex items-center justify-center hover:scale-110 transition-transform duration-300 ${isOpen ? 'rotate-0' : ''}`}
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

      {/* Окно чата */}
      {isOpen && (
        <div className={`fixed bottom-24 right-6 z-[999] w-[calc(100vw-3rem)] sm:w-96 h-[500px] max-h-[70vh] rounded-2xl ${bgCard} border ${borderMain} shadow-2xl flex flex-col overflow-hidden`}>
          {/* Заголовок */}
          <div className="bg-gradient-to-r from-cyan-500 to-purple-600 p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <span className="text-xl">🤖</span>
            </div>
            <div>
              <h3 className="text-white font-['Orbitron'] text-sm font-bold">AI-ассистент</h3>
              <p className="text-white/70 text-xs">ProtoLab 3D • Онлайн</p>
            </div>
            <div className="ml-auto flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-white/70 text-xs">Online</span>
            </div>
          </div>

          {/* Сообщения */}
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

          {/* Быстрые вопросы */}
          {messages.length <= 2 && (
            <div className={`px-4 py-2 border-t ${borderMain} flex flex-wrap gap-1.5`}>
              {quickQuestions.map((q, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setInput(q);
                    setTimeout(() => {
                      setMessages(prev => [...prev, { role: 'user', text: q }]);
                      setIsTyping(true);
                      setTimeout(() => {
                        setMessages(prev => [...prev, { role: 'bot', text: findAnswer(q) }]);
                        setIsTyping(false);
                      }, 500 + Math.random() * 800);
                    }, 100);
                    setInput('');
                  }}
                  className={`text-xs px-3 py-1.5 rounded-full border ${borderMain} ${textMuted} hover:text-cyan-400 hover:border-cyan-500/50 transition-colors`}
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
