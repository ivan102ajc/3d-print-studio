import { useState, useEffect, useRef } from 'react';

type Theme = 'dark' | 'light';

type GalleryItem = {
  src: string;
  title: string;
  subtitle: string;
  isDefault?: boolean;
};

function App() {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('protolab-theme') as Theme) || 'dark';
    }
    return 'dark';
  });
  const [scrollY, setScrollY] = useState(0);
  const [activeSection, setActiveSection] = useState('hero');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [calcMaterial, setCalcMaterial] = useState('PLA');
  const [calcWeight, setCalcWeight] = useState(50);
  const [calcComplexity, setCalcComplexity] = useState(1);
  const [calcQuantity, setCalcQuantity] = useState(1);
  const [calcUrgent, setCalcUrgent] = useState(false);

  const equipmentImage = 'https://i.imgur.com/2HIpvpO.jpg';

  const defaultGallery: GalleryItem[] = [
    {
      src: 'https://i.imgur.com/UNhe4ih_d.webp?maxwidth=760&fidelity=grand',
      title: '3D-печать',
      subtitle: 'Процесс создания изделия',
      isDefault: true,
    },
    {
      src: 'https://i.imgur.com/zkqT8gs_d.webp?maxwidth=760&fidelity=grand',
      title: 'Готовое изделие',
      subtitle: 'Результат печати',
      isDefault: true,
    },
    {
      src: 'https://i.imgur.com/IKeut6o_d.webp?maxwidth=760&fidelity=grand',
      title: 'Наша работа',
      subtitle: '3D-печать на заказ',
      isDefault: true,
    },
    {
      src: 'https://i.imgur.com/XqE6JMg_d.webp?maxwidth=760&fidelity=grand',
      title: 'Мастерская',
      subtitle: 'Рабочее пространство',
      isDefault: true,
    },
    {
      src: 'https://i.imgur.com/u1TXaQu_d.webp?maxwidth=760&fidelity=grand',
      title: '3D-модель',
      subtitle: 'Подготовка к печати',
      isDefault: true,
    },
    {
      src: 'https://i.imgur.com/wwA6HmL_d.webp?maxwidth=760&fidelity=grand',
      title: 'Изделие',
      subtitle: 'Напечатано на FDM',
      isDefault: true,
    },
    {
      src: 'https://i.imgur.com/3MPkGnk_d.webp?maxwidth=760&fidelity=grand',
      title: 'Результат',
      subtitle: 'Готовая деталь',
      isDefault: true,
    },
    {
      src: 'https://i.imgur.com/KVJ2661_d.webp?maxwidth=760&fidelity=grand',
      title: 'Проект',
      subtitle: 'Выполнен на заказ',
      isDefault: true,
    },
    {
      src: 'https://i.imgur.com/ICbenox_d.webp?maxwidth=760&fidelity=grand',
      title: 'Печать',
      subtitle: 'Процесс работы',
      isDefault: true,
    },
    {
      src: 'https://i.imgur.com/HzY7GmL_d.webp?maxwidth=760&fidelity=grand',
      title: 'Изделие',
      subtitle: '3D-печать',
      isDefault: true,
    },
    {
      src: 'https://i.imgur.com/XmR9abp_d.webp?maxwidth=760&fidelity=grand',
      title: 'Большой проект',
      subtitle: 'Сложная печать',
      isDefault: true,
    },
    {
      src: 'https://i.imgur.com/bjp4Yp2_d.webp?maxwidth=760&fidelity=grand',
      title: 'Работа',
      subtitle: 'Выполнено в ProtoLab 3D',
      isDefault: true,
    },
  ];

  const [gallery] = useState<GalleryItem[]>(defaultGallery);


  useEffect(() => {
    localStorage.setItem('protolab-theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
      const sections = ['hero', 'about', 'services', 'printers', 'materials', 'calculator', 'gallery', 'makerworld', 'location', 'contact'];
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 150 && rect.bottom >= 150) {
            setActiveSection(section);
            break;
          }
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMobileMenuOpen(false);
  };

  const materials = [
    { name: 'PLA', desc: 'Декоративные изделия и прототипы', price: 8, color: '#00f0ff' },
    { name: 'PETG', desc: 'Прочность и универсальность', price: 8, color: '#7b61ff' },
    { name: 'ABS', desc: 'Устойчивость к температурам', price: 8, color: '#ff6b6b' },
    { name: 'TPU', desc: 'Гибкие детали', price: 15, color: '#ffd93d' },
    { name: 'PA12/PA6/PA66', desc: 'Инженерные материалы', price: 25, color: '#6bff9e' },
    { name: 'Карбононаполненные', desc: 'Повышенная жёсткость и прочность', price: 30, color: '#ff9e6b' },
  ];

  const printers = [
    { name: 'Bambu Lab P1S', features: 'Высокоскоростная печать, автоматическая калибровка', volume: '256×256×256 мм' },
    { name: 'Creality K1 Max', features: 'Большой объём печати, высокая скорость', volume: '300×300×300 мм' },
    { name: 'Flying Bear Ghost 4', features: 'Закрытая камера, стабильная печать', volume: '255×210×210 мм' },
    { name: 'Bambu Lab H2S', features: 'Премиум качество, мультиматериал', volume: '256×256×256 мм' },
    { name: 'Bambu Lab A1 Combo', features: 'AMS система, быстрая смена цвета', volume: '256×256×256 мм' },
    { name: 'Z-Bolt S300 HT', features: 'Высокотемпературная печать до 500°C', volume: '300×300×400 мм' },
  ];

  const calculatePrice = () => {
    const material = materials.find(m => m.name === calcMaterial);
    if (!material) return 0;
    let price = material.price * calcWeight * calcComplexity * calcQuantity;
    if (calcUrgent) price *= 1.5;
    if (calcQuantity >= 50) price *= 0.85;
    else if (calcQuantity >= 20) price *= 0.9;
    else if (calcQuantity >= 10) price *= 0.95;
    return Math.round(price);
  };

  const getDiscount = () => {
    if (calcQuantity >= 50) return 15;
    if (calcQuantity >= 20) return 10;
    if (calcQuantity >= 10) return 5;
    return 0;
  };

  const isDark = theme === 'dark';

  const navItems = [
    { id: 'hero', label: 'Главная' },
    { id: 'about', label: 'О нас' },
    { id: 'services', label: 'Услуги' },
    { id: 'printers', label: 'Оборудование' },
    { id: 'materials', label: 'Материалы' },
    { id: 'calculator', label: 'Калькулятор' },
    { id: 'gallery', label: 'Работы' },
    { id: 'makerworld', label: 'Каталог' },
    { id: 'makerlab', label: 'MakerLab' },
    { id: 'location', label: 'Контакты' },
  ];

  const bgMain = isDark ? 'bg-[#0a0a1a]' : 'bg-[#f8fafc]';
  const bgCard = isDark ? 'bg-[#111827]' : 'bg-white';
  const bgCardAlt = isDark ? 'bg-[#0d1b2a]' : 'bg-gray-50';
  const textPrimary = isDark ? 'text-white' : 'text-gray-900';
  const textSecondary = isDark ? 'text-gray-300' : 'text-gray-700';
  const textMuted = isDark ? 'text-gray-400' : 'text-gray-500';
  const textMutedLight = isDark ? 'text-gray-500' : 'text-gray-400';
  const borderMain = isDark ? 'border-white/10' : 'border-gray-200';
  const borderHover = isDark ? 'hover:border-white/20' : 'hover:border-gray-300';
  const hoverBg = isDark ? 'hover:bg-white/10' : 'hover:bg-gray-100';
  const navBg = isDark ? 'bg-[#0a0a1a]/90' : 'bg-white/90';
  const navBorder = isDark ? 'border-cyan-500/20' : 'border-gray-200';
  const inputBg = isDark ? 'bg-[#0a0a1a]' : 'bg-white';
  const inputBorder = isDark ? 'border-white/10 focus:border-cyan-500/50' : 'border-gray-300 focus:border-cyan-500';

  return (
    <div className={`min-h-screen ${bgMain} ${textPrimary} font-['Inter'] overflow-x-hidden transition-colors duration-300`}>
      {/* Animated background */}
      <div className="fixed inset-0 z-0 transition-opacity duration-300">
        {isDark ? (
          <>
            <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a1a] via-[#0d1b2a] to-[#1a0a2e]" />
            <div className="absolute inset-0 opacity-20" style={{
              backgroundImage: `radial-gradient(circle at 20% 50%, rgba(0, 240, 255, 0.15) 0%, transparent 50%),
                               radial-gradient(circle at 80% 20%, rgba(123, 97, 255, 0.15) 0%, transparent 50%),
                               radial-gradient(circle at 50% 80%, rgba(255, 107, 107, 0.1) 0%, transparent 50%)`
            }} />
            <div className="absolute inset-0 opacity-[0.03]" style={{
              backgroundImage: `linear-gradient(rgba(0,240,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(0,240,255,0.3) 1px, transparent 1px)`,
              backgroundSize: '50px 50px'
            }} />
          </>
        ) : (
          <>
            <div className="absolute inset-0 bg-gradient-to-br from-[#f8fafc] via-[#eef2ff] to-[#f0f9ff]" />
            <div className="absolute inset-0 opacity-30" style={{
              backgroundImage: `radial-gradient(circle at 20% 50%, rgba(0, 150, 200, 0.08) 0%, transparent 50%),
                               radial-gradient(circle at 80% 20%, rgba(100, 70, 200, 0.08) 0%, transparent 50%),
                               radial-gradient(circle at 50% 80%, rgba(200, 100, 100, 0.05) 0%, transparent 50%)`
            }} />
          </>
        )}
      </div>

      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrollY > 50 ? `${navBg} backdrop-blur-xl border-b ${navBorder}` : ''}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-purple-600 flex items-center justify-center font-['Orbitron'] font-bold text-sm text-white flex-shrink-0">P3</div>
              <span className="font-['Orbitron'] font-bold text-base sm:text-lg bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent truncate">ProtoLab 3D</span>
            </div>
            
            <div className="hidden lg:flex items-center gap-1">
              {navItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => scrollTo(item.id)}
                  className={`px-3 py-2 rounded-lg text-sm transition-all duration-300 whitespace-nowrap ${activeSection === item.id ? 'text-cyan-500 bg-cyan-500/10' : `${textMuted} hover:text-cyan-500 ${hoverBg}`}`}
                >
                  {item.label}
                </button>
              ))}
              <button
                onClick={toggleTheme}
                className={`ml-2 p-2 rounded-lg ${hoverBg} transition-all`}
                title={isDark ? 'Светлая тема' : 'Тёмная тема'}
              >
                {isDark ? (
                  <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                  </svg>
                )}
              </button>
            </div>

            <div className="flex items-center gap-2 lg:hidden">
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-lg ${hoverBg} transition-all`}
                title={isDark ? 'Светлая тема' : 'Тёмная тема'}
              >
                {isDark ? (
                  <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                  </svg>
                )}
              </button>
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className={`${textPrimary} p-2`}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {mobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className={`lg:hidden ${navBg} backdrop-blur-xl border-b ${navBorder}`}>
            <div className="px-4 py-3 space-y-1 max-h-[70vh] overflow-y-auto">
              {navItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => scrollTo(item.id)}
                  className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${activeSection === item.id ? 'text-cyan-500 bg-cyan-500/10' : `${textMuted} ${hoverBg}`}`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Hero */}
      <section id="hero" className="relative z-10 min-h-screen flex items-center justify-center px-4 py-20">
        <div className="max-w-6xl mx-auto text-center">
          <div className="mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-full border border-cyan-500/30 bg-cyan-500/5">
            <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-cyan-500 text-xs sm:text-sm font-['Orbitron']">FDM 3D-ПЕЧАТЬ</span>
          </div>
          <h1 className="font-['Orbitron'] text-3xl sm:text-5xl md:text-7xl font-bold mb-4 sm:mb-6 leading-tight">
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500 bg-clip-text text-transparent">ProtoLab 3D</span>
          </h1>
          <p className={`text-lg sm:text-2xl ${textSecondary} mb-3 sm:mb-4 max-w-3xl mx-auto px-2`}>Профессиональная 3D-печать и моделирование</p>
          <p className={`${textMuted} mb-8 sm:mb-10 max-w-2xl mx-auto text-sm sm:text-lg px-2`}>От прототипа до серии. 6 принтеров, 6+ материалов, неограниченные возможности.</p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
            <button onClick={() => scrollTo('calculator')} className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold hover:from-cyan-400 hover:to-blue-500 transition-all duration-300 shadow-lg shadow-cyan-500/25 text-sm sm:text-base">Рассчитать стоимость</button>
            <button onClick={() => scrollTo('about')} className={`w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 rounded-xl border border-cyan-500/30 text-cyan-500 font-semibold ${hoverBg} transition-all duration-300 text-sm sm:text-base`}>Узнать больше</button>
          </div>
          <div className="mt-12 sm:mt-16 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-3xl mx-auto px-2">
            {[{ value: '6', label: 'Принтеров' }, { value: '6+', label: 'Материалов' }, { value: '24/7', label: 'Работаем' }, { value: 'FDM', label: 'Технология' }].map((stat, i) => (
              <div key={i} className={`p-3 sm:p-4 rounded-xl ${bgCard} border ${borderMain}`}>
                <div className="font-['Orbitron'] text-xl sm:text-2xl font-bold text-cyan-500">{stat.value}</div>
                <div className={`${textMuted} text-xs sm:text-sm mt-1`}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="relative z-10 py-16 sm:py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <SectionTitle title="О нас" subtitle="Что мы делаем и для кого" isDark={isDark} />
          <div className="grid md:grid-cols-2 gap-6 sm:gap-8 mt-10 sm:mt-12">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-2xl opacity-20 group-hover:opacity-40 transition-opacity blur" />
              <div className={`relative ${bgCard} rounded-2xl p-5 sm:p-8 border ${borderMain}`}>
                <h3 className="font-['Orbitron'] text-lg sm:text-xl font-bold text-cyan-500 mb-4">Технология FDM</h3>
                <p className={`${textSecondary} leading-relaxed mb-6 text-sm sm:text-base`}>Послойная печать пластиком — надёжная и универсальная технология.</p>
                <div className="space-y-2 sm:space-y-3">
                  {['Детали взамен сломанных', 'Корпуса и крепления', 'Прототипы', 'DIY-проекты', 'Электроника', 'Функциональные изделия', 'Небольшие серии'].map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-cyan-500/20 flex items-center justify-center flex-shrink-0">
                        <svg className="w-3 h-3 text-cyan-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                      </div>
                      <span className={`${textSecondary} text-sm sm:text-base`}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl opacity-20 group-hover:opacity-40 transition-opacity blur" />
              <div className={`relative ${bgCard} rounded-2xl p-5 sm:p-8 border ${borderMain}`}>
                <h3 className="font-['Orbitron'] text-lg sm:text-xl font-bold text-purple-400 mb-4">Почему несколько принтеров?</h3>
                <div className="space-y-3 sm:space-y-4">
                  {[{ icon: '⚡', text: 'Быстрее выполнение заказов' }, { icon: '🕐', text: 'Меньше ожидания' }, { icon: '🎨', text: 'Печать разными материалами одновременно' }, { icon: '📦', text: 'Изготовление от 1 детали до серии' }, { icon: '🔧', text: 'Подбор оборудования под задачу' }, { icon: '📐', text: 'Разные объёмы печати' }].map((item, i) => (
                    <div key={i} className={`flex items-center gap-3 sm:gap-4 p-2 sm:p-3 rounded-xl ${bgCardAlt} ${hoverBg} transition-colors`}>
                      <span className="text-xl sm:text-2xl flex-shrink-0">{item.icon}</span>
                      <span className={`${textSecondary} text-sm sm:text-base`}>{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="relative z-10 py-16 sm:py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <SectionTitle title="Наши услуги" subtitle="Полный цикл от модели до готового изделия" isDark={isDark} />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 mt-10 sm:mt-12">
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl opacity-0 group-hover:opacity-50 transition-opacity blur-sm" />
              <div className={`relative ${bgCard} rounded-2xl p-5 sm:p-6 border ${borderMain} ${borderHover} transition-all duration-300`}>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center text-2xl mb-4">🖨</div>
                <h3 className={`font-['Orbitron'] text-base sm:text-lg font-bold ${textPrimary} mb-2`}>3D-печать</h3>
                <p className={`${textMuted} text-sm mb-4`}>Печать деталей любой сложности на FDM-принтерах. От 1 штуки до серии.</p>
                <div className={`text-xs ${textMutedLight} space-y-1`}>
                  <div>• FDM технология</div><div>• 6+ материалов</div><div>• От 8 ₽/грамм</div>
                </div>
              </div>
            </div>
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl opacity-0 group-hover:opacity-50 transition-opacity blur-sm" />
              <div className={`relative ${bgCard} rounded-2xl p-5 sm:p-6 border ${borderMain} ${borderHover} transition-all duration-300`}>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center text-2xl mb-4">🎨</div>
                <h3 className={`font-['Orbitron'] text-base sm:text-lg font-bold ${textPrimary} mb-2`}>3D-моделирование</h3>
                <p className={`${textMuted} text-sm mb-4`}>Создадим 3D-модель по вашим чертежам, эскизам или описанию.</p>
                <div className={`text-xs ${textMutedLight} space-y-1`}>
                  <div>• По чертежам и эскизам</div><div>• Реверс-инжиниринг</div>
                  <div className="text-purple-400 font-semibold mt-2">💰 500 ₽ / час</div>
                </div>
              </div>
            </div>
            <div className="relative group sm:col-span-2 lg:col-span-1">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-green-500 to-teal-600 rounded-2xl opacity-0 group-hover:opacity-50 transition-opacity blur-sm" />
              <div className={`relative ${bgCard} rounded-2xl p-5 sm:p-6 border ${borderMain} ${borderHover} transition-all duration-300`}>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500/20 to-teal-500/20 flex items-center justify-center text-2xl mb-4">📡</div>
                <h3 className={`font-['Orbitron'] text-base sm:text-lg font-bold ${textPrimary} mb-2`}>3D-сканирование</h3>
                <p className={`${textMuted} text-sm mb-4`}>Оцифровка физических объектов для создания точных 3D-моделей.</p>
                <div className={`text-xs ${textMutedLight} space-y-1`}>
                  <div>• Высокая точность</div><div>• Любые объекты</div>
                  <div className="text-green-400 font-semibold mt-2">💰 Стоимость уточняйте</div>
                </div>
              </div>
            </div>
          </div>
          <div className={`mt-8 sm:mt-10 relative rounded-2xl overflow-hidden border ${borderMain}`}>
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-pink-500/10" />
            <div className="relative p-5 sm:p-8 flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
              <div className="text-4xl sm:text-5xl">🎁</div>
              <div className="text-center sm:text-left">
                <h3 className={`font-['Orbitron'] text-lg sm:text-xl font-bold ${textPrimary} mb-1`}>Скидки при больших заказах!</h3>
                <p className={`${textMuted} text-sm sm:text-base`}>
                  От 10 шт — <span className="text-cyan-400 font-semibold">5%</span> • 
                  От 20 шт — <span className="text-purple-400 font-semibold">10%</span> • 
                  От 50 шт — <span className="text-pink-400 font-semibold">15%</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Printers */}
      <section id="printers" className="relative z-10 py-16 sm:py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <SectionTitle title="Наше оборудование" subtitle="6 принтеров для любых задач" isDark={isDark} />
          <div className="mt-10 sm:mt-12 relative rounded-2xl overflow-hidden border border-white/10">
            <img src={equipmentImage} alt="Наше оборудование" className="w-full h-48 sm:h-64 object-cover" />
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mt-6 sm:mt-8">
            {printers.map((printer, i) => (
              <div key={i} className="group relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-xl opacity-0 group-hover:opacity-50 transition-opacity duration-500 blur-sm" />
                <div className={`relative ${bgCard} rounded-xl p-4 sm:p-6 border ${borderMain} group-hover:border-cyan-500/30 transition-all duration-300`}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center text-lg sm:text-xl flex-shrink-0">🖨</div>
                    <h3 className={`font-['Orbitron'] text-xs sm:text-sm font-bold ${textPrimary} leading-tight`}>{printer.name}</h3>
                  </div>
                  <p className={`${textMuted} text-xs sm:text-sm mb-2`}>{printer.features}</p>
                  <div className="flex items-center gap-2 text-xs text-cyan-500">
                    <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" /></svg>
                    <span>Объём: {printer.volume}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Materials */}
      <section id="materials" className="relative z-10 py-16 sm:py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <SectionTitle title="Материалы" subtitle="Подбираем пластик под вашу задачу" isDark={isDark} />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mt-10 sm:mt-12">
            {materials.map((mat, i) => (
              <div key={i} className="group relative">
                <div className="absolute -inset-0.5 rounded-xl opacity-20 group-hover:opacity-40 transition-opacity blur-sm" style={{ background: `linear-gradient(135deg, ${mat.color}, transparent)` }} />
                <div className={`relative ${bgCard} rounded-xl p-4 sm:p-6 border ${borderMain} ${borderHover} transition-all duration-300`}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-4 h-4 rounded-full flex-shrink-0" style={{ backgroundColor: mat.color }} />
                    <h3 className="font-['Orbitron'] text-xs sm:text-sm font-bold" style={{ color: mat.color }}>{mat.name}</h3>
                  </div>
                  <p className={`${textMuted} text-xs sm:text-sm`}>{mat.desc}</p>
                  <div className={`mt-4 pt-4 border-t ${borderMain}`}>
                    <span className={`text-xs ${textMutedLight}`}>от</span>
                    <span className="font-['Orbitron'] text-base sm:text-lg font-bold ml-1" style={{ color: mat.color }}>{mat.price} ₽</span>
                    <span className={`text-xs ${textMutedLight} ml-1`}>/ грамм</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Calculator */}
      <section id="calculator" className="relative z-10 py-16 sm:py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <SectionTitle title="Калькулятор стоимости" subtitle="Рассчитайте примерную стоимость заказа" isDark={isDark} />
          <div className="mt-10 sm:mt-12 relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-2xl opacity-20 blur" />
            <div className={`relative ${bgCard} rounded-2xl p-4 sm:p-8 border ${borderMain}`}>
              <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label className={`block text-xs sm:text-sm ${textMuted} mb-2 font-['Orbitron']`}>Материал</label>
                  <select value={calcMaterial} onChange={(e) => setCalcMaterial(e.target.value)} className={`w-full ${inputBg} border ${inputBorder} rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 ${textPrimary} focus:outline-none transition-colors text-sm`}>
                    {materials.map(m => (<option key={m.name} value={m.name}>{m.name} — {m.price} ₽/г</option>))}
                  </select>
                </div>
                <div>
                  <label className={`block text-xs sm:text-sm ${textMuted} mb-2 font-['Orbitron']`}>Вес (грамм)</label>
                  <input type="range" min="5" max="1000" value={calcWeight} onChange={(e) => setCalcWeight(Number(e.target.value))} className="w-full accent-cyan-500" />
                  <div className="text-cyan-500 font-['Orbitron'] text-base sm:text-lg mt-1">{calcWeight} г</div>
                </div>
                <div className="sm:col-span-2">
                  <label className={`block text-xs sm:text-sm ${textMuted} mb-2 font-['Orbitron']`}>Сложность</label>
                  <div className="flex gap-2">
                    {[{ val: 1, label: 'Простая' }, { val: 1.5, label: 'Средняя' }, { val: 2, label: 'Высокая' }].map(c => (
                      <button key={c.val} onClick={() => setCalcComplexity(c.val)} className={`flex-1 py-2 sm:py-2.5 px-2 sm:px-3 rounded-lg text-xs sm:text-sm transition-all whitespace-nowrap ${calcComplexity === c.val ? 'bg-cyan-500/20 border border-cyan-500/50 text-cyan-400' : `${bgCardAlt} border ${borderMain} ${textMuted} ${borderHover}`}`}>{c.label}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className={`block text-xs sm:text-sm ${textMuted} mb-2 font-['Orbitron']`}>Количество (шт)</label>
                  <input type="number" min="1" max="10000" value={calcQuantity} onChange={(e) => setCalcQuantity(Math.max(1, Number(e.target.value)))} className={`w-full ${inputBg} border ${inputBorder} rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 ${textPrimary} focus:outline-none transition-colors text-sm`} />
                </div>
                <div className="flex items-end">
                  <div className={`flex items-center gap-3 p-3 rounded-xl ${bgCardAlt} w-full`}>
                    <button onClick={() => setCalcUrgent(!calcUrgent)} className={`w-11 h-6 rounded-full transition-all relative flex-shrink-0 ${calcUrgent ? 'bg-cyan-500' : isDark ? 'bg-white/10' : 'bg-gray-300'}`}>
                      <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${calcUrgent ? 'left-6' : 'left-1'}`} />
                    </button>
                    <span className={`${textSecondary} text-xs sm:text-sm`}>Срочный заказ (+50%)</span>
                  </div>
                </div>
              </div>
              {getDiscount() > 0 && (
                <div className="mt-4 p-3 rounded-xl bg-green-500/10 border border-green-500/20 text-center">
                  <span className="text-green-400 text-sm font-semibold">🎉 Скидка {getDiscount()}% за большой заказ!</span>
                </div>
              )}
              <div className="mt-6 sm:mt-8 p-5 sm:p-6 rounded-xl bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-cyan-500/20">
                <div className="text-center">
                  <div className={`${textMuted} text-xs sm:text-sm mb-1`}>Примерная стоимость</div>
                  <div className="font-['Orbitron'] text-3xl sm:text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">{calculatePrice().toLocaleString()} ₽</div>
                  <div className={`${textMutedLight} text-xs mt-2`}>* Точная стоимость после согласования с менеджером</div>
                </div>
              </div>
              <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
                <a href="https://t.me/ivanchay0937" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold hover:from-cyan-400 hover:to-blue-500 transition-all duration-300 shadow-lg shadow-cyan-500/25 text-sm sm:text-base">
                  <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/></svg>
                  Обсудить в Telegram
                </a>
                <a href="https://max.ru/u/f9LHodD0cOJ4WswKoZ0gfs_dwKKmUdugV1HqBTNmTiMI0AyDcJAen50E6G4" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-[#0077FF] to-[#0055CC] text-white font-semibold hover:from-[#0088FF] hover:to-[#0066DD] transition-all duration-300 shadow-lg shadow-[#0077FF]/25 text-sm sm:text-base">
                  <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/></svg>
                  Обсудить в Max
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section id="gallery" className="relative z-10 py-16 sm:py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <SectionTitle title="Наши работы" subtitle="Примеры выполненных проектов" isDark={isDark} />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mt-6 sm:mt-8">
            {gallery.map((item, i) => (
              <div 
                key={i} 
                className="relative group rounded-2xl overflow-hidden border border-white/10 hover:border-cyan-500/30 transition-all duration-300"
              >
                <img 
                  src={item.src} 
                  alt={item.title} 
                  className="w-full h-80 sm:h-96 object-cover"
                />
                <div className={`absolute inset-0 bg-gradient-to-t ${isDark ? 'from-[#0a0a1a]' : 'from-black/80'} via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none rounded-2xl`}>
                  <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4">
                    <p className="text-white font-['Orbitron'] text-xs sm:text-sm">{item.title}</p>
                    <p className="text-gray-300 text-xs">{item.subtitle}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MakerWorld & MakerLab */}
      <section id="makerworld" className="relative z-10 py-16 sm:py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <SectionTitle title="Инструменты MakerWorld" subtitle="Каталог моделей и генерация 3D из фото" isDark={isDark} />
          <div className="mt-10 sm:mt-12 grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* MakerWorld */}
            <div id="makerworld-card" className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl opacity-20 blur" />
              <div className={`relative ${bgCard} rounded-2xl p-5 sm:p-8 border ${borderMain} h-full`}>
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500/20 to-red-500/20 mb-4">
                    <svg className="w-8 h-8 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                  </div>
                  <h3 className={`font-['Orbitron'] text-lg sm:text-xl font-bold ${textPrimary} mb-2`}>Каталог моделей</h3>
                  <p className={`${textMuted} text-sm`}>Большая библиотека готовых 3D-моделей</p>
                </div>
                <div className="space-y-4">
                  <div className={`p-4 rounded-xl ${bgCardAlt}`}>
                    <h4 className={`font-['Orbitron'] text-sm font-bold ${textPrimary} mb-3`}>Как это работает:</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-start gap-2">
                        <span className="text-orange-400 font-bold">1.</span>
                        <span className={textSecondary}>Откройте каталог MakerWorld</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-orange-400 font-bold">2.</span>
                        <span className={textSecondary}>Выберите модель из тысяч готовых вариантов</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-orange-400 font-bold">3.</span>
                        <span className={textSecondary}>Скачайте файл и отправьте нам для печати</span>
                      </div>
                    </div>
                  </div>
                  <a href="https://makerworld.com/ru" target="_blank" rel="noopener noreferrer" className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-red-600 text-white font-semibold hover:from-orange-400 hover:to-red-500 transition-all duration-300 shadow-lg shadow-orange-500/25 text-sm">
                    <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                    Открыть каталог
                  </a>
                  <p className={`${textMutedLight} text-xs text-center`}>
                    💡 Тысячи бесплатных моделей для 3D-печати
                  </p>
                </div>
              </div>
            </div>

            {/* MakerLab */}
            <div id="makerlab" className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl opacity-20 blur" />
              <div className={`relative ${bgCard} rounded-2xl p-5 sm:p-8 border ${borderMain} h-full`}>
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 mb-4">
                    <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className={`font-['Orbitron'] text-lg sm:text-xl font-bold ${textPrimary} mb-2`}>Сгенерировать 3D-модель</h3>
                  <p className={`${textMuted} text-sm`}>Превратите фотографию в 3D-модель с помощью ИИ</p>
                </div>
                <div className="space-y-4">
                  <div className={`p-4 rounded-xl ${bgCardAlt}`}>
                    <h4 className={`font-['Orbitron'] text-sm font-bold ${textPrimary} mb-3`}>Как это работает:</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-start gap-2">
                        <span className="text-purple-400 font-bold">1.</span>
                        <span className={textSecondary}>Загрузите фотографию объекта</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-purple-400 font-bold">2.</span>
                        <span className={textSecondary}>ИИ анализирует изображение и создаёт 3D-модель</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-purple-400 font-bold">3.</span>
                        <span className={textSecondary}>Скачайте готовую модель для печати</span>
                      </div>
                    </div>
                  </div>
                  <a 
                    href="https://makerworld.com/ru/makerlab?from=navbar" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-600 text-white font-semibold hover:from-purple-400 hover:to-pink-500 transition-all duration-300 shadow-lg shadow-purple-500/25 text-sm"
                  >
                    <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Открыть MakerLab
                  </a>
                  <p className={`${textMutedLight} text-xs text-center`}>
                    💡 Бесплатный инструмент от MakerWorld для создания 3D-моделей из фотографий
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Location */}
      <section id="location" className="relative z-10 py-16 sm:py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <SectionTitle title="Контакты" subtitle="Свяжитесь с нами любым удобным способом" isDark={isDark} />
          <div className="grid md:grid-cols-2 gap-6 sm:gap-8 mt-10 sm:mt-12">
            <div className="space-y-4 sm:space-y-6">
              <div className={`${bgCard} rounded-2xl p-5 sm:p-6 border ${borderMain}`}>
                <h3 className="font-['Orbitron'] text-base sm:text-lg font-bold text-cyan-500 mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  Адрес
                </h3>
                <div className={`p-3 sm:p-4 rounded-xl ${bgCardAlt}`}>
                  <p className={`${textPrimary} font-medium text-sm sm:text-base`}>г. Люберцы</p>
                  <p className={`${textSecondary} text-sm sm:text-base`}>проспект Гагарина, дом 21</p>
                </div>
              </div>
              <div className={`${bgCard} rounded-2xl p-5 sm:p-6 border ${borderMain}`}>
                <h3 className="font-['Orbitron'] text-base sm:text-lg font-bold text-blue-400 mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/></svg>
                  Мессенджеры
                </h3>
                <div className="space-y-3">
                  <a href="https://t.me/ivanchay0937" target="_blank" rel="noopener noreferrer" className={`flex items-center gap-3 p-3 rounded-xl ${bgCardAlt} ${hoverBg} transition-colors`}>
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-blue-400" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/></svg>
                    </div>
                    <div className="min-w-0">
                      <div className={`${textPrimary} font-medium text-sm sm:text-base truncate`}>@ivanchay0937</div>
                      <div className={`${textMuted} text-xs sm:text-sm`}>Telegram</div>
                    </div>
                  </a>
                  <a href="https://max.ru/u/f9LHodD0cOJ4WswKoZ0gfs_dwKKmUdugV1HqBTNmTiMI0AyDcJAen50E6G4" target="_blank" rel="noopener noreferrer" className={`flex items-center gap-3 p-3 rounded-xl ${bgCardAlt} ${hoverBg} transition-colors`}>
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-[#0077FF]/20 flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-[#0077FF]" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/></svg>
                    </div>
                    <div className="min-w-0">
                      <div className={`${textPrimary} font-medium text-sm sm:text-base truncate`}>Написать в Max</div>
                      <div className={`${textMuted} text-xs sm:text-sm`}>Мессенджер</div>
                    </div>
                  </a>
                  <a href="https://t.me/protolab_3d_pechat" target="_blank" rel="noopener noreferrer" className={`flex items-center gap-3 p-3 rounded-xl ${bgCardAlt} ${hoverBg} transition-colors`}>
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-purple-400" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/></svg>
                    </div>
                    <div className="min-w-0">
                      <div className={`${textPrimary} font-medium text-sm sm:text-base truncate`}>@protolab_3d_pechat</div>
                      <div className={`${textMuted} text-xs sm:text-sm`}>Наш канал</div>
                    </div>
                  </a>
                </div>
              </div>
              <div className={`${bgCard} rounded-2xl p-5 sm:p-6 border ${borderMain}`}>
                <h3 className="font-['Orbitron'] text-base sm:text-lg font-bold text-yellow-400 mb-4 flex items-center gap-2"><span className="text-xl">📋</span>Условия работы</h3>
                <div className={`space-y-2 sm:space-y-3 ${textSecondary} text-xs sm:text-sm`}>
                  <div className="flex items-start gap-2"><span className="text-cyan-400 flex-shrink-0">→</span><span>Принимаем заказы от 1 штуки</span></div>
                  <div className="flex items-start gap-2"><span className="text-cyan-400 flex-shrink-0">→</span><span>Срок выполнения: от 1 дня</span></div>
                  <div className="flex items-start gap-2"><span className="text-cyan-400 flex-shrink-0">→</span><span>Помощь с 3D-моделированием</span></div>
                  <div className="flex items-start gap-2"><span className="text-cyan-400 flex-shrink-0">→</span><span>Отправка по всей России</span></div>
                  <div className="flex items-start gap-2"><span className="text-cyan-400 flex-shrink-0">→</span><span>Оплата: перевод / наличные</span></div>
                  <div className="flex items-start gap-2"><span className="text-cyan-400 flex-shrink-0">→</span><span className="text-yellow-400 font-medium">Скидки при больших заказах!</span></div>
                </div>
              </div>
            </div>
            <div className={`${bgCard} rounded-2xl overflow-hidden border ${borderMain} h-fit`}>
              <div className={`p-4 sm:p-5 border-b ${borderMain}`}>
                <h3 className="font-['Orbitron'] text-base sm:text-lg font-bold text-cyan-500">Местоположение</h3>
                <p className={`${textMuted} text-xs sm:text-sm mt-1`}>г. Люберцы, пр. Гагарина, д. 21</p>
              </div>
              <div className="relative h-64 sm:h-80 bg-[#0d1b2a]">
                <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2235.5!2d37.8964!3d55.6764!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x46b54bfa2d82c5e1%3A0x4c8e2e1e7c5e6d0a!2z0L_RgNC-0YHQv9C10LrQvtC90YwsINCf0L7RgNC-0YHQvywg0JzQvtGB0LrQvtCy0YHQutCw0Y8gMjE!5e0!3m2!1sru!2sru!4v1" width="100%" height="100%" style={{ border: 0, filter: isDark ? 'invert(90%) hue-rotate(180deg) brightness(0.8) contrast(1.2)' : 'none' }} allowFullScreen loading="lazy" title="Карта" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={`relative z-10 border-t ${borderMain} py-6 sm:py-8 px-4`}>
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-gradient-to-br from-cyan-400 to-purple-600 flex items-center justify-center font-['Orbitron'] font-bold text-[8px] text-white">P3</div>
            <span className={`font-['Orbitron'] text-sm ${textMuted}`}>ProtoLab 3D</span>
          </div>
          <p className={`${textMutedLight} text-xs sm:text-sm text-center`}>© 2024 ProtoLab 3D. Люберцы, пр. Гагарина, 21</p>
          <div className="flex gap-4">
            <a href="https://t.me/protolab_3d_pechat" target="_blank" rel="noopener noreferrer" className={`${textMuted} hover:text-cyan-400 transition-colors`}>
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/></svg>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function SectionTitle({ title, subtitle, isDark }: { title: string; subtitle: string; isDark: boolean }) {
  return (
    <div className="text-center px-2">
      <h2 className="font-['Orbitron'] text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">{title}</h2>
      <p className={`${isDark ? 'text-gray-400' : 'text-gray-500'} mt-2 text-sm sm:text-base`}>{subtitle}</p>
      <div className="mt-4 mx-auto w-20 sm:w-24 h-1 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500" />
    </div>
  );
}

export default App;
