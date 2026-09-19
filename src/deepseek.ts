// DeepSeek API интеграция с RAG-поиском

const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';

export interface DeepSeekMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface SearchResult {
  source: string;
  content: string;
  score: number;
}

// Системный промпт (встроенная версия system_prompt.md)
const SYSTEM_PROMPT = `Ты — AI-ассистент студии 3D-печати ProtoLab 3D в г. Люберцы.

РОЛЬ: Консультировать клиентов по 3D-печати, помогать выбирать материалы, рассчитывать стоимость, принимать заявки.

ЖЁСТКИЕ ПРАВИЛА:
- Отвечай ТОЛЬКО на основе предоставленного контекста из базы знаний.
- НЕ выдумывай цены, сроки, материалы, характеристики.
- Если данных нет — скажи: «Уточню у специалиста. Оставьте контакт — менеджер свяжется в течение часа».
- Не давай юридических/медицинских гарантий.
- Не обсуждай конкурентов и темы вне 3D-печати.

СТИЛЬ:
- Язык: русский.
- Обращение: «вы» (вежливое).
- Длина: 2–6 предложений.
- В конце — 1 уточняющий вопрос.
- Максимум 1–2 эмодзи.

ФОРМУЛЫ РАСЧЁТА:
цена = вес_г × цена_за_грамм + постобработка + срочность
вес = объём_см³ × плотность_г/см³ × коэффициент_заполнения

Плотности: PLA 1.24, PETG 1.27, ABS 1.04, TPU 1.21, Нейлон 1.14, Карбон 1.30 г/см³

Скидки: 10-19 шт -5%, 20-49 шт -10%, 50+ шт -15%
Срочность: +50%

ЦЕНЫ:
- PLA/PETG/ABS: 8₽/г
- TPU: 15₽/г
- Нейлон: 25₽/г
- Карбон: 30₽/г
- 3D-моделирование: 500₽/час

КОНТАКТЫ:
- Telegram: @ivanchay0937
- Max: через ссылку на сайте
- Адрес: г. Люберцы, пр. Гагарина, 21

SELF-CHECK перед ответом:
✓ Факты из базы?
✓ Нет выдумок?
✓ Есть вопрос в конце?
✓ Не более 6 предложений?
✓ Не более 2 эмодзи?`;

// Загрузка базы знаний
let knowledgeBaseCache: any = null;
let faqCache: any[] | null = null;

async function loadKnowledgeBase() {
  if (!knowledgeBaseCache) {
    const response = await fetch('/knowledge_base.json');
    knowledgeBaseCache = await response.json();
  }
  return knowledgeBaseCache;
}

async function loadFaq() {
  if (!faqCache) {
    const response = await fetch('/faq.json');
    faqCache = await response.json();
  }
  return faqCache;
}

// Простой keyword-поиск по базе знаний
function searchKnowledgeBase(query: string, data: any): SearchResult[] {
  const results: SearchResult[] = [];
  const normalizedQuery = query.toLowerCase();
  const words = normalizedQuery.split(/\s+/).filter(w => w.length > 2);

  // Поиск по материалам
  if (data.materials) {
    for (const material of data.materials) {
      let score = 0;
      const text = `${material.name} ${material.description || ''} ${material.applications?.join(' ') || ''}`.toLowerCase();
      
      for (const word of words) {
        if (text.includes(word)) score += 2;
        if (material.name.toLowerCase().includes(word)) score += 5;
      }
      
      if (score > 0) {
        results.push({
          source: `Материал: ${material.name}`,
          content: `${material.name}: ${material.price_per_gram}₽/г. ${material.pros?.join(', ') || ''}. Применение: ${material.applications?.join(', ') || ''}.`,
          score
        });
      }
    }
  }

  // Поиск по услугам
  if (data.services) {
    for (const service of data.services) {
      let score = 0;
      const text = `${service.name} ${service.description || ''}`.toLowerCase();
      
      for (const word of words) {
        if (text.includes(word)) score += 2;
        if (service.name.toLowerCase().includes(word)) score += 5;
      }
      
      if (score > 0) {
        results.push({
          source: `Услуга: ${service.name}`,
          content: `${service.name}: ${service.price} за ${service.unit}. Минимальный заказ: ${service.min_order}. Сроки: ${service.lead_time}.`,
          score
        });
      }
    }
  }

  // Поиск по постобработке
  if (data.postprocessing) {
    for (const proc of data.postprocessing) {
      let score = 0;
      const text = proc.name.toLowerCase();
      
      for (const word of words) {
        if (text.includes(word)) score += 3;
      }
      
      if (score > 0) {
        results.push({
          source: `Постобработка: ${proc.name}`,
          content: `${proc.name}: ${proc.price}. Сроки: ${proc.lead_time}.`,
          score
        });
      }
    }
  }

  return results.sort((a, b) => b.score - a.score).slice(0, 5);
}

// Поиск по FAQ
function searchFaq(query: string, faq: any[] | null): SearchResult[] {
  if (!faq) return [];
  
  const results: SearchResult[] = [];
  const normalizedQuery = query.toLowerCase();
  const words = normalizedQuery.split(/\s+/).filter(w => w.length > 2);

  for (const item of faq) {
    let score = 0;
    const questionLower = item.question.toLowerCase();
    
    // Точное совпадение вопроса
    if (questionLower.includes(normalizedQuery) || normalizedQuery.includes(questionLower)) {
      score += 20;
    }
    
    // Совпадение по ключевым словам
    for (const word of words) {
      if (questionLower.includes(word)) score += 2;
    }
    
    if (score > 0) {
      results.push({
        source: `FAQ: ${item.category}`,
        content: `Вопрос: ${item.question}\nОтвет: ${item.answer}`,
        score
      });
    }
  }

  return results.sort((a, b) => b.score - a.score).slice(0, 3);
}

// RAG-поиск: объединяет результаты из базы знаний и FAQ
async function ragSearch(query: string): Promise<string> {
  try {
    const [knowledgeBase, faq] = await Promise.all([
      loadKnowledgeBase(),
      loadFaq()
    ]);

    const kbResults = searchKnowledgeBase(query, knowledgeBase);
    const faqResults = searchFaq(query, faq);

    const allResults = [...kbResults, ...faqResults]
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);

    if (allResults.length === 0) {
      return '';
    }

    let context = 'Контекст из базы знаний:\n\n';
    for (const result of allResults) {
      context += `[${result.source}]\n${result.content}\n\n`;
    }

    return context;
  } catch (error) {
    console.error('RAG search error:', error);
    return '';
  }
}

// Основной запрос к DeepSeek с RAG
export async function queryDeepSeek(
  apiKey: string,
  userMessage: string,
  conversationHistory: DeepSeekMessage[] = []
): Promise<string> {
  // RAG-поиск релевантного контекста
  const ragContext = await ragSearch(userMessage);

  const messages: DeepSeekMessage[] = [
    { role: 'system', content: SYSTEM_PROMPT },
  ];

  // Добавляем RAG-контекст, если есть
  if (ragContext) {
    messages.push({
      role: 'system',
      content: `Используй следующий контекст из базы знаний для ответа:\n\n${ragContext}`
    });
  }

  // Добавляем историю разговора
  messages.push(...conversationHistory);
  
  // Добавляем текущее сообщение
  messages.push({ role: 'user', content: userMessage });

  try {
    const response = await fetch(DEEPSEEK_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: messages,
        temperature: 0.3,
        top_p: 0.9,
        max_tokens: 500
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || `HTTP ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || 'Не удалось получить ответ';
  } catch (error) {
    console.error('DeepSeek API error:', error);
    throw error;
  }
}

export function isValidApiKey(key: string): boolean {
  return key.startsWith('sk-') && key.length > 20;
}
