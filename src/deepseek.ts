// DeepSeek API интеграция

const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';

export interface DeepSeekMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

// Системный промпт с информацией о ProtoLab 3D
const SYSTEM_PROMPT = `Ты - AI-ассистент компании ProtoLab 3D, которая специализируется на 3D-печати в Люберцах.

О КОМПАНИИ:
- Адрес: г. Люберцы, проспект Гагарина, дом 21
- Telegram: @ivanchay0937
- Канал: @protolab_3d_pechat
- 6 принтеров: Bambu Lab P1S, Creality K1 Max, Flying Bear Ghost 4, Bambu Lab H2S, Bambu Lab A1 Combo, Z-Bolt S300 HT

ЦЕНЫ:
- PLA/PETG/ABS: от 8₽/грамм
- TPU: от 15₽/грамм
- Нейлон: от 25₽/грамм
- Карбон: от 30₽/грамм
- 3D-моделирование: 500₽/час
- 3D-сканирование: по запросу

СКИДКИ:
- От 10 штук: 5%
- От 20 штук: 10%
- От 50 штук: 15%

СРОКИ:
- Простые детали: 1-2 дня
- Средние проекты: 3-5 дней
- Сложные: 5-14 дней
- Срочные заказы: от нескольких часов (+50%)

МАТЕРИАЛЫ:
- PLA: биоразлагаемый, для прототипов и декора, до 60°C
- PETG: прочный, химостойкий, пищевой допуск, до 80°C
- ABS: термостойкий до 100°C, ударопрочный
- TPU: гибкий, эластичный, как резина
- Нейлон: инженерный, износостойкий, до 150°C
- Карбон: максимальная прочность, лёгкий

ТЕХНОЛОГИЯ:
- FDM (послойное наплавление)
- Точность: ±0.2 мм (стандарт), ±0.1 мм (высокая)
- Высота слоя: 0.12-0.3 мм
- Максимальный размер: 300×300×400 мм (Z-Bolt S300 HT)

УСЛУГИ:
- 3D-печать
- 3D-моделирование
- 3D-сканирование
- Постобработка (шлифовка, покраска)

ДОСТАВКА:
- По всей России (Почта, СДЭК, Boxberry)
- Самовывоз из Люберец

Отвечай дружелюбно, используй эмодзи. Если вопрос не связан с 3D-печатью или услугами компании, вежливо переведи разговор на тему 3D-печати.`;

export async function queryDeepSeek(
  apiKey: string,
  userMessage: string,
  conversationHistory: DeepSeekMessage[] = []
): Promise<string> {
  const messages: DeepSeekMessage[] = [
    { role: 'system', content: SYSTEM_PROMPT },
    ...conversationHistory,
    { role: 'user', content: userMessage }
  ];

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
        temperature: 0.7,
        max_tokens: 1000
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
