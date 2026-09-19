# 🤖 AI-консультант для ProtoLab 3D

Полноценный AI-консультант для сайта студии 3D-печати с интеграцией DeepSeek API и базой знаний.

## ✨ Возможности

- 💬 Интеллектуальный чат-виджет
- 🎯 Рекомендации материалов на основе задачи
- 🖨️ Подбор принтера под параметры печати
- 💰 Расчёт примерной стоимости
- 📚 База знаний с данными студии
- 🎨 Интеграция с существующим дизайном
- 🌙 Поддержка тёмной/светлой темы
- 📱 Адаптивный дизайн

## 🚀 Быстрый старт

### 1. Установите зависимости

```bash
npm install
```

### 2. Настройте AI API

Создайте файл `.env` в корне проекта:

```bash
# DeepSeek API (рекомендуется)
VITE_AI_API_KEY=sk-your-api-key-here
VITE_AI_BASE_URL=https://api.deepseek.com/v1
VITE_AI_MODEL=deepseek-chat
```

**Получить API ключ DeepSeek:**
1. Зарегистрируйтесь на https://platform.deepseek.com
2. Перейдите в раздел API Keys
3. Создайте новый ключ
4. Скопируйте его в `.env`

**Альтернативные AI провайдеры:**

```bash
# OpenAI
VITE_AI_API_KEY=sk-your-openai-key
VITE_AI_BASE_URL=https://api.openai.com/v1
VITE_AI_MODEL=gpt-4o-mini

# Другие OpenAI-совместимые API
VITE_AI_API_KEY=your-api-key
VITE_AI_BASE_URL=https://your-api-endpoint.com/v1
VITE_AI_MODEL=your-model-name
```

### 3. Запустите проект

```bash
npm run dev
```

Откройте http://localhost:3000

## 📁 Структура проекта

```
src/
├── lib/
│   ├── studio/
│   │   └── studioKnowledge.ts    # База знаний студии
│   ├── pricing/
│   │   └── pricingEngine.ts      # Система расчёта цены
│   └── ai/
│       ├── systemPrompt.ts       # Системный промпт
│       └── aiService.ts          # AI сервис
├── components/
│   └── ai-chat/
│       └── ChatWidget.tsx        # Чат-виджет
└── App.tsx                        # Главный компонент
```

## 🎨 Редактирование данных студии

### Материалы и цены

Откройте `src/lib/studio/studioKnowledge.ts` и измените массив `materials`:

```typescript
{
  id: 'pla',
  name: 'PLA',
  fullName: 'Полилактид (PLA)',
  pricePerGram: 8,  // ← Измените цену
  // ... остальные поля
}
```

### Принтеры

В том же файле измените массив `printers`:

```typescript
{
  id: 'bambu-p1s',
  name: 'Bambu Lab P1S',
  buildVolume: { x: 256, y: 256, z: 256, unit: 'mm' },
  // ... остальные поля
}
```

### Формула расчёта цены

Откройте `src/lib/pricing/pricingEngine.ts`:

```typescript
export const pricingConfig = {
  basePricePerGram: {
    PLA: 8,      // ← Измените базовые цены
    PETG: 8,
    // ...
  },
  complexityMultipliers: {
    low: 1.0,    // ← Множители сложности
    medium: 1.5,
    high: 2.0,
  },
  // ... остальные настройки
};
```

### FAQ

В `studioKnowledge.ts` измените массив `faq`:

```typescript
{
  category: 'Общие вопросы',
  question: 'Ваш вопрос?',
  answer: 'Ваш ответ',
}
```

### Контакты студии

В `studioKnowledge.ts` измените объект `studioInfo`:

```typescript
export const studioInfo = {
  name: 'ProtoLab 3D',
  address: 'г. Люберцы, проспект Гагарина, дом 21',
  contacts: {
    telegram: '@ivanchay0937',
    // ... остальные контакты
  },
  // ...
};
```

## 🔧 Настройка AI

### Системный промпт

Откройте `src/lib/ai/systemPrompt.ts` и измените промпт под ваши нужды.

### AI сервис

В `src/lib/ai/aiService.ts` можно настроить:
- Температуру генерации
- Максимальное количество токенов
- Логику обработки ошибок

## 🎯 Примеры использования

### Расчёт стоимости

Пользователь: "Сколько будет стоить напечатать деталь весом 100г из PLA?"

AI ответит с разбивкой по компонентам и предложит уточнить детали.

### Выбор материала

Пользователь: "Нужна деталь для автомобиля, которая будет на солнце"

AI порекомендует ABS или PETG с объяснением почему.

### Выбор принтера

Пользователь: "Нужно напечатать большую деталь 300×300×300мм"

AI порекомендует Creality K1 Max или Z-Bolt S300 HT.

## 🔒 Безопасность

⚠️ **ВАЖНО:** API ключ хранится в `.env` файле и попадает в клиентский бандл!

Для production рекомендуется:
1. Использовать serverless functions (Vercel, Netlify)
2. Создать backend API для проксирования запросов
3. Добавить rate limiting
4. Валидировать запросы на сервере

### Пример для Vercel

Создайте `api/chat.ts`:

```typescript
import { processChatMessage } from '../src/lib/ai/aiService';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message, history } = req.body;
  
  try {
    const response = await processChatMessage(message, history);
    res.status(200).json({ response });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
}
```

И обновите `aiService.ts` для использования серверного API.

## 📊 Аналитика

Для подключения аналитики добавьте события в `ChatWidget.tsx`:

```typescript
// Пример для Google Analytics
gtag('event', 'chat_open');
gtag('event', 'chat_message', { role: 'user' });
gtag('event', 'price_estimate');
```

## 🐛 Решение проблем

### AI не отвечает

1. Проверьте `.env` файл
2. Убедитесь, что API ключ валиден
3. Проверьте консоль браузера на ошибки
4. Проверьте лимиты API

### Неправильные расчёты

1. Проверьте `pricingConfig` в `pricingEngine.ts`
2. Убедитесь, что цены в `studioKnowledge.ts` актуальны
3. Проверьте формулу расчёта

### Ошибки сборки

```bash
# Очистите кэш
rm -rf node_modules/.vite
npm run dev
```

## 📝 TODO

- [ ] Добавить загрузку 3D-файлов
- [ ] Интеграция с CRM
- [ ] Сохранение истории диалогов
- [ ] Мультиязычность
- [ ] Голосовой ввод
- [ ] Интеграция с калькулятором на сайте

## 📄 Лицензия

Проект создан для ProtoLab 3D.

---

**Создано с ❤️ для ProtoLab 3D**
