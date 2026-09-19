import { useState, useRef, useEffect } from 'react';

type Message = {
  role: 'user' | 'bot';
  text: string;
  timestamp: number;
};

// Расширенная база знаний с экспертной информацией
const knowledgeBase = {
  materials: {
    pla: {
      name: 'PLA (Полилактид)',
      temp: '190-220°C',
      bedTemp: '50-60°C',
      strength: 'Низкая-Средняя',
      flexibility: 'Очень низкая',
      heatResistance: '60°C',
      price: 8,
      pros: ['Лёгко печатается', 'Отличная детализация', 'Биоразлагаемый', 'Нет запаха', 'Минимальная усадка', 'Яркие цвета'],
      cons: ['Хрупкий', 'Низкая термостойкость', 'Разлагается во влажной среде', 'Плохая химостойкость'],
      applications: ['Прототипы', 'Декоративные изделия', 'Фигурки', 'Сувениры', 'Визуальные модели', 'Архитектурные макеты'],
      bestFor: 'Декор, прототипы, визуальные модели',
      notFor: 'Функциональные детали, нагруженные узлы, детали для высоких температур',
    },
    petg: {
      name: 'PETG (Полиэтилентерефталат-гликоль)',
      temp: '220-250°C',
      bedTemp: '70-80°C',
      strength: 'Средняя-Высокая',
      flexibility: 'Низкая',
      heatResistance: '80°C',
      price: 8,
      pros: ['Прочный и ударостойкий', 'Химически стойкий', 'Влагостойкий', 'Пищевой допуск', 'Лёгко печатается', 'Минимальная усадка', 'Хорошая адгезия слоёв'],
      cons: ['Склонен к образованию "паутины"', 'Сложнее постобработка', 'Дороже PLA'],
      applications: ['Функциональные детали', 'Корпуса', 'Ёмкости для жидкостей', 'Пищевой контакт', 'Медицинские устройства', 'Автомобильные детали'],
      bestFor: 'Функциональные детали, корпуса, ёмкости',
      notFor: 'Высокотемпературные применения, очень нагруженные узлы',
    },
    abs: {
      name: 'ABS (Акрилонитрилбутадиенстирол)',
      temp: '230-260°C',
      bedTemp: '95-110°C',
      strength: 'Высокая',
      flexibility: 'Низкая',
      heatResistance: '100°C',
      price: 8,
      pros: ['Высокая прочность', 'Термостойкость до 100°C', 'Ударопрочный', 'Можно обрабатывать ацетоном', 'Хорошая постобработка', 'Долговечный'],
      cons: ['Усаживается при печати', 'Выделяет запах стирола', 'Нужна закрытая камера', 'Сложнее печатать', 'UV-деградация'],
      applications: ['Автомобильные детали', 'Корпуса электроники', 'Нагруженные узлы', 'Инструменты', 'Игрушки (LEGO)', 'Термостойкие детали'],
      bestFor: 'Автомобильные детали, корпуса электроники, нагруженные узлы',
      notFor: 'Открытая печать без вентиляции, детали с высокой точностью',
    },
    tpu: {
      name: 'TPU (Термопластичный полиуретан)',
      temp: '210-230°C',
      bedTemp: '40-60°C',
      strength: 'Средняя',
      flexibility: 'Очень высокая (95A)',
      heatResistance: '80°C',
      price: 15,
      pros: ['Гибкий и эластичный', 'Износостойкий', 'Масло- и бензостойкий', 'Поглощает вибрации', 'Ударопрочный', 'Химически стойкий'],
      cons: ['Сложно печатать на Bowden', 'Медленная печать', 'Дорогой', 'Сложно калибровать'],
      applications: ['Чехлы', 'Прокладки', 'Амортизаторы', 'Гибкие петли', 'Колёса', 'Уплотнители', 'Обувь', 'Медицинские изделия'],
      bestFor: 'Гибкие детали, амортизаторы, уплотнители',
      notFor: 'Жёсткие конструкции, высокоскоростная печать',
    },
    nylon: {
      name: 'Нейлон (PA12/PA6/PA66)',
      temp: '240-270°C',
      bedTemp: '70-100°C',
      strength: 'Очень высокая',
      flexibility: 'Средняя',
      heatResistance: '150°C',
      price: 25,
      pros: ['Высочайшая прочность', 'Износостойкость как у металла', 'Термостойкость до 150°C', 'Химическая стойкость', 'Лёгкий', 'Самосмазывающийся', 'Ударопрочный'],
      cons: ['Очень гигроскопичный (впитывает влагу)', 'Сложно печатать', 'Дорогой', 'Нужна сушка перед печатью', 'Сильная усадка'],
      applications: ['Шестерни', 'Втулки', 'Подшипники', 'Нагруженные детали', 'Промышленные компоненты', 'Аэрокосмические детали', 'Автомобильные узлы'],
      bestFor: 'Шестерни, втулки, нагруженные детали, промышленные применения',
      notFor: 'Декоративные изделия, простые прототипы, бюджетные проекты',
    },
    carbon: {
      name: 'Карбононаполненные композиты',
      temp: '250-280°C',
      bedTemp: '80-100°C',
      strength: 'Максимальная',
      flexibility: 'Очень низкая',
      heatResistance: '120°C',
      price: 30,
      pros: ['Максимальная жёсткость', 'Очень лёгкий (легче алюминия)', 'Прочность как у металла', 'Термостойкость', 'Красивый матовый вид', 'Минимальная усадка'],
      cons: ['Очень дорогой', 'Абразивный (изнашивает сопло)', 'Хрупкий при изгибе', 'Сложно печатать', 'Нужно сопло из закалённой стали'],
      applications: ['Дроны', 'Спортивные детали', 'Автомобильные компоненты', 'Аэрокосмические детали', 'Гоночные автомобили', 'Велосипедные компоненты', 'Профессиональный инструмент'],
      bestFor: 'Дроны, спортивные детали, нагруженные лёгкие конструкции',
      notFor: 'Бюджетные проекты, гибкие детали, декор',
    },
  },

  printers: {
    bambu_p1s: {
      name: 'Bambu Lab P1S',
      type: 'CoreXY',
      volume: '256×256×256 мм',
      speed: '500 мм/с (макс)',
      nozzle: '0.4 мм (стандарт)',
      temp: 'До 300°C',
      bed: 'До 100°C',
      pros: ['Очень быстрый', 'Автокалибровка', 'Закрытая камера', 'Отличное качество', 'Надёжный', 'Мультиматериал (AMS)'],
      cons: ['Средний объём', 'Дорогой', 'Проприетарная экосистема'],
      bestFor: 'Быстрая печать, качественная печать, мультиматериал',
      rating: 9,
    },
    creality_k1max: {
      name: 'Creality K1 Max',
      type: 'CoreXY',
      volume: '300×300×300 мм',
      speed: '600 мм/с (макс)',
      nozzle: '0.4 мм (стандарт)',
      temp: 'До 300°C',
      bed: 'До 100°C',
      pros: ['Огромный объём', 'Очень быстрый', 'Хорошее качество', 'AI-камера', 'Автокалибровка'],
      cons: ['Большой размер', 'Шумный', 'Сложнее обслуживание'],
      bestFor: 'Большие детали, быстрая печать, серийное производство',
      rating: 8.5,
    },
    flying_bear_ghost4: {
      name: 'Flying Bear Ghost 4',
      type: 'Cartesian',
      volume: '255×210×210 мм',
      speed: '100 мм/с (макс)',
      nozzle: '0.4 мм (стандарт)',
      temp: 'До 260°C',
      bed: 'До 100°C',
      pros: ['Закрытая камера', 'Стабильная печать', 'Надёжный', 'Проверен временем', 'Тихий'],
      cons: ['Медленный', 'Маленький объём', 'Устаревшая конструкция'],
      bestFor: 'Стабильная печать ABS, надёжная работа',
      rating: 7,
    },
    bambu_h2s: {
      name: 'Bambu Lab H2S',
      type: 'CoreXY',
      volume: '256×256×256 мм',
      speed: '500 мм/с (макс)',
      nozzle: '0.4 мм (стандарт)',
      temp: 'До 300°C',
      bed: 'До 100°C',
      pros: ['Премиум качество', 'Мультиматериал', 'Отличная детализация', 'Надёжный', 'Быстрый'],
      cons: ['Дорогой', 'Средний объём', 'Проприетарная экосистема'],
      bestFor: 'Премиум качество, мультиматериал, сложная печать',
      rating: 9.5,
    },
    bambu_a1_combo: {
      name: 'Bambu Lab A1 Combo',
      type: 'Bed Slinger',
      volume: '256×256×256 мм',
      speed: '500 мм/с (макс)',
      nozzle: '0.4 мм (стандарт)',
      temp: 'До 300°C',
      bed: 'До 100°C',
      pros: ['AMS система', 'Быстрая смена цвета', 'Хорошее качество', 'Быстрый', 'Автокалибровка'],
      cons: ['Открытая конструкция', 'Движущийся стол', 'Ограничения по высоте'],
      bestFor: 'Многоцветная печать, быстрая смена цветов',
      rating: 8.5,
    },
    zbolt_s300ht: {
      name: 'Z-Bolt S300 HT',
      type: 'Cartesian',
      volume: '300×300×400 мм',
      speed: '150 мм/с (макс)',
      nozzle: '0.4-0.8 мм',
      temp: 'До 500°C',
      bed: 'До 120°C',
      pros: ['Огромный объём', 'Высокотемпературный (до 500°C)', 'Печать инженерных пластиков', 'Большой стол'],
      cons: ['Медленный', 'Большой размер', 'Сложнее в настройке', 'Открытая конструкция'],
      bestFor: 'Высокотемпературные пластики, очень большие детали, инженерные материалы',
      rating: 8,
    },
  },

  processes: {
    preparation: {
      name: 'Подготовка к печати',
      steps: [
        '1. Получение 3D-модели (STL, OBJ, 3MF)',
        '2. Проверка модели на ошибки (Manifold, нормали)',
        '3. Ориентация модели на столе (минимум поддержек)',
        '4. Настройка параметров в слайсере (Cura, PrusaSlicer, Bambu Studio)',
        '5. Выбор материала и настройка температур',
        '6. Настройка заполнения (15-100% в зависимости от задачи)',
        '7. Генерация поддержек (если нужно)',
        '8. Экспорт G-code на принтер',
      ],
    },
    printing: {
      name: 'Процесс печати',
      steps: [
        '1. Калибровка стола (высота первого слоя критична!)',
        '2. Нагрев сопла и стола до рабочих температур',
        '3. Печать первого слоя (адгезия к столу)',
        '4. Послойное наплавление (0.12-0.3 мм на слой)',
        '5. Охлаждение каждого слоя вентилятором',
        '6. Контроль температуры в камере (для ABS/нейлона)',
        '7. Завершение печати и охлаждение детали',
      ],
    },
    postprocessing: {
      name: 'Постобработка',
      steps: [
        '1. Удаление поддержек (ручно или растворением)',
        '2. Шлифовка поверхности (наждачная бумага 200-2000 грит)',
        '3. Покраска (грунтовка + краска)',
        '4. Ацетоновая баня для ABS (глянцевая поверхность)',
        '5. Склейка деталей (циакрилат, эпоксидка)',
        '6. Установка металлических вставок (термоinsert)',
        '7. Полировка (для декоративных изделий)',
      ],
    },
  },

  recommendations: {
    prototype: {
      task: 'Прототип',
      materials: ['PLA', 'PETG'],
      printers: ['Bambu Lab P1S', 'Bambu Lab A1 Combo'],
      reason: 'PLA — быстро и недорого для визуальной проверки. PETG — если нужна прочность.',
    },
    functional: {
      task: 'Функциональная деталь',
      materials: ['PETG', 'ABS', 'Нейлон'],
      printers: ['Bambu Lab P1S', 'Creality K1 Max'],
      reason: 'PETG — баланс прочности и простоты. ABS — термостойкость. Нейлон — максимальная прочность.',
    },
    gear: {
      task: 'Шестерня',
      materials: ['Нейлон', 'Карбон', 'PETG'],
      printers: ['Bambu Lab H2S', 'Z-Bolt S300 HT'],
      reason: 'Нейлон — износостойкость как у металла. Карбон — жёсткость. PETG — бюджетный вариант.',
    },
    enclosure: {
      task: 'Корпус электроники',
      materials: ['PETG', 'ABS'],
      printers: ['Bambu Lab P1S', 'Creality K1 Max'],
      reason: 'PETG — химостойкость, простота. ABS — термостойкость для нагревающихся компонентов.',
    },
    decorative: {
      task: 'Декоративное изделие',
      materials: ['PLA'],
      printers: ['Bambu Lab A1 Combo', 'Bambu Lab H2S'],
      reason: 'PLA — отличная детализация, яркие цвета. A1 Combo — многоцветная печать.',
    },
    flexible: {
      task: 'Гибкая деталь',
      materials: ['TPU'],
      printers: ['Bambu Lab P1S', 'Flying Bear Ghost 4'],
      reason: 'TPU — единственный гибкий материал. P1S — прямой экструдер для TPU.',
    },
    high_temp: {
      task: 'Высокотемпературная деталь',
      materials: ['ABS', 'Нейлон'],
      printers: ['Z-Bolt S300 HT', 'Flying Bear Ghost 4'],
      reason: 'ABS — до 100°C. Нейлон — до 150°C. Z-Bolt — закрытая камера до 500°C.',
    },
    large: {
      task: 'Большая деталь',
      materials: ['PLA', 'PETG', 'ABS'],
      printers: ['Creality K1 Max', 'Z-Bolt S300 HT'],
      reason: 'K1 Max — 300×300×300 мм. Z-Bolt — 300×300×400 мм (самый большой).',
    },
    multicolor: {
      task: 'Многоцветная печать',
      materials: ['PLA', 'PETG'],
      printers: ['Bambu Lab A1 Combo', 'Bambu Lab H2S'],
      reason: 'AMS система — автоматическая смена до 4-16 цветов.',
    },
  },
};

// Умная функция анализа вопроса
function analyzeQuestion(input: string): { intent: string; context: string[] } {
  const normalized = input.toLowerCase().trim();
  const intents: string[] = [];
  const context: string[] = [];

  // Определение намерений
  if (normalized.match(/привет|здравствуй|хай|hello|hi|ку|здарова/)) intents.push('greeting');
  if (normalized.match(/как дела|как ты|как поживаешь|что нового/)) intents.push('how_are_you');
  if (normalized.match(/кто ты|что ты|ты кто|ассистент|бот|робот/)) intents.push('who_are_you');
  if (normalized.match(/что умеешь|что можешь|чем помочь|помощь/)) intents.push('capabilities');
  
  if (normalized.match(/материал|пластик|филамент|pla|petg|abs|tpu|нейлон|карбон/)) {
    intents.push('materials');
    if (normalized.match(/лучш|подходит|выбрать|какой/)) context.push('recommendation');
    if (normalized.match(/свойств|характеристик|описание/)) context.push('properties');
    if (normalized.match(/сравн|отличи|разниц/)) context.push('comparison');
  }
  
  if (normalized.match(/принтер|оборудовани|bambu|creality|z-bolt|flying bear/)) {
    intents.push('printers');
    if (normalized.match(/лучш|какой|выбрать|рекоменд/)) context.push('recommendation');
    if (normalized.match(/сравн|отличи|разниц/)) context.push('comparison');
  }
  
  if (normalized.match(/цена|стоимость|сколько|прайс|рубл|денег|дорого|дёшево/)) intents.push('pricing');
  if (normalized.match(/скидк|оптом|большой заказ/)) intents.push('discounts');
  
  if (normalized.match(/процесс|как печат|технолог|fdm|способ|метод/)) intents.push('process');
  if (normalized.match(/подготовк|слайсер|g-code|настройк/)) intents.push('preparation');
  if (normalized.match(/постобработк|шлифовк|покраск/)) intents.push('postprocessing');
  
  if (normalized.match(/прототип|макет|образец/)) context.push('prototype');
  if (normalized.match(/функциональн|детал|запчасть/)) context.push('functional');
  if (normalized.match(/шестерн|механизм/)) context.push('gear');
  if (normalized.match(/корпус|электроник/)) context.push('enclosure');
  if (normalized.match(/декор|фигурк|сувенир/)) context.push('decorative');
  if (normalized.match(/гибк|эластич|резинов/)) context.push('flexible');
  if (normalized.match(/температур|термостойк|горяч/)) context.push('high_temp');
  if (normalized.match(/большой|крупн|габарит/)) context.push('large');
  if (normalized.match(/цветн|многоцветн|разноцветн/)) context.push('multicolor');
  
  if (normalized.match(/срок|время|долго|быстро|когда готов/)) intents.push('timing');
  if (normalized.match(/срочн|быстр|горит/)) intents.push('urgent');
  if (normalized.match(/адрес|где|люберцы|гагарина/)) intents.push('address');
  if (normalized.match(/доставк|отправк|почта|россия/)) intents.push('delivery');
  if (normalized.match(/оплат|перевод|наличн/)) intents.push('payment');
  if (normalized.match(/связ|контакт|telegram|телеграм|макс/)) intents.push('contacts');
  if (normalized.match(/makerworld|каталог|готовая модель/)) intents.push('makerworld');
  if (normalized.match(/makerlab|из фото|нейросет/)) intents.push('makerlab');
  
  if (normalized.match(/спасибо|благодар|круто|отлично/)) intents.push('thanks');
  if (normalized.match(/пока|до свидания|прощай/)) intents.push('goodbye');

  return { intent: intents[0] || 'unknown', context };
}

// Генерация ответа на основе анализа
function generateResponse(input: string): string {
  const { intent, context } = analyzeQuestion(input);
  const normalized = input.toLowerCase().trim();

  // Приветствия
  if (intent === 'greeting') {
    return 'Привет! 👋 Я AI-ассистент ProtoLab 3D с экспертными знаниями о 3D-печати. Могу рассказать о материалах, принтерах, процессах и дать рекомендации под вашу задачу. Что интересует?';
  }

  if (intent === 'how_are_you') {
    return 'Отлично! 🚀 Работаю 24/7, помогаю с 3D-печатью. Готов ответить на любые технические вопросы. Чем могу помочь?';
  }

  if (intent === 'who_are_you') {
    return 'Я AI-ассистент ProtoLab 3D 🤖 Эксперт по 3D-печати с глубокими знаниями о материалах (PLA, PETG, ABS, TPU, нейлон, карбон), принтерах (Bambu Lab, Creality, Z-Bolt) и процессах. Могу дать рекомендации под конкретную задачу!';
  }

  if (intent === 'capabilities') {
    return 'Я эксперт по 3D-печати! 🎯\n\nМогу:\n• Рекомендовать материал под задачу\n• Сравнить материалы и принтеры\n• Объяснить процессы печати\n• Рассказать о свойствах пластиков\n• Помочь выбрать принтер\n• Дать советы по постобработке\n\nПросто опишите задачу — я подберу оптимальное решение!';
  }

  // Материалы
  if (intent === 'materials') {
    // Конкретный материал
    if (normalized.match(/pla|полилактид/)) {
      const mat = knowledgeBase.materials.pla;
      return `${mat.name}\n\n🌡 Температура печати: ${mat.temp}\n🔥 Стол: ${mat.bedTemp}\n💪 Прочность: ${mat.strength}\n🌡 Термостойкость: ${mat.heatResistance}\n💰 Цена: ${mat.price}₽/г\n\n✅ Плюсы:\n${mat.pros.map(p => '• ' + p).join('\n')}\n\n❌ Минусы:\n${mat.cons.map(c => '• ' + c).join('\n')}\n\n🎯 Применение:\n${mat.applications.map(a => '• ' + a).join('\n')}\n\n💡 ${mat.bestFor}\n⚠️ Не подходит: ${mat.notFor}`;
    }

    if (normalized.match(/petg|петг/)) {
      const mat = knowledgeBase.materials.petg;
      return `${mat.name}\n\n🌡 Температура печати: ${mat.temp}\n🔥 Стол: ${mat.bedTemp}\n💪 Прочность: ${mat.strength}\n🌡 Термостойкость: ${mat.heatResistance}\n💰 Цена: ${mat.price}₽/г\n\n✅ Плюсы:\n${mat.pros.map(p => '• ' + p).join('\n')}\n\n❌ Минусы:\n${mat.cons.map(c => '• ' + c).join('\n')}\n\n🎯 Применение:\n${mat.applications.map(a => '• ' + a).join('\n')}\n\n💡 ${mat.bestFor}\n⚠️ Не подходит: ${mat.notFor}`;
    }

    if (normalized.match(/abs|абс/)) {
      const mat = knowledgeBase.materials.abs;
      return `${mat.name}\n\n🌡 Температура печати: ${mat.temp}\n🔥 Стол: ${mat.bedTemp}\n💪 Прочность: ${mat.strength}\n🌡 Термостойкость: ${mat.heatResistance}\n💰 Цена: ${mat.price}₽/г\n\n✅ Плюсы:\n${mat.pros.map(p => '• ' + p).join('\n')}\n\n❌ Минусы:\n${mat.cons.map(c => '• ' + c).join('\n')}\n\n🎯 Применение:\n${mat.applications.map(a => '• ' + a).join('\n')}\n\n💡 ${mat.bestFor}\n⚠️ Не подходит: ${mat.notFor}`;
    }

    if (normalized.match(/tpu|тпу|гибк/)) {
      const mat = knowledgeBase.materials.tpu;
      return `${mat.name}\n\n🌡 Температура печати: ${mat.temp}\n🔥 Стол: ${mat.bedTemp}\n💪 Прочность: ${mat.strength}\n🌡 Термостойкость: ${mat.heatResistance}\n💰 Цена: ${mat.price}₽/г\n\n✅ Плюсы:\n${mat.pros.map(p => '• ' + p).join('\n')}\n\n❌ Минусы:\n${mat.cons.map(c => '• ' + c).join('\n')}\n\n🎯 Применение:\n${mat.applications.map(a => '• ' + a).join('\n')}\n\n💡 ${mat.bestFor}\n⚠️ Не подходит: ${mat.notFor}`;
    }

    if (normalized.match(/нейлон|pa12|pa6|полиамид/)) {
      const mat = knowledgeBase.materials.nylon;
      return `${mat.name}\n\n🌡 Температура печати: ${mat.temp}\n🔥 Стол: ${mat.bedTemp}\n💪 Прочность: ${mat.strength}\n🌡 Термостойкость: ${mat.heatResistance}\n💰 Цена: ${mat.price}₽/г\n\n✅ Плюсы:\n${mat.pros.map(p => '• ' + p).join('\n')}\n\n❌ Минусы:\n${mat.cons.map(c => '• ' + c).join('\n')}\n\n🎯 Применение:\n${mat.applications.map(a => '• ' + a).join('\n')}\n\n💡 ${mat.bestFor}\n⚠️ Не подходит: ${mat.notFor}`;
    }

    if (normalized.match(/карбон|углепластик/)) {
      const mat = knowledgeBase.materials.carbon;
      return `${mat.name}\n\n🌡 Температура печати: ${mat.temp}\n🔥 Стол: ${mat.bedTemp}\n💪 Прочность: ${mat.strength}\n🌡 Термостойкость: ${mat.heatResistance}\n💰 Цена: ${mat.price}₽/г\n\n✅ Плюсы:\n${mat.pros.map(p => '• ' + p).join('\n')}\n\n❌ Минусы:\n${mat.cons.map(c => '• ' + c).join('\n')}\n\n🎯 Применение:\n${mat.applications.map(a => '• ' + a).join('\n')}\n\n💡 ${mat.bestFor}\n⚠️ Не подходит: ${mat.notFor}`;
    }

    // Все материалы
    return 'Работаем с 6+ материалами! 🧪\n\n🔵 PLA (8₽/г) — декор, прототипы\n🟣 PETG (8₽/г) — функциональные детали\n🔴 ABS (8₽/г) — термостойкость\n🟡 TPU (15₽/г) — гибкие детали\n🟢 Нейлон (25₽/г) — инженерные\n🟠 Карбон (30₽/г) — максимальная прочность\n\nСпросите о конкретном материале — расскажу подробно!';
  }

  // Принтеры
  if (intent === 'printers') {
    if (normalized.match(/bambu.*p1s|p1s/)) {
      const p = knowledgeBase.printers.bambu_p1s;
      return `${p.name}\n\n📐 Объём: ${p.volume}\n⚡ Скорость: ${p.speed}\n🌡 Сопло: до ${p.temp}\n🔥 Стол: до ${p.bed}\n⭐ Рейтинг: ${p.rating}/10\n\n✅ Плюсы:\n${p.pros.map(pr => '• ' + pr).join('\n')}\n\n❌ Минусы:\n${p.cons.map(c => '• ' + c).join('\n')}\n\n💡 ${p.bestFor}`;
    }

    if (normalized.match(/creality|k1.*max/)) {
      const p = knowledgeBase.printers.creality_k1max;
      return `${p.name}\n\n📐 Объём: ${p.volume}\n⚡ Скорость: ${p.speed}\n🌡 Сопло: до ${p.temp}\n🔥 Стол: до ${p.bed}\n⭐ Рейтинг: ${p.rating}/10\n\n✅ Плюсы:\n${p.pros.map(pr => '• ' + pr).join('\n')}\n\n❌ Минусы:\n${p.cons.map(c => '• ' + c).join('\n')}\n\n💡 ${p.bestFor}`;
    }

    if (normalized.match(/z-bolt|zbolt/)) {
      const p = knowledgeBase.printers.zbolt_s300ht;
      return `${p.name}\n\n📐 Объём: ${p.volume}\n⚡ Скорость: ${p.speed}\n🌡 Сопло: до ${p.temp}\n🔥 Стол: до ${p.bed}\n⭐ Рейтинг: ${p.rating}/10\n\n✅ Плюсы:\n${p.pros.map(pr => '• ' + pr).join('\n')}\n\n❌ Минусы:\n${p.cons.map(c => '• ' + c).join('\n')}\n\n💡 ${p.bestFor}`;
    }

    // Все принтеры
    return 'У нас 6 принтеров! 🖨\n\n🏆 Bambu Lab H2S (9.5/10) — премиум качество\n🏆 Bambu Lab P1S (9/10) — быстрый и надёжный\n🏆 Creality K1 Max (8.5/10) — большой объём\n🏆 Bambu Lab A1 Combo (8.5/10) — мультиматериал\n🏆 Z-Bolt S300 HT (8/10) — высокотемпературный\n🏆 Flying Bear Ghost 4 (7/10) — стабильный\n\nСпросите о конкретном принтере — расскажу подробно!';
  }

  // Рекомендации под задачу
  if (context.includes('recommendation')) {
    let rec = null;
    if (context.includes('prototype')) rec = knowledgeBase.recommendations.prototype;
    else if (context.includes('functional')) rec = knowledgeBase.recommendations.functional;
    else if (context.includes('gear')) rec = knowledgeBase.recommendations.gear;
    else if (context.includes('enclosure')) rec = knowledgeBase.recommendations.enclosure;
    else if (context.includes('decorative')) rec = knowledgeBase.recommendations.decorative;
    else if (context.includes('flexible')) rec = knowledgeBase.recommendations.flexible;
    else if (context.includes('high_temp')) rec = knowledgeBase.recommendations.high_temp;
    else if (context.includes('large')) rec = knowledgeBase.recommendations.large;
    else if (context.includes('multicolor')) rec = knowledgeBase.recommendations.multicolor;

    if (rec) {
      return `🎯 Рекомендация для задачи "${rec.task}":\n\n📦 Материалы:\n${rec.materials.map(m => '• ' + m).join('\n')}\n\n🖨 Принтеры:\n${rec.printers.map(p => '• ' + p).join('\n')}\n\n💡 ${rec.reason}`;
    }
  }

  // Процессы
  if (intent === 'process' || intent === 'preparation' || intent === 'postprocessing') {
    if (intent === 'preparation') {
      const proc = knowledgeBase.processes.preparation;
      return `${proc.name}:\n\n${proc.steps.join('\n')}`;
    }
    if (intent === 'postprocessing') {
      const proc = knowledgeBase.processes.postprocessing;
      return `${proc.name}:\n\n${proc.steps.join('\n')}`;
    }
    return 'Процесс 3D-печати включает:\n\n📋 Подготовка (слайсинг, настройки)\n🖨 Печать (послойное наплавление)\n🔧 Постобработка (шлифовка, покраска)\n\nСпросите о конкретном этапе — расскажу подробно!';
  }

  // Цены
  if (intent === 'pricing') {
    return '💰 Наши цены:\n\n📦 3D-печать:\n• PLA/PETG/ABS — от 8₽/грамм\n• TPU — от 15₽/грамм\n• Нейлон — от 25₽/грамм\n• Карбон — от 30₽/грамм\n\n🎨 3D-моделирование — 500₽/час\n📡 3D-сканирование — по запросу\n\n🎁 Скидки: от 10 шт — 5%, от 20 шт — 10%, от 50 шт — 15%\n\n⚡ Срочные заказы — +50%';
  }

  // Контакты
  if (intent === 'contacts') {
    return '📱 Свяжитесь с нами:\n\n💬 Telegram: @ivanchay0937\n📱 Max: через кнопку на сайте\n📢 Канал: @protolab_3d_pechat\n\n📍 Адрес: г. Люберцы, пр. Гагарина, 21\n\n⏱ Отвечаем быстро — в течение часа!';
  }

  if (intent === 'address') {
    return '📍 Наш адрес:\n\n🏠 г. Люберцы\n🛣 проспект Гагарина, дом 21\n\n🗺 Координаты: 55.691567, 37.911851\n\nМожете приехать для обсуждения заказа или забрать готовую работу!';
  }

  // Fallback
  return 'Я эксперт по 3D-печати! 🤖 Могу рассказать о:\n\n• Материалах (PLA, PETG, ABS, TPU, нейлон, карбон)\n• Принтерах (Bambu Lab, Creality, Z-Bolt)\n• Процессах печати\n• Рекомендациях под задачу\n• Ценах и сроках\n\nОпишите вашу задачу — подберу оптимальное решение! 💡';
}

type Props = {
  isDark: boolean;
};

export default function ChatBot({ isDark }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: 'bot', 
      text: 'Привет! 👋 Я AI-ассистент ProtoLab 3D — эксперт по 3D-печати. Могу рассказать о материалах, принтерах, процессах и дать рекомендации под вашу задачу!\n\nПримеры вопросов:\n• "Какой материал лучше для шестерни?"\n• "Расскажи про PLA"\n• "Какой принтер лучше для больших деталей?"\n• "Сколько стоит печать?"',
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

  const handleSend = () => {
    const text = input.trim();
    if (!text) return;

    const userMessage: Message = { role: 'user', text, timestamp: Date.now() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const answer = generateResponse(text);
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
                      setMessages(prev => [...prev, { role: 'bot', text: generateResponse(q), timestamp: Date.now() }]);
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
