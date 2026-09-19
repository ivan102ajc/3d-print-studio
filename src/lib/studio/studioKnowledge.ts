// База знаний студии ProtoLab 3D
// Все данные о студии, материалах, принтерах, ценах

export interface StudioInfo {
  name: string;
  description: string;
  address: string;
  city: string;
  coordinates: { lat: number; lng: number };
  contacts: {
    telegram: string;
    telegramUrl: string;
    max: string;
    maxUrl: string;
    channel: string;
    channelUrl: string;
  };
  workHours: string;
  services: string[];
}

export interface Printer {
  id: string;
  name: string;
  technology: 'FDM';
  buildVolume: { x: number; y: number; z: number; unit: 'mm' };
  maxSpeed: number;
  maxNozzleTemp: number;
  maxBedTemp: number;
  features: string[];
  strengths: string[];
  limitations: string[];
  typicalTasks: string[];
  bestFor: string;
  priceCategory: 'economy' | 'standard' | 'premium';
}

export interface Material {
  id: string;
  name: string;
  fullName: string;
  technology: 'FDM';
  pricePerGram: number;
  currency: string;
  properties: {
    strength: 'low' | 'medium' | 'high' | 'very-high';
    flexibility: 'none' | 'low' | 'medium' | 'high';
    heatResistance: number;
    impactResistance: 'low' | 'medium' | 'high';
    uvResistance: boolean;
    moistureResistance: boolean;
    chemicalResistance: boolean;
    foodSafe: boolean;
  };
  pros: string[];
  cons: string[];
  applications: string[];
  compatiblePrinters: string[];
  printTemp: { nozzle: string; bed: string };
  density: number;
}

export interface Technology {
  id: string;
  name: string;
  fullName: string;
  description: string;
  available: boolean;
  materials: string[];
  typicalTolerance: number;
  layerHeight: { min: number; max: number; standard: number };
}

export interface PricingConfig {
  basePricePerGram: Record<string, number>;
  complexityMultipliers: {
    low: number;
    medium: number;
    high: number;
  };
  urgencyMultiplier: number;
  quantityDiscounts: {
    min10: number;
    min20: number;
    min50: number;
  };
  postProcessing: {
    sanding: number;
    priming: number;
    painting: number;
    acetoneSmoothing: number;
  };
  modeling: {
    pricePerHour: number;
  };
  scanning: {
    priceFrom: number;
  };
}

export interface FAQ {
  category: string;
  question: string;
  answer: string;
}

export const studioInfo: StudioInfo = {
  name: 'ProtoLab 3D',
  description: 'Профессиональная 3D-печать и моделирование в Люберцах. 6 принтеров, 6+ материалов, неограниченные возможности.',
  address: 'г. Люберцы, проспект Гагарина, дом 21',
  city: 'Люберцы',
  coordinates: { lat: 55.691567, lng: 37.911851 },
  contacts: {
    telegram: '@ivanchay0937',
    telegramUrl: 'https://t.me/ivanchay0937',
    max: 'Max',
    maxUrl: 'https://max.ru/u/f9LHodD0cOJ4WswKoZ0gfs_dwKKmUdugV1HqBTNmTiMI0AyDcJAen50E6G4',
    channel: '@protolab_3d_pechat',
    channelUrl: 'https://t.me/protolab_3d_pechat',
  },
  workHours: 'Пн-Вс: по договорённости, принтеры работают 24/7',
  services: [
    '3D-печать (FDM)',
    '3D-моделирование',
    '3D-сканирование',
    'Постобработка (шлифовка, покраска)',
    'Мелкосерийное производство',
  ],
};

export const printers: Printer[] = [
  {
    id: 'bambu-p1s',
    name: 'Bambu Lab P1S',
    technology: 'FDM',
    buildVolume: { x: 256, y: 256, z: 256, unit: 'mm' },
    maxSpeed: 500,
    maxNozzleTemp: 300,
    maxBedTemp: 100,
    features: ['Высокоскоростная печать', 'Автоматическая калибровка', 'Закрытая камера'],
    strengths: ['Скорость', 'Качество', 'Надёжность'],
    limitations: ['Средний объём печати'],
    typicalTasks: ['Быстрая печать', 'Качественные детали', 'Серийное производство'],
    bestFor: 'Быстрая печать качественных деталей среднего размера',
    priceCategory: 'premium',
  },
  {
    id: 'creality-k1-max',
    name: 'Creality K1 Max',
    technology: 'FDM',
    buildVolume: { x: 300, y: 300, z: 300, unit: 'mm' },
    maxSpeed: 600,
    maxNozzleTemp: 300,
    maxBedTemp: 100,
    features: ['Большой объём печати', 'Высокая скорость', 'AI-камера'],
    strengths: ['Большой объём', 'Скорость'],
    limitations: ['Большой размер оборудования'],
    typicalTasks: ['Большие детали', 'Серийное производство', 'Быстрая печать'],
    bestFor: 'Печать больших деталей и серийное производство',
    priceCategory: 'premium',
  },
  {
    id: 'flying-bear-ghost4',
    name: 'Flying Bear Ghost 4',
    technology: 'FDM',
    buildVolume: { x: 255, y: 210, z: 210, unit: 'mm' },
    maxSpeed: 100,
    maxNozzleTemp: 260,
    maxBedTemp: 100,
    features: ['Закрытая камера', 'Стабильная печать'],
    strengths: ['Стабильность', 'Закрытая камера для ABS'],
    limitations: ['Медленный', 'Маленький объём'],
    typicalTasks: ['Печать ABS', 'Стабильная печать', 'Тихая работа'],
    bestFor: 'Стабильная печать ABS и других требовательных материалов',
    priceCategory: 'economy',
  },
  {
    id: 'bambu-h2s',
    name: 'Bambu Lab H2S',
    technology: 'FDM',
    buildVolume: { x: 256, y: 256, z: 256, unit: 'mm' },
    maxSpeed: 500,
    maxNozzleTemp: 300,
    maxBedTemp: 100,
    features: ['Премиум качество', 'Мультиматериал', 'Отличная детализация'],
    strengths: ['Качество', 'Мультиматериал', 'Надёжность'],
    limitations: ['Средний объём', 'Высокая стоимость'],
    typicalTasks: ['Премиум печать', 'Мультиматериал', 'Сложные детали'],
    bestFor: 'Премиум качество и печать несколькими материалами',
    priceCategory: 'premium',
  },
  {
    id: 'bambu-a1-combo',
    name: 'Bambu Lab A1 Combo',
    technology: 'FDM',
    buildVolume: { x: 256, y: 256, z: 256, unit: 'mm' },
    maxSpeed: 500,
    maxNozzleTemp: 300,
    maxBedTemp: 100,
    features: ['AMS система', 'Быстрая смена цвета', 'Многоцветная печать'],
    strengths: ['Многоцветная печать', 'Быстрая смена цветов'],
    limitations: ['Открытая конструкция', 'Движущийся стол'],
    typicalTasks: ['Многоцветная печать', 'Быстрая смена цветов', 'Декоративные детали'],
    bestFor: 'Многоцветная печать и быстрая смена цветов',
    priceCategory: 'standard',
  },
  {
    id: 'z-bolt-s300-ht',
    name: 'Z-Bolt S300 HT',
    technology: 'FDM',
    buildVolume: { x: 300, y: 300, z: 400, unit: 'mm' },
    maxSpeed: 150,
    maxNozzleTemp: 500,
    maxBedTemp: 120,
    features: ['Высокотемпературная печать', 'Огромный объём', 'Инженерные пластики'],
    strengths: ['Высокотемпературная печать', 'Огромный объём', 'Специальные материалы'],
    limitations: ['Медленный', 'Большой размер'],
    typicalTasks: ['Высокотемпературные пластики', 'Очень большие детали', 'Инженерные материалы'],
    bestFor: 'Высокотемпературные пластики и очень большие детали',
    priceCategory: 'premium',
  },
];

export const materials: Material[] = [
  {
    id: 'pla',
    name: 'PLA',
    fullName: 'Полилактид (PLA)',
    technology: 'FDM',
    pricePerGram: 8,
    currency: 'RUB',
    properties: {
      strength: 'medium',
      flexibility: 'none',
      heatResistance: 60,
      impactResistance: 'low',
      uvResistance: false,
      moistureResistance: false,
      chemicalResistance: false,
      foodSafe: false,
    },
    pros: [
      'Лёгко печатается',
      'Отличная детализация',
      'Биоразлагаемый',
      'Нет запаха',
      'Минимальная усадка',
      'Яркие цвета',
    ],
    cons: [
      'Хрупкий',
      'Низкая термостойкость (60°C)',
      'Разлагается во влажной среде',
      'Плохая химостойкость',
    ],
    applications: [
      'Прототипы',
      'Декоративные изделия',
      'Фигурки',
      'Сувениры',
      'Визуальные модели',
      'Архитектурные макеты',
    ],
    compatiblePrinters: ['bambu-p1s', 'creality-k1-max', 'flying-bear-ghost4', 'bambu-h2s', 'bambu-a1-combo', 'z-bolt-s300-ht'],
    printTemp: { nozzle: '190-220°C', bed: '50-60°C' },
    density: 1.24,
  },
  {
    id: 'petg',
    name: 'PETG',
    fullName: 'Полиэтилентерефталат-гликоль (PETG)',
    technology: 'FDM',
    pricePerGram: 8,
    currency: 'RUB',
    properties: {
      strength: 'high',
      flexibility: 'low',
      heatResistance: 80,
      impactResistance: 'high',
      uvResistance: true,
      moistureResistance: true,
      chemicalResistance: true,
      foodSafe: true,
    },
    pros: [
      'Прочный и ударостойкий',
      'Химически стойкий',
      'Влагостойкий',
      'Пищевой допуск',
      'Лёгко печатается',
      'Минимальная усадка',
      'Хорошая адгезия слоёв',
    ],
    cons: [
      'Склонен к образованию "паутины"',
      'Сложнее постобработка',
    ],
    applications: [
      'Функциональные детали',
      'Корпуса',
      'Ёмкости для жидкостей',
      'Пищевой контакт',
      'Медицинские устройства',
      'Автомобильные детали',
    ],
    compatiblePrinters: ['bambu-p1s', 'creality-k1-max', 'flying-bear-ghost4', 'bambu-h2s', 'bambu-a1-combo', 'z-bolt-s300-ht'],
    printTemp: { nozzle: '220-250°C', bed: '70-80°C' },
    density: 1.27,
  },
  {
    id: 'abs',
    name: 'ABS',
    fullName: 'Акрилонитрилбутадиенстирол (ABS)',
    technology: 'FDM',
    pricePerGram: 8,
    currency: 'RUB',
    properties: {
      strength: 'high',
      flexibility: 'low',
      heatResistance: 100,
      impactResistance: 'high',
      uvResistance: true,
      moistureResistance: true,
      chemicalResistance: true,
      foodSafe: false,
    },
    pros: [
      'Высокая прочность',
      'Термостойкость до 100°C',
      'Ударопрочный',
      'Можно обрабатывать ацетоном',
      'Хорошая постобработка',
      'Долговечный',
    ],
    cons: [
      'Усаживается при печати',
      'Выделяет запах стирола',
      'Нужна закрытая камера',
      'Сложнее печатать',
      'UV-деградация',
    ],
    applications: [
      'Автомобильные детали',
      'Корпуса электроники',
      'Нагруженные узлы',
      'Инструменты',
      'Игрушки (LEGO)',
      'Термостойкие детали',
    ],
    compatiblePrinters: ['bambu-p1s', 'creality-k1-max', 'flying-bear-ghost4', 'bambu-h2s', 'bambu-a1-combo', 'z-bolt-s300-ht'],
    printTemp: { nozzle: '230-260°C', bed: '95-110°C' },
    density: 1.04,
  },
  {
    id: 'tpu',
    name: 'TPU',
    fullName: 'Термопластичный полиуретан (TPU)',
    technology: 'FDM',
    pricePerGram: 15,
    currency: 'RUB',
    properties: {
      strength: 'medium',
      flexibility: 'high',
      heatResistance: 80,
      impactResistance: 'high',
      uvResistance: false,
      moistureResistance: true,
      chemicalResistance: true,
      foodSafe: false,
    },
    pros: [
      'Гибкий и эластичный',
      'Износостойкий',
      'Масло- и бензостойкий',
      'Поглощает вибрации',
      'Ударопрочный',
      'Химически стойкий',
    ],
    cons: [
      'Сложно печатать на Bowden',
      'Медленная печать',
      'Дорогой',
      'Сложно калибровать',
    ],
    applications: [
      'Чехлы',
      'Прокладки',
      'Амортизаторы',
      'Гибкие петли',
      'Колёса',
      'Уплотнители',
      'Обувь',
      'Медицинские изделия',
    ],
    compatiblePrinters: ['bambu-p1s', 'bambu-h2s', 'bambu-a1-combo'],
    printTemp: { nozzle: '210-230°C', bed: '40-60°C' },
    density: 1.21,
  },
  {
    id: 'nylon',
    name: 'PA12/PA6/PA66',
    fullName: 'Нейлон (Полиамид)',
    technology: 'FDM',
    pricePerGram: 25,
    currency: 'RUB',
    properties: {
      strength: 'very-high',
      flexibility: 'medium',
      heatResistance: 150,
      impactResistance: 'high',
      uvResistance: true,
      moistureResistance: false,
      chemicalResistance: true,
      foodSafe: false,
    },
    pros: [
      'Высочайшая прочность',
      'Износостойкость (как у металла)',
      'Термостойкость до 150°C',
      'Химическая стойкость',
      'Лёгкий',
      'Самосмазывающийся',
      'Ударопрочный',
    ],
    cons: [
      'Очень гигроскопичный (впитывает влагу)',
      'Сложно печатать',
      'Дорогой',
      'Нужна сушка перед печатью',
      'Сильная усадка',
    ],
    applications: [
      'Шестерни',
      'Втулки',
      'Подшипники',
      'Нагруженные детали',
      'Промышленные компоненты',
      'Аэрокосмические детали',
      'Автомобильные узлы',
    ],
    compatiblePrinters: ['bambu-p1s', 'creality-k1-max', 'bambu-h2s', 'z-bolt-s300-ht'],
    printTemp: { nozzle: '240-270°C', bed: '70-100°C' },
    density: 1.14,
  },
  {
    id: 'carbon',
    name: 'Карбон',
    fullName: 'Карбононаполненный композит',
    technology: 'FDM',
    pricePerGram: 30,
    currency: 'RUB',
    properties: {
      strength: 'very-high',
      flexibility: 'none',
      heatResistance: 120,
      impactResistance: 'medium',
      uvResistance: true,
      moistureResistance: true,
      chemicalResistance: true,
      foodSafe: false,
    },
    pros: [
      'Максимальная жёсткость',
      'Очень лёгкий (легче алюминия)',
      'Прочность как у металла',
      'Термостойкость',
      'Красивый матовый вид',
      'Минимальная усадка',
    ],
    cons: [
      'Очень дорогой',
      'Абразивный (изнашивает сопло)',
      'Хрупкий при изгибе',
      'Сложно печатать',
      'Нужно сопло из закалённой стали',
    ],
    applications: [
      'Дроны',
      'Спортивные детали',
      'Автомобильные компоненты',
      'Аэрокосмические детали',
      'Гоночные автомобили',
      'Велосипедные компоненты',
      'Профессиональный инструмент',
    ],
    compatiblePrinters: ['bambu-p1s', 'creality-k1-max', 'bambu-h2s', 'z-bolt-s300-ht'],
    printTemp: { nozzle: '250-280°C', bed: '80-100°C' },
    density: 1.3,
  },
];

export const technologies: Technology[] = [
  {
    id: 'fdm',
    name: 'FDM',
    fullName: 'Fused Deposition Modeling (Моделирование методом послойного наплавления)',
    description: 'Послойное наплавление термопластика. Самая распространённая и доступная технология для прототипов, функциональных деталей и небольших серий.',
    available: true,
    materials: ['PLA', 'PETG', 'ABS', 'TPU', 'PA12/PA6/PA66', 'Карбон'],
    typicalTolerance: 0.2,
    layerHeight: { min: 0.12, max: 0.3, standard: 0.2 },
  },
];

export const pricingConfig: PricingConfig = {
  basePricePerGram: {
    PLA: 8,
    PETG: 8,
    ABS: 8,
    TPU: 15,
    'PA12/PA6/PA66': 25,
    Карбон: 30,
  },
  complexityMultipliers: {
    low: 1.0,
    medium: 1.5,
    high: 2.0,
  },
  urgencyMultiplier: 1.5,
  quantityDiscounts: {
    min10: 0.95, // 5% discount
    min20: 0.90, // 10% discount
    min50: 0.85, // 15% discount
  },
  postProcessing: {
    sanding: 200,
    priming: 300,
    painting: 500,
    acetoneSmoothing: 300,
  },
  modeling: {
    pricePerHour: 500,
  },
  scanning: {
    priceFrom: 2000,
  },
};

export const faq: FAQ[] = [
  {
    category: 'Общие вопросы',
    question: 'Какие технологии 3D-печати вы используете?',
    answer: 'Мы используем FDM (Fused Deposition Modeling) — послойное наплавление пластика. Это самая распространённая и доступная технология для прототипов, функциональных деталей и небольших серий.',
  },
  {
    category: 'Материалы',
    question: 'Какие материалы у вас есть?',
    answer: 'У нас 6 основных материалов: PLA (8₽/г), PETG (8₽/г), ABS (8₽/г), TPU (15₽/г), PA12/PA6/PA66 (25₽/г), Карбон (30₽/г). Каждый материал имеет свои особенности и области применения.',
  },
  {
    category: 'Цены',
    question: 'Сколько стоит 3D-печать?',
    answer: 'Стоимость зависит от материала, веса детали, сложности, количества и срочности. Базовые цены: PLA/PETG/ABS — 8₽/г, TPU — 15₽/г, нейлон — 25₽/г, карбон — 30₽/г. Точную стоимость рассчитаю после получения параметров.',
  },
  {
    category: 'Сроки',
    question: 'Сколько времени занимает печать?',
    answer: 'Сроки зависят от сложности: простые детали — 1-2 дня, средние проекты — 3-5 дней, сложные — 5-14 дней. Срочные заказы выполняем за +50% к стоимости.',
  },
  {
    category: 'Заказ',
    question: 'Как оформить заказ?',
    answer: 'Вы можете связаться с нами через Telegram @ivanchay0937 или Max. Обсудим задачу, подберём материал и принтер, рассчитаем стоимость. После согласования приступаем к печати.',
  },
  {
    category: 'Файлы',
    question: 'Какие форматы файлов вы принимаете?',
    answer: 'Мы принимаем STL, OBJ, 3MF, STEP. Если у вас нет 3D-модели, мы можем создать её по чертежам, эскизам или фотографиям (500₽/час).',
  },
  {
    category: 'Доставка',
    question: 'Вы доставляете заказы?',
    answer: 'Да, доставляем по всей России (Почта России, СДЭК, Boxberry). Также возможен самовывоз из Люберец (пр. Гагарина, 21).',
  },
  {
    category: 'Оплата',
    question: 'Какие способы оплаты?',
    answer: 'Принимаем оплату переводом на карту (Сбербанк, Тинькофф), через СБП, наличными при самовывозе. Предоплата 50% или 100%.',
  },
];
