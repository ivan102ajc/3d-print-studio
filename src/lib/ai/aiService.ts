// AI сервис для интеграции с LLM API
// Поддерживает OpenAI-совместимые API (OpenAI, DeepSeek, и т.д.)

import { systemPrompt } from './systemPrompt';
import { studioInfo, materials, printers, technologies, pricingConfig, faq } from '../studio/studioKnowledge';
import { calculatePrintPrice, recommendMaterial, recommendPrinter, estimatePrintTime, formatPrice } from '../pricing/pricingEngine';

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface AIConfig {
  apiKey: string;
  baseUrl: string;
  model: string;
}

export interface ChatRequest {
  messages: ChatMessage[];
  temperature?: number;
  maxTokens?: number;
}

export interface ChatResponse {
  content: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

/**
 * Получает конфигурацию AI из environment variables
 */
export function getAIConfig(): AIConfig {
  const apiKey = import.meta.env.VITE_AI_API_KEY || '';
  const baseUrl = import.meta.env.VITE_AI_BASE_URL || 'https://api.deepseek.com/v1';
  const model = import.meta.env.VITE_AI_MODEL || 'deepseek-chat';

  return { apiKey, baseUrl, model };
}

/**
 * Формирует контекст из базы знаний
 */
function buildKnowledgeContext(): string {
  const materialsList = materials.map(m => 
    `- ${m.name} (${m.fullName}): ${m.pricePerGram}₽/г, прочность: ${m.properties.strength}, термостойкость: ${m.properties.heatResistance}°C`
  ).join('\n');

  const printersList = printers.map(p => 
    `- ${p.name}: объём ${p.buildVolume.x}×${p.buildVolume.y}×${p.buildVolume.z}мм, ${p.bestFor}`
  ).join('\n');

  const pricingInfo = `
Цены на материалы:
${Object.entries(pricingConfig.basePricePerGram).map(([mat, price]) => `- ${mat}: ${price}₽/г`).join('\n')}

Множители сложности:
- Простая: ×${pricingConfig.complexityMultipliers.low}
- Средняя: ×${pricingConfig.complexityMultipliers.medium}
- Высокая: ×${pricingConfig.complexityMultipliers.high}

Срочность: ×${pricingConfig.urgencyMultiplier}

Скидки за количество:
- 10-19 шт: 5%
- 20-49 шт: 10%
- 50+ шт: 15%

Дополнительные услуги:
- 3D-моделирование: ${pricingConfig.modeling.pricePerHour}₽/час
- 3D-сканирование: от ${pricingConfig.scanning.priceFrom}₽
- Шлифовка: ${pricingConfig.postProcessing.sanding}₽
- Грунтовка: ${pricingConfig.postProcessing.priming}₽
- Покраска: ${pricingConfig.postProcessing.painting}₽
- Ацетоновая баня (ABS): ${pricingConfig.postProcessing.acetoneSmoothing}₽
`;

  return `
ИНФОРМАЦИЯ О СТУДИИ:
Название: ${studioInfo.name}
Описание: ${studioInfo.description}
Адрес: ${studioInfo.address}
Город: ${studioInfo.city}
Режим работы: ${studioInfo.workHours}

КОНТАКТЫ:
Telegram: ${studioInfo.contacts.telegram}
Max: ${studioInfo.contacts.max}
Канал: ${studioInfo.contacts.channel}

УСЛУГИ:
${studioInfo.services.join(', ')}

МАТЕРИАЛЫ:
${materialsList}

ПРИНТЕРЫ:
${printersList}

ТЕХНОЛОГИИ:
${technologies.map(t => `- ${t.name} (${t.fullName}): ${t.description}`).join('\n')}

ЦЕНЫ И РАСЧЁТ:
${pricingInfo}

ЧАСТО ЗАДАВАЕМЫЕ ВОПРОСЫ:
${faq.map(f => `В: ${f.question}\nО: ${f.answer}`).join('\n\n')}
`;
}

/**
 * Отправляет запрос к AI API
 */
export async function sendChatRequest(config: AIConfig, request: ChatRequest): Promise<ChatResponse> {
  const { apiKey, baseUrl, model } = config;

  if (!apiKey) {
    throw new Error('AI API key is not configured. Please set VITE_AI_API_KEY environment variable.');
  }

  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: request.messages,
      temperature: request.temperature ?? 0.3,
      max_tokens: request.maxTokens ?? 500,
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: { message: 'Unknown error' } }));
    throw new Error(error.error?.message || `API request failed with status ${response.status}`);
  }

  const data = await response.json();

  return {
    content: data.choices[0]?.message?.content || '',
    usage: data.usage ? {
      promptTokens: data.usage.prompt_tokens,
      completionTokens: data.usage.completion_tokens,
      totalTokens: data.usage.total_tokens,
    } : undefined,
  };
}

/**
 * Обрабатывает чат с AI, добавляя контекст из базы знаний
 */
export async function processChatMessage(
  userMessage: string,
  conversationHistory: ChatMessage[] = []
): Promise<string> {
  const config = getAIConfig();
  
  // Проверяем, настроен ли AI
  if (!config.apiKey) {
    return 'AI-консультант временно недоступен. Пожалуйста, свяжитесь с нами напрямую через Telegram @ivanchay0937 или Max.';
  }

  // Формируем контекст из базы знаний
  const knowledgeContext = buildKnowledgeContext();

  // Создаём системное сообщение с контекстом
  const systemMessage: ChatMessage = {
    role: 'system',
    content: `${systemPrompt}\n\nБАЗА ЗНАНИЙ СТУДИИ:\n${knowledgeContext}`,
  };

  // Формируем полный список сообщений
  const messages: ChatMessage[] = [
    systemMessage,
    ...conversationHistory,
    { role: 'user', content: userMessage },
  ];

  try {
    const response = await sendChatRequest(config, {
      messages,
      temperature: 0.3,
      maxTokens: 500,
    });

    return response.content;
  } catch (error) {
    console.error('AI chat error:', error);
    
    // Обработка различных типов ошибок
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        return 'AI-консультант не настроен. Пожалуйста, свяжитесь с нами напрямую через Telegram @ivanchay0937.';
      }
      if (error.message.includes('rate limit')) {
        return 'Превышен лимит запросов. Пожалуйста, попробуйте через минуту или свяжитесь с нами напрямую.';
      }
      if (error.message.includes('timeout')) {
        return 'Превышено время ожидания ответа. Пожалуйста, попробуйте ещё раз или свяжитесь с нами напрямую.';
      }
    }

    return 'Произошла ошибка при обработке запроса. Пожалуйста, попробуйте ещё раз или свяжитесь с нами напрямую через Telegram @ivanchay0937.';
  }
}

/**
 * Быстрая функция для расчёта стоимости (может использоваться AI через function calling)
 */
export function quickPriceEstimate(params: {
  material: string;
  weight: number;
  complexity: 'low' | 'medium' | 'high';
  quantity: number;
  urgent: boolean;
}): string {
  try {
    const materialObj = materials.find(m => m.name.toLowerCase() === params.material.toLowerCase());
    if (!materialObj) {
      return `Материал "${params.material}" не найден в базе знаний.`;
    }

    const result = calculatePrintPrice({
      materialId: materialObj.id,
      weightGrams: params.weight,
      complexity: params.complexity,
      quantity: params.quantity,
      urgent: params.urgent,
    });

    const timeEstimate = estimatePrintTime(params.weight, materialObj.id);

    return `Ориентировочная стоимость: ${formatPrice(result.breakdown.total)}\n` +
           `Время печати: ${timeEstimate}\n\n` +
           `Детали расчёта:\n${result.notes.join('\n')}\n\n` +
           `Это предварительная оценка. Точную стоимость рассчитаю после получения 3D-модели.`;
  } catch (error) {
    return 'Не удалось рассчитать стоимость. Пожалуйста, уточните параметры.';
  }
}

/**
 * Быстрая функция для рекомендации материала
 */
export function quickMaterialRecommendation(task: string): string {
  // Простой анализ задачи
  const requiresStrength = /прочн|нагрузк|механическ/i.test(task);
  const requiresFlexibility = /гибк|эластич|резинов/i.test(task);
  const requiresHeatResistance = /температур|горяч|нагрев|термостойк/i.test(task);
  const requiresUVResistance = /улиц|солнц|UV|ультрафиолет/i.test(task);
  const requiresFoodSafe = /пищев|контакт с ед|продукт/i.test(task);
  const budgetPriority = /дешев|бюджет|эконом/i.test(task) ? 'low' as const : 
                         /качеств|премиум|надёжн/i.test(task) ? 'high' as const : 'medium' as const;

  const recommendedIds = recommendMaterial({
    requiresStrength,
    requiresFlexibility,
    requiresHeatResistance,
    requiresUVResistance,
    requiresFoodSafe,
    budgetPriority,
  });

  if (recommendedIds.length === 0) {
    return 'Для этой задачи подойдёт PLA или PETG. Уточните, пожалуйста, условия эксплуатации детали?';
  }

  const recommendedMaterials = recommendedIds
    .map(id => materials.find(m => m.id === id))
    .filter((m): m is NonNullable<typeof m> => m !== undefined);

  let response = `Для вашей задачи рекомендую:\n\n`;
  
  recommendedMaterials.forEach((mat, idx) => {
    response += `${idx + 1}. ${mat.name} (${mat.pricePerGram}₽/г)\n`;
    response += `   ${mat.pros.slice(0, 2).join(', ')}\n`;
  });

  response += `\nПодробнее расскажу о любом из материалов. Какой интересует?`;

  return response;
}

/**
 * Быстрая функция для рекомендации принтера
 */
export function quickPrinterRecommendation(params: {
  maxDimension?: { x: number; y: number; z: number };
  material: string;
  requiresHighQuality?: boolean;
  quantity?: number;
}): string {
  const materialObj = materials.find(m => m.name.toLowerCase() === params.material.toLowerCase());
  if (!materialObj) {
    return 'Материал не найден. Уточните, пожалуйста, название материала.';
  }

  const recommendedIds = recommendPrinter({
    ...params,
    materialId: materialObj.id,
  });

  const recommendedPrinters = recommendedIds
    .map(id => printers.find(p => p.id === id))
    .filter((p): p is NonNullable<typeof p> => p !== undefined);

  let response = `Для этой задачи рекомендую:\n\n`;
  
  recommendedPrinters.forEach((printer, idx) => {
    response += `${idx + 1}. ${printer.name}\n`;
    response += `   Объём: ${printer.buildVolume.x}×${printer.buildVolume.y}×${printer.buildVolume.z}мм\n`;
    response += `   ${printer.bestFor}\n`;
  });

  response += `\nПодробнее о любом принтере?`;

  return response;
}
