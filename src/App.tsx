import { useState, useEffect, memo } from 'react';
import ChatBot from './ChatBot';

type Theme = 'dark' | 'light';

type GalleryItem = {
  src: string;
  title: string;
  subtitle: string;
};

function App() {
  const [theme, setTheme] = useState<Theme>('dark');
  const [scrollY, setScrollY] = useState(0);
  const [activeSection, setActiveSection] = useState('hero');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [calcMaterial, setCalcMaterial] = useState('PLA');
  const [calcWeight, setCalcWeight] = useState(50);
  const [calcComplexity, setCalcComplexity] = useState(1);
  const [calcQuantity, setCalcQuantity] = useState(1);
  const [calcUrgent, setCalcUrgent] = useState(false);

  const equipmentImage = 'https://i.imgur.com/2HIpvpO.jpg';

  const gallery: GalleryItem[] = [
    { src: 'https://i.imgur.com/UNhe4ih_d.webp?maxwidth=760&fidelity=grand', title: '3D-печать', subtitle: 'Процесс создания изделия' },
    { src: 'https://i.imgur.com/zkqT8gs_d.webp?maxwidth=760&fidelity=grand', title: 'Готовое изделие', subtitle: 'Результат печати' },
    { src: 'https://i.imgur.com/IKeut6o_d.webp?maxwidth=760&fidelity=grand', title: 'Наша работа', subtitle: '3D-печать на заказ' },
    { src: 'https://i.imgur.com/XqE6JMg_d.webp?maxwidth=760&fidelity=grand', title: 'Мастерская', subtitle: 'Рабочее пространство' },
    { src: 'https://i.imgur.com/u1TXaQu_d.webp?maxwidth=760&fidelity=grand', title: '3D-модель', subtitle: 'Подготовка к печати' },
    { src: 'https://i.imgur.com/wwA6HmL_d.webp?maxwidth=760&fidelity=grand', title: 'Изделие', subtitle: 'Напечатано на FDM' },
    { src: 'https://i.imgur.com/3MPkGnk_d.webp?maxwidth=760&fidelity=grand', title: 'Результат', subtitle: 'Готовая деталь' },
    { src: 'https://i.imgur.com/KVJ2661_d.webp?maxwidth=760&fidelity=grand', title: 'Проект', subtitle: 'Выполнен на заказ' },
    { src: 'https://i.imgur.com/ICbenox_d.webp?maxwidth=760&fidelity=grand', title: 'Печать', subtitle: 'Процесс работы' },
    { src: 'https://i.imgur.com/HzY7GmL_d.webp?maxwidth=760&fidelity=grand', title: 'Изделие', subtitle: '3D-печать' },
    { src: 'https://i.imgur.com/XmR9abp_d.webp?maxwidth=760&fidelity=grand', title: 'Большой проект', subtitle: 'Сложная печать' },
    { src: 'https://i.imgur.com/bjp4Yp2_d.webp?maxwidth=760&fidelity=grand', title: 'Работа', subtitle: 'Выполнено в ProtoLab 3D' },
  ];

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
      const sections = ['hero', 'about', 'services', 'printers', 'materials', 'calculator', 'gallery', 'makerworld', 'location'];
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
    { name: 'Карбононаполненные', desc: 'Повышенная жёсткость', price: 30, color: '#ff9e6b' },
  ];

  const printers = [
    { name: 'Bambu Lab P1S', features: 'Высокоскоростная печать', volume: '256×256×256 мм' },
    { name: 'Creality K1 Max', features: 'Большой объём печати', volume: '300×300×300 мм' },
    { name: 'Flying Bear Ghost 4', features: 'Закрытая камера', volume: '255×210×210 мм' },
    { name: 'Bambu Lab H2S', features: 'Премиум качество', volume: '256×256×256 мм' },
    { name: 'Bambu Lab A1 Combo', features: 'AMS система', volume: '256×256×256 мм' },
    { name: 'Z-Bolt S300 HT', features: 'Печать до 500°C', volume: '300×300×400 мм' },
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
  const bgMain = isDark ? 'bg-[#0a0a1a]' : 'bg-[#f8fafc]';
  const bgCard = isDark ? 'bg-[#111827]' : 'bg-white';
  const bgCardAlt = isDark ? 'bg-[#0d1b2a]' : 'bg-gray-50';
  const textPrimary = isDark ? 'text-white' : 'text-gray-900';
  const textSecondary = isDark ? 'text-gray-300' : 'text-gray-700';
  const textMuted = isDark ? 'text-gray-400' : 'text-gray-500';
  const borderMain = isDark ? 'border-white/10' : 'border-gray-200';
  const hoverBg = isDark ? 'hover:bg-white/10' : 'hover:bg-gray-100';
  const navBg = isDark ? 'bg-[#0a0a1a]/90' : 'bg-white/90';

  const navItems = [
    { id: 'hero', label: 'Главная' },
    { id: 'about', label: 'О нас' },
    { id: 'services', label: 'Услуги' },
    { id: 'printers', label: 'Оборудование' },
    { id: 'materials', label: 'Материалы' },
    { id: 'calculator', label: 'Калькулятор' },
    { id: 'gallery', label: 'Работы' },
    { id: 'makerworld', label: 'Каталог' },
    { id: 'location', label: 'Контакты' },
  ];

  return (
    <div className={`min-h-screen ${bgMain} ${textPrimary} font-['Inter'] overflow-x-hidden`}>
      <div className="fixed inset-0 z-0">
        {isDark ? (
          <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a1a] via-[#0d1b2a] to-[#1a0a2e]" />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#f8fafc] via-[#eef2ff] to-[#f0f9ff]" />
        )}
      </div>

      <nav className={`fixed top-0 left-0 right-0 z-50 ${scrollY > 50 ? `${navBg} backdrop-blur-xl border-b ${borderMain}` : ''}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-purple-600 flex items-center justify-center font-['Orbitron'] font-bold text-sm text-white">P3</div>
              <span className="font-['Orbitron'] font-bold text-lg bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">ProtoLab 3D</span>
            </div>
            <div className="hidden lg:flex items-center gap-1">
              {navItems.map(item => (
                <button key={item.id} onClick={() => scrollTo(item.id)} className={`px-3 py-2 rounded-lg text-sm whitespace-nowrap ${activeSection === item.id ? 'text-cyan-500 bg-cyan-500/10' : `${textMuted} hover:text-cyan-500 ${hoverBg}`}`}>
                  {item.label}
                </button>
              ))}
              <button onClick={toggleTheme} className={`ml-2 p-2 rounded-lg ${hoverBg}`}>
                {isDark ? '☀️' : '🌙'}
              </button>
            </div>
            <div className="flex items-center gap-2 lg:hidden">
              <button onClick={toggleTheme} className={`p-2 rounded-lg ${hoverBg}`}>{isDark ? '☀️' : '🌙'}</button>
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className={textPrimary}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {mobileMenuOpen ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /> : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
                </svg>
              </button>
            </div>
          </div>
        </div>
        {mobileMenuOpen && (
          <div className={`lg:hidden ${navBg} backdrop-blur-xl border-b ${borderMain}`}>
            <div className="px-4 py-3 space-y-1">
              {navItems.map(item => (
                <button key={item.id} onClick={() => scrollTo(item.id)} className={`block w-full text-left px-3 py-2 rounded-lg text-sm ${activeSection === item.id ? 'text-cyan-500 bg-cyan-500/10' : textMuted}`}>
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </nav>

      <section id="hero" className="relative z-10 min-h-screen flex items-center justify-center px-4 py-20">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="font-['Orbitron'] text-4xl sm:text-6xl md:text-7xl font-bold mb-6">
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500 bg-clip-text text-transparent">ProtoLab 3D</span>
          </h1>
          <p className={`text-xl sm:text-2xl ${textSecondary} mb-4`}>Профессиональная 3D-печать и моделирование</p>
          <p className={`${textMuted} mb-10 max-w-2xl mx-auto`}>6 принтеров, 6+ материалов, неограниченные возможности</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={() => scrollTo('calculator')} className="px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold shadow-lg shadow-cyan-500/25">Рассчитать стоимость</button>
            <button onClick={() => scrollTo('about')} className={`px-8 py-4 rounded-xl border border-cyan-500/30 text-cyan-500 font-semibold ${hoverBg}`}>Узнать больше</button>
          </div>
        </div>
      </section>

      <section id="about" className="relative z-10 py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <SectionTitle title="О нас" subtitle="Что мы делаем" isDark={isDark} />
          <div className="grid md:grid-cols-2 gap-8 mt-12">
            <div className={`${bgCard} rounded-2xl p-8 border ${borderMain}`}>
              <h3 className="font-['Orbitron'] text-xl font-bold text-cyan-500 mb-4">Технология FDM</h3>
              <p className={textSecondary}>Послойная печать пластиком — надёжная и универсальная технология для прототипов, корпусов, функциональных изделий и небольших серий.</p>
            </div>
            <div className={`${bgCard} rounded-2xl p-8 border ${borderMain}`}>
              <h3 className="font-['Orbitron'] text-xl font-bold text-purple-400 mb-4">6 принтеров</h3>
              <p className={textSecondary}>Одновременная печать несколькими задачами, быстрый выполнение заказов, подбор оборудования под конкретный проект.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="services" className="relative z-10 py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <SectionTitle title="Наши услуги" subtitle="Полный цикл от модели до изделия" isDark={isDark} />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
            <div className={`${bgCard} rounded-2xl p-6 border ${borderMain}`}>
              <div className="text-4xl mb-4">🖨</div>
              <h3 className={`font-['Orbitron'] text-lg font-bold ${textPrimary} mb-2`}>3D-печать</h3>
              <p className={`${textMuted} text-sm`}>От 1 штуки до серии. FDM технология, 6+ материалов.</p>
              <p className="text-cyan-400 font-semibold mt-2">От 8 ₽/грамм</p>
            </div>
            <div className={`${bgCard} rounded-2xl p-6 border ${borderMain}`}>
              <div className="text-4xl mb-4">🎨</div>
              <h3 className={`font-['Orbitron'] text-lg font-bold ${textPrimary} mb-2`}>3D-моделирование</h3>
              <p className={`${textMuted} text-sm`}>По чертежам, эскизам или описанию. Реверс-инжиниринг.</p>
              <p className="text-purple-400 font-semibold mt-2">500 ₽ / час</p>
            </div>
            <div className={`${bgCard} rounded-2xl p-6 border ${borderMain}`}>
              <div className="text-4xl mb-4">📡</div>
              <h3 className={`font-['Orbitron'] text-lg font-bold ${textPrimary} mb-2`}>3D-сканирование</h3>
              <p className={`${textMuted} text-sm`}>Оцифровка объектов для создания точных 3D-моделей.</p>
              <p className="text-green-400 font-semibold mt-2">Стоимость уточняйте</p>
            </div>
          </div>
          <div className={`mt-10 ${bgCard} rounded-2xl p-8 border ${borderMain} text-center`}>
            <h3 className={`font-['Orbitron'] text-xl font-bold ${textPrimary} mb-2`}>🎁 Скидки при больших заказах!</h3>
            <p className={textMuted}>От 10 шт — 5% • От 20 шт — 10% • От 50 шт — 15%</p>
          </div>
        </div>
      </section>

      <section id="printers" className="relative z-10 py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <SectionTitle title="Наше оборудование" subtitle="6 принтеров для любых задач" isDark={isDark} />
          <div className="mt-12 rounded-2xl overflow-hidden border border-white/10">
            <img src={equipmentImage} alt="Наше оборудование" loading="lazy" className="w-full h-64 object-cover" />
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {printers.map((printer, i) => (
              <div key={i} className={`${bgCard} rounded-xl p-6 border ${borderMain}`}>
                <h3 className={`font-['Orbitron'] text-sm font-bold ${textPrimary} mb-2`}>{printer.name}</h3>
                <p className={`${textMuted} text-sm mb-2`}>{printer.features}</p>
                <p className="text-xs text-cyan-500">Объём: {printer.volume}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="materials" className="relative z-10 py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <SectionTitle title="Материалы" subtitle="Подбираем пластик под вашу задачу" isDark={isDark} />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
            {materials.map((mat, i) => (
              <div key={i} className={`${bgCard} rounded-xl p-6 border ${borderMain}`}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: mat.color }} />
                  <h3 className="font-['Orbitron'] text-sm font-bold" style={{ color: mat.color }}>{mat.name}</h3>
                </div>
                <p className={`${textMuted} text-sm`}>{mat.desc}</p>
                <p className="mt-4 font-['Orbitron'] text-lg font-bold" style={{ color: mat.color }}>от {mat.price} ₽/г</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="calculator" className="relative z-10 py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <SectionTitle title="Калькулятор стоимости" subtitle="Рассчитайте примерную стоимость" isDark={isDark} />
          <div className={`mt-12 ${bgCard} rounded-2xl p-8 border ${borderMain}`}>
            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <label className={`block text-sm ${textMuted} mb-2 font-['Orbitron']`}>Материал</label>
                <select value={calcMaterial} onChange={(e) => setCalcMaterial(e.target.value)} className={`w-full ${bgCardAlt} border ${borderMain} rounded-xl px-4 py-3 ${textPrimary} text-sm`}>
                  {materials.map(m => <option key={m.name} value={m.name}>{m.name} — {m.price} ₽/г</option>)}
                </select>
              </div>
              <div>
                <label className={`block text-sm ${textMuted} mb-2 font-['Orbitron']`}>Вес: {calcWeight} г</label>
                <input type="range" min="5" max="1000" value={calcWeight} onChange={(e) => setCalcWeight(Number(e.target.value))} className="w-full accent-cyan-500" />
                <input type="number" min="5" max="1000" value={calcWeight} onChange={(e) => setCalcWeight(Math.max(5, Math.min(1000, Number(e.target.value))))} className={`w-full ${bgCardAlt} border ${borderMain} rounded-xl px-4 py-2 ${textPrimary} text-sm mt-2`} />
              </div>
              <div className="sm:col-span-2">
                <label className={`block text-sm ${textMuted} mb-2 font-['Orbitron']`}>Сложность</label>
                <div className="flex gap-2">
                  {[{ val: 1, label: 'Простая' }, { val: 1.5, label: 'Средняя' }, { val: 2, label: 'Высокая' }].map(c => (
                    <button key={c.val} onClick={() => setCalcComplexity(c.val)} className={`flex-1 py-2 px-3 rounded-lg text-sm ${calcComplexity === c.val ? 'bg-cyan-500/20 border border-cyan-500/50 text-cyan-400' : `${bgCardAlt} border ${borderMain} ${textMuted}`}`}>{c.label}</button>
                  ))}
                </div>
              </div>
              <div>
                <label className={`block text-sm ${textMuted} mb-2 font-['Orbitron']`}>Количество (шт)</label>
                <input type="number" min="1" value={calcQuantity} onChange={(e) => setCalcQuantity(Math.max(1, Number(e.target.value)))} className={`w-full ${bgCardAlt} border ${borderMain} rounded-xl px-4 py-3 ${textPrimary} text-sm`} />
              </div>
              <div className="flex items-end">
                <div className={`flex items-center gap-3 p-3 rounded-xl ${bgCardAlt} w-full`}>
                  <button onClick={() => setCalcUrgent(!calcUrgent)} className={`w-11 h-6 rounded-full relative ${calcUrgent ? 'bg-cyan-500' : 'bg-gray-600'}`}>
                    <div className={`absolute top-1 w-4 h-4 rounded-full bg-white ${calcUrgent ? 'left-6' : 'left-1'}`} />
                  </button>
                  <span className={`${textSecondary} text-sm`}>Срочный (+50%)</span>
                </div>
              </div>
            </div>
            {getDiscount() > 0 && <div className="mt-4 p-3 rounded-xl bg-green-500/10 border border-green-500/20 text-center text-green-400 font-semibold">🎉 Скидка {getDiscount()}%!</div>}
            <div className="mt-8 p-6 rounded-xl bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-cyan-500/20 text-center">
              <p className={textMuted}>Примерная стоимость</p>
              <p className="font-['Orbitron'] text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">{calculatePrice().toLocaleString()} ₽</p>
            </div>
            <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
              <a href="https://t.me/ivanchay0937" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold">Обсудить в Telegram</a>
              <a href="https://max.ru/u/f9LHodD0cOJ4WswKoZ0gfs_dwKKmUdugV1HqBTNmTiMI0AyDcJAen50E6G4" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#0077FF] to-[#0055CC] text-white font-semibold">Обсудить в Max</a>
            </div>
          </div>
        </div>
      </section>

      <section id="gallery" className="relative z-10 py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <SectionTitle title="Наши работы" subtitle="Примеры выполненных проектов" isDark={isDark} />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
            {gallery.map((item, i) => (
              <div key={i} className={`relative group rounded-2xl overflow-hidden border ${isDark ? 'border-white/10' : 'border-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.3)]'}`}>
                <div className="w-full h-80 sm:h-96 flex items-center justify-center">
                  <img src={item.src} alt={item.title} loading="lazy" className="max-w-full max-h-full object-contain" />
                </div>
                <div className={`absolute inset-0 bg-gradient-to-t ${isDark ? 'from-[#0a0a1a]' : 'from-black/80'} via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity`}>
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <p className="text-white font-['Orbitron'] text-sm">{item.title}</p>
                    <p className="text-gray-300 text-xs">{item.subtitle}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="makerworld" className="relative z-10 py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <SectionTitle title="Инструменты MakerWorld" subtitle="Каталог моделей и генерация 3D из фото" isDark={isDark} />
          <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className={`${bgCard} rounded-2xl p-8 border ${borderMain}`}>
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-orange-500/20 mb-4 text-3xl">🔍</div>
                <h3 className={`font-['Orbitron'] text-xl font-bold ${textPrimary} mb-2`}>Каталог моделей</h3>
                <p className={textMuted}>Библиотека готовых 3D-моделей</p>
              </div>
              <div className={`p-4 rounded-xl ${bgCardAlt} mb-4`}>
                <h4 className={`font-['Orbitron'] text-sm font-bold ${textPrimary} mb-3`}>Как это работает:</h4>
                <div className="space-y-2 text-sm">
                  <p className={textSecondary}><span className="text-orange-400 font-bold">1.</span> Откройте каталог MakerWorld</p>
                  <p className={textSecondary}><span className="text-orange-400 font-bold">2.</span> Выберите модель</p>
                  <p className={textSecondary}><span className="text-orange-400 font-bold">3.</span> Отправьте нам для печати</p>
                </div>
              </div>
              <a href="https://makerworld.com/ru" target="_blank" rel="noopener noreferrer" className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-red-600 text-white font-semibold">Открыть каталог</a>
            </div>
            <div className={`${bgCard} rounded-2xl p-8 border ${borderMain}`}>
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-green-500/20 mb-4 text-3xl">📸</div>
                <h3 className={`font-['Orbitron'] text-xl font-bold ${textPrimary} mb-2`}>Сгенерировать 3D-модель</h3>
                <p className={textMuted}>Превратите фото в 3D-модель с помощью ИИ</p>
              </div>
              <div className={`p-4 rounded-xl ${bgCardAlt} mb-4`}>
                <h4 className={`font-['Orbitron'] text-sm font-bold ${textPrimary} mb-3`}>Как это работает:</h4>
                <div className="space-y-2 text-sm">
                  <p className={textSecondary}><span className="text-green-400 font-bold">1.</span> Загрузите фотографию</p>
                  <p className={textSecondary}><span className="text-green-400 font-bold">2.</span> ИИ создаёт 3D-модель</p>
                  <p className={textSecondary}><span className="text-green-400 font-bold">3.</span> Скачайте модель</p>
                </div>
              </div>
              <a href="https://makerworld.com/ru/makerlab" target="_blank" rel="noopener noreferrer" className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold">Открыть MakerLab</a>
            </div>
          </div>
        </div>
      </section>

      <section id="location" className="relative z-10 py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <SectionTitle title="Контакты" subtitle="Свяжитесь с нами" isDark={isDark} />
          <div className="grid md:grid-cols-2 gap-8 mt-12">
            <div className="space-y-6">
              <div className={`${bgCard} rounded-2xl p-6 border ${borderMain}`}>
                <h3 className="font-['Orbitron'] text-lg font-bold text-cyan-500 mb-4">📍 Адрес</h3>
                <p className={textPrimary}>г. Люберцы</p>
                <p className={textSecondary}>проспект Гагарина, дом 21</p>
              </div>
              <div className={`${bgCard} rounded-2xl p-6 border ${borderMain}`}>
                <h3 className="font-['Orbitron'] text-lg font-bold text-blue-400 mb-4">💬 Мессенджеры</h3>
                <div className="space-y-3">
                  <a href="https://t.me/ivanchay0937" target="_blank" rel="noopener noreferrer" className={`flex items-center gap-3 p-3 rounded-xl ${bgCardAlt} ${hoverBg}`}>
                    <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">💬</div>
                    <div><div className={textPrimary}>@ivanchay0937</div><div className={`${textMuted} text-xs`}>Telegram</div></div>
                  </a>
                  <a href="https://max.ru/u/f9LHodD0cOJ4WswKoZ0gfs_dwKKmUdugV1HqBTNmTiMI0AyDcJAen50E6G4" target="_blank" rel="noopener noreferrer" className={`flex items-center gap-3 p-3 rounded-xl ${bgCardAlt} ${hoverBg}`}>
                    <div className="w-10 h-10 rounded-lg bg-[#0077FF]/20 flex items-center justify-center">💬</div>
                    <div><div className={textPrimary}>Написать в Max</div><div className={`${textMuted} text-xs`}>Мессенджер</div></div>
                  </a>
                  <a href="https://t.me/protolab_3d_pechat" target="_blank" rel="noopener noreferrer" className={`flex items-center gap-3 p-3 rounded-xl ${bgCardAlt} ${hoverBg}`}>
                    <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">📢</div>
                    <div><div className={textPrimary}>@protolab_3d_pechat</div><div className={`${textMuted} text-xs`}>Наш канал</div></div>
                  </a>
                </div>
              </div>
            </div>
            <div className={`${bgCard} rounded-2xl overflow-hidden border ${borderMain}`}>
              <div className={`p-5 border-b ${borderMain}`}>
                <h3 className="font-['Orbitron'] text-lg font-bold text-cyan-500">Местоположение</h3>
                <p className={`${textMuted} text-sm mt-1`}>г. Люберцы, пр. Гагарина, д. 21</p>
              </div>
              <iframe src="https://maps.google.com/maps?q=55.691567,37.911851&z=17&output=embed" width="100%" height="320" style={{ border: 0 }} loading="lazy" title="Карта" />
            </div>
          </div>
        </div>
      </section>

      <footer className={`relative z-10 border-t ${borderMain} py-8 px-4`}>
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-gradient-to-br from-cyan-400 to-purple-600 flex items-center justify-center font-['Orbitron'] font-bold text-[8px] text-white">P3</div>
            <span className={`font-['Orbitron'] text-sm ${textMuted}`}>ProtoLab 3D</span>
          </div>
          <p className={`${textMuted} text-sm`}>© 2024 ProtoLab 3D. Люберцы, пр. Гагарина, 21</p>
        </div>
      </footer>
      <ChatBot isDark={isDark} />
    </div>
  );
}

const SectionTitle = memo(({ title, subtitle, isDark }: { title: string; subtitle: string; isDark: boolean }) => (
  <div className="text-center">
    <h2 className="font-['Orbitron'] text-3xl sm:text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">{title}</h2>
    <p className={`${isDark ? 'text-gray-400' : 'text-gray-500'} mt-2`}>{subtitle}</p>
    <div className="mt-4 mx-auto w-24 h-1 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500" />
  </div>
));

export default App;
