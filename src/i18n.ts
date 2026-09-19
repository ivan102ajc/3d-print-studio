export type Language = 'ru' | 'en' | 'zh';

export const translations = {
  ru: {
    // Navigation
    nav: {
      home: 'Главная',
      about: 'О нас',
      services: 'Услуги',
      equipment: 'Оборудование',
      materials: 'Материалы',
      calculator: 'Калькулятор',
      works: 'Работы',
      catalog: 'Каталог',
      contacts: 'Контакты',
    },
    // Hero
    hero: {
      title: 'ProtoLab 3D',
      subtitle: 'Профессиональная 3D-печать и моделирование',
      description: '6 принтеров, 6+ материалов, неограниченные возможности',
      calculate: 'Рассчитать стоимость',
      learnMore: 'Узнать больше',
      printers: 'Принтеров',
      materials: 'Материалов',
      workHours: 'Работаем',
      technology: 'Технология',
    },
    // About
    about: {
      title: 'О нас',
      subtitle: 'Что мы делаем',
      fdmTitle: 'Технология FDM',
      fdmDesc: 'Послойная печать пластиком — надёжная и универсальная технология для прототипов, функциональных деталей и небольших серий.',
      printersTitle: '6 принтеров',
      printersDesc: 'Одновременная печать несколькими задачами, быстрый выполнение заказов, подбор оборудования под конкретный проект.',
    },
    // Services
    services: {
      title: 'Наши услуги',
      subtitle: 'Полный цикл от модели до изделия',
      printing: '3D-печать',
      printingDesc: 'От 1 штуки до серии. FDM технология, 6+ материалов.',
      printingPrice: 'От 8 ₽/грамм',
      modeling: '3D-моделирование',
      modelingDesc: 'По чертежам, эскизам или описанию. Реверс-инжиниринг.',
      modelingPrice: '500 ₽ / час',
      scanning: '3D-сканирование',
      scanningDesc: 'Оцифровка объектов для создания точных 3D-моделей.',
      scanningPrice: 'Стоимость уточняйте',
      discountTitle: '🎁 Скидки при больших заказах!',
      discountDesc: 'От 10 шт — 5% • От 20 шт — 10% • От 50 шт — 15%',
    },
    // Equipment
    equipment: {
      title: 'Наше оборудование',
      subtitle: '6 принтеров для любых задач',
      volume: 'Объём',
    },
    // Materials
    materials: {
      title: 'Материалы',
      subtitle: 'Подбираем пластик под вашу задачу',
      from: 'от',
      perGram: '/ грамм',
    },
    // Calculator
    calculator: {
      title: 'Калькулятор стоимости',
      subtitle: 'Рассчитайте примерную стоимость',
      material: 'Материал',
      weight: 'Вес',
      complexity: 'Сложность',
      simple: 'Простая',
      medium: 'Средняя',
      high: 'Высокая',
      quantity: 'Количество (шт)',
      urgent: 'Срочный (+50%)',
      discount: '🎉 Скидка',
      estimatedCost: 'Примерная стоимость',
      discussTelegram: 'Обсудить в Telegram',
      discussMax: 'Обсудить в Max',
    },
    // Gallery
    gallery: {
      title: 'Наши работы',
      subtitle: 'Примеры выполненных проектов',
    },
    // MakerWorld
    makerworld: {
      title: 'Инструменты MakerWorld',
      subtitle: 'Каталог моделей и генерация 3D из фото',
      catalogTitle: 'Каталог моделей',
      catalogDesc: 'Библиотека готовых 3D-моделей',
      howItWorks: 'Как это работает:',
      step1: 'Откройте каталог MakerWorld',
      step2: 'Выберите модель',
      step3: 'Отправьте нам для печати',
      openCatalog: 'Открыть каталог',
      freeModels: '💡 Тысячи бесплатных моделей для 3D-печати',
      generateTitle: 'Сгенерировать 3D-модель',
      generateDesc: 'Превратите фото в 3D-модель с помощью ИИ',
      genStep1: 'Загрузите фотографию',
      genStep2: 'ИИ создаёт 3D-модель',
      genStep3: 'Скачайте модель',
      openMakerLab: 'Открыть MakerLab',
      freeTool: '💡 Бесплатный инструмент от MakerWorld для создания 3D-моделей из фотографий',
    },
    // Contacts
    contacts: {
      title: 'Контакты',
      subtitle: 'Свяжитесь с нами',
      address: '📍 Адрес',
      city: 'г. Люберцы',
      street: 'проспект Гагарина, дом 21',
      messengers: '💬 Мессенджеры',
      telegram: 'Telegram',
      max: 'Мессенджер',
      channel: 'Наш канал',
      location: 'Местоположение',
      conditions: '📋 Условия работы',
      cond1: 'Принимаем заказы от 1 штуки',
      cond2: 'Срок выполнения: от 1 дня',
      cond3: 'Помощь с 3D-моделированием',
      cond4: 'Отправка по всей России',
      cond5: 'Оплата: перевод / наличные',
      cond6: 'Скидки при больших заказах!',
    },
    // Footer
    footer: {
      rights: '© 2024 ProtoLab 3D. Люберцы, пр. Гагарина, 21',
    },
    // Theme
    theme: {
      light: '☀️',
      dark: '🌙',
    },
  },
  en: {
    // Navigation
    nav: {
      home: 'Home',
      about: 'About',
      services: 'Services',
      equipment: 'Equipment',
      materials: 'Materials',
      calculator: 'Calculator',
      works: 'Works',
      catalog: 'Catalog',
      contacts: 'Contacts',
    },
    // Hero
    hero: {
      title: 'ProtoLab 3D',
      subtitle: 'Professional 3D Printing & Modeling',
      description: '6 printers, 6+ materials, unlimited possibilities',
      calculate: 'Calculate Cost',
      learnMore: 'Learn More',
      printers: 'Printers',
      materials: 'Materials',
      workHours: 'Working',
      technology: 'Technology',
    },
    // About
    about: {
      title: 'About Us',
      subtitle: 'What we do',
      fdmTitle: 'FDM Technology',
      fdmDesc: 'Layer-by-layer plastic printing — reliable and versatile technology for prototypes, functional parts, and small series.',
      printersTitle: '6 Printers',
      printersDesc: 'Simultaneous printing of multiple tasks, fast order fulfillment, equipment selection for specific projects.',
    },
    // Services
    services: {
      title: 'Our Services',
      subtitle: 'Full cycle from model to product',
      printing: '3D Printing',
      printingDesc: 'From 1 piece to series. FDM technology, 6+ materials.',
      printingPrice: 'From 8 ₽/gram',
      modeling: '3D Modeling',
      modelingDesc: 'From drawings, sketches, or descriptions. Reverse engineering.',
      modelingPrice: '500 ₽ / hour',
      scanning: '3D Scanning',
      scanningDesc: 'Digitizing objects to create accurate 3D models.',
      scanningPrice: 'Price on request',
      discountTitle: '🎁 Discounts on Large Orders!',
      discountDesc: 'From 10 pcs — 5% • From 20 pcs — 10% • From 50 pcs — 15%',
    },
    // Equipment
    equipment: {
      title: 'Our Equipment',
      subtitle: '6 printers for any tasks',
      volume: 'Volume',
    },
    // Materials
    materials: {
      title: 'Materials',
      subtitle: 'We select plastic for your task',
      from: 'from',
      perGram: '/ gram',
    },
    // Calculator
    calculator: {
      title: 'Cost Calculator',
      subtitle: 'Calculate approximate cost',
      material: 'Material',
      weight: 'Weight',
      complexity: 'Complexity',
      simple: 'Simple',
      medium: 'Medium',
      high: 'High',
      quantity: 'Quantity (pcs)',
      urgent: 'Urgent (+50%)',
      discount: '🎉 Discount',
      estimatedCost: 'Estimated Cost',
      discussTelegram: 'Discuss in Telegram',
      discussMax: 'Discuss in Max',
    },
    // Gallery
    gallery: {
      title: 'Our Works',
      subtitle: 'Examples of completed projects',
    },
    // MakerWorld
    makerworld: {
      title: 'MakerWorld Tools',
      subtitle: 'Model catalog and 3D generation from photos',
      catalogTitle: 'Model Catalog',
      catalogDesc: 'Library of ready 3D models',
      howItWorks: 'How it works:',
      step1: 'Open MakerWorld catalog',
      step2: 'Choose a model',
      step3: 'Send it to us for printing',
      openCatalog: 'Open Catalog',
      freeModels: '💡 Thousands of free models for 3D printing',
      generateTitle: 'Generate 3D Model',
      generateDesc: 'Turn photos into 3D models with AI',
      genStep1: 'Upload a photo',
      genStep2: 'AI creates 3D model',
      genStep3: 'Download the model',
      openMakerLab: 'Open MakerLab',
      freeTool: '💡 Free tool from MakerWorld for creating 3D models from photos',
    },
    // Contacts
    contacts: {
      title: 'Contacts',
      subtitle: 'Get in touch with us',
      address: '📍 Address',
      city: 'Lyubertsy',
      street: 'Gagarin Avenue, 21',
      messengers: '💬 Messengers',
      telegram: 'Telegram',
      max: 'Messenger',
      channel: 'Our Channel',
      location: 'Location',
      conditions: '📋 Work Conditions',
      cond1: 'We accept orders from 1 piece',
      cond2: 'Execution time: from 1 day',
      cond3: 'Help with 3D modeling',
      cond4: 'Shipping throughout Russia',
      cond5: 'Payment: transfer / cash',
      cond6: 'Discounts on large orders!',
    },
    // Footer
    footer: {
      rights: '© 2024 ProtoLab 3D. Lyubertsy, Gagarin Ave., 21',
    },
    // Theme
    theme: {
      light: '☀️',
      dark: '🌙',
    },
  },
  zh: {
    // Navigation
    nav: {
      home: '首页',
      about: '关于我们',
      services: '服务',
      equipment: '设备',
      materials: '材料',
      calculator: '计算器',
      works: '作品',
      catalog: '目录',
      contacts: '联系方式',
    },
    // Hero
    hero: {
      title: 'ProtoLab 3D',
      subtitle: '专业3D打印和建模',
      description: '6台打印机，6+种材料，无限可能',
      calculate: '计算成本',
      learnMore: '了解更多',
      printers: '打印机',
      materials: '材料',
      workHours: '工作时间',
      technology: '技术',
    },
    // About
    about: {
      title: '关于我们',
      subtitle: '我们做什么',
      fdmTitle: 'FDM技术',
      fdmDesc: '逐层塑料打印 - 适用于原型、功能部件和小批量的可靠通用技术。',
      printersTitle: '6台打印机',
      printersDesc: '同时打印多个任务，快速完成订单，为特定项目选择设备。',
    },
    // Services
    services: {
      title: '我们的服务',
      subtitle: '从模型到产品的完整周期',
      printing: '3D打印',
      printingDesc: '从1件到批量。FDM技术，6+种材料。',
      printingPrice: '从8卢布/克',
      modeling: '3D建模',
      modelingDesc: '根据图纸、草图或描述。逆向工程。',
      modelingPrice: '500卢布/小时',
      scanning: '3D扫描',
      scanningDesc: '数字化对象以创建精确的3D模型。',
      scanningPrice: '价格咨询',
      discountTitle: '🎁 大订单折扣！',
      discountDesc: '10件起 - 5% • 20件起 - 10% • 50件起 - 15%',
    },
    // Equipment
    equipment: {
      title: '我们的设备',
      subtitle: '6台打印机适用于任何任务',
      volume: '体积',
    },
    // Materials
    materials: {
      title: '材料',
      subtitle: '我们为您的任务选择塑料',
      from: '从',
      perGram: '/克',
    },
    // Calculator
    calculator: {
      title: '成本计算器',
      subtitle: '计算大致成本',
      material: '材料',
      weight: '重量',
      complexity: '复杂度',
      simple: '简单',
      medium: '中等',
      high: '高',
      quantity: '数量（件）',
      urgent: '紧急（+50%）',
      discount: '🎉 折扣',
      estimatedCost: '预估成本',
      discussTelegram: '在Telegram讨论',
      discussMax: '在Max讨论',
    },
    // Gallery
    gallery: {
      title: '我们的作品',
      subtitle: '已完成项目示例',
    },
    // MakerWorld
    makerworld: {
      title: 'MakerWorld工具',
      subtitle: '模型目录和从照片生成3D',
      catalogTitle: '模型目录',
      catalogDesc: '现成3D模型库',
      howItWorks: '工作原理：',
      step1: '打开MakerWorld目录',
      step2: '选择模型',
      step3: '发送给我们打印',
      openCatalog: '打开目录',
      freeModels: '💡 数千个免费3D打印模型',
      generateTitle: '生成3D模型',
      generateDesc: '用AI将照片转换为3D模型',
      genStep1: '上传照片',
      genStep2: 'AI创建3D模型',
      genStep3: '下载模型',
      openMakerLab: '打开MakerLab',
      freeTool: '💡 MakerWorld的免费工具，用于从照片创建3D模型',
    },
    // Contacts
    contacts: {
      title: '联系方式',
      subtitle: '与我们联系',
      address: '📍 地址',
      city: '柳别尔齐',
      street: '加加林大街21号',
      messengers: '💬 即时通讯',
      telegram: 'Telegram',
      max: '即时通讯',
      channel: '我们的频道',
      location: '位置',
      conditions: '📋 工作条件',
      cond1: '我们接受1件起的订单',
      cond2: '执行时间：从1天起',
      cond3: '3D建模帮助',
      cond4: '全俄罗斯配送',
      cond5: '付款：转账/现金',
      cond6: '大订单折扣！',
    },
    // Footer
    footer: {
      rights: '© 2024 ProtoLab 3D. 柳别尔齐，加加林大街21号',
    },
    // Theme
    theme: {
      light: '☀️',
      dark: '🌙',
    },
  },
};

export function getTranslation(lang: Language) {
  return translations[lang];
}
