import { useState, useEffect, useRef, memo } from 'react';
import { getTranslation, type Language } from './i18n';

type Theme = 'dark' | 'light';

type GalleryItem = {
  src: string;
  title: string;
  subtitle: string;
};

function App() {
  const [theme, setTheme] = useState<Theme>('dark');
  const [lang, setLang] = useState<Language>('ru');
  const [scrollY, setScrollY] = useState(0);
  const [activeSection, setActiveSection] = useState('hero');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const langDropdownRef = useRef<HTMLDivElement>(null);
  const [calcMaterial, setCalcMaterial] = useState('PLA');
  const [calcWeight, setCalcWeight] = useState(50);
  const [calcComplexity, setCalcComplexity] = useState(1);
  const [calcQuantity, setCalcQuantity] = useState(1);
  const [calcUrgent, setCalcUrgent] = useState(false);

  const t = getTranslation(lang);

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
    document.documentElement.setAttribute('lang', lang);
  }, [theme, lang]);

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

  // Закрытие dropdown при клике вне его
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (langDropdownRef.current && !langDropdownRef.current.contains(event.target as Node)) {
        setLangDropdownOpen(false);
      }
    };

    if (langDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [langDropdownOpen]);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMobileMenuOpen(false);
  };

  const materials = [
    { name: 'PLA', desc: lang === 'ru' ? 'Декоративные изделия и прототипы' : lang === 'en' ? 'Decorative items and prototypes' : '装饰物品和原型', price: 8, color: '#00f0ff' },
    { name: 'PETG', desc: lang === 'ru' ? 'Прочность и универсальность' : lang === 'en' ? 'Strength and versatility' : '强度和多功能性', price: 8, color: '#7b61ff' },
    { name: 'ABS', desc: lang === 'ru' ? 'Устойчивость к температурам' : lang === 'en' ? 'Temperature resistance' : '耐温性', price: 8, color: '#ff6b6b' },
    { name: 'TPU', desc: lang === 'ru' ? 'Гибкие детали' : lang === 'en' ? 'Flexible parts' : '柔性部件', price: 15, color: '#ffd93d' },
    { name: 'PA12/PA6/PA66', desc: lang === 'ru' ? 'Инженерные материалы' : lang === 'en' ? 'Engineering materials' : '工程材料', price: 25, color: '#6bff9e' },
    { name: lang === 'ru' ? 'Карбононаполненные' : lang === 'en' ? 'Carbon-filled' : '碳纤维填充', desc: lang === 'ru' ? 'Повышенная жёсткость' : lang === 'en' ? 'Increased rigidity' : '增加刚度', price: 30, color: '#ff9e6b' },
  ];

  const printers = [
    { name: 'Bambu Lab P1S', features: lang === 'ru' ? 'Высокоскоростная печать' : lang === 'en' ? 'High-speed printing' : '高速打印', volume: '256×256×256 мм' },
    { name: 'Creality K1 Max', features: lang === 'ru' ? 'Большой объём печати' : lang === 'en' ? 'Large print volume' : '大打印体积', volume: '300×300×300 мм' },
    { name: 'Flying Bear Ghost 4', features: lang === 'ru' ? 'Закрытая камера' : lang === 'en' ? 'Enclosed chamber' : '封闭腔室', volume: '255×210×210 мм' },
    { name: 'Bambu Lab H2S', features: lang === 'ru' ? 'Премиум качество' : lang === 'en' ? 'Premium quality' : '优质质量', volume: '256×256×256 мм' },
    { name: 'Bambu Lab A1 Combo', features: lang === 'ru' ? 'AMS система' : lang === 'en' ? 'AMS system' : 'AMS系统', volume: '256×256×256 мм' },
    { name: 'Z-Bolt S300 HT', features: lang === 'ru' ? 'Печать до 500°C' : lang === 'en' ? 'Printing up to 500°C' : '打印高达500°C', volume: '300×300×400 мм' },
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
  const textMutedLight = isDark ? 'text-gray-500' : 'text-gray-400';
  const borderMain = isDark ? 'border-white/10' : 'border-gray-200';
  const hoverBg = isDark ? 'hover:bg-white/10' : 'hover:bg-gray-100';
  const navBg = isDark ? 'bg-[#0a0a1a]/90' : 'bg-white/90';

  const navItems = [
    { id: 'hero', label: t.nav.home },
    { id: 'about', label: t.nav.about },
    { id: 'services', label: t.nav.services },
    { id: 'printers', label: t.nav.equipment },
    { id: 'materials', label: t.nav.materials },
    { id: 'calculator', label: t.nav.calculator },
    { id: 'gallery', label: t.nav.works },
    { id: 'makerworld', label: t.nav.catalog },
    { id: 'location', label: t.nav.contacts },
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
              <div className="relative ml-2" ref={langDropdownRef}>
                <button 
                  onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                  className={`px-3 py-2 rounded-lg text-sm ${hoverBg} flex items-center gap-1`}
                  title={lang === 'ru' ? 'Русский' : lang === 'en' ? 'English' : '中文'}
                >
                  {lang === 'ru' ? '🇷🇺 RU' : lang === 'en' ? '🇬🇧 EN' : '🇨🇳 中文'}
                  <svg className={`w-4 h-4 transition-transform ${langDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {langDropdownOpen && (
                  <div className={`absolute right-0 mt-2 w-40 rounded-xl ${bgCard} border ${borderMain} shadow-lg overflow-hidden z-50`}>
                    <button
                      onClick={() => { setLang('ru'); setLangDropdownOpen(false); }}
                      className={`w-full px-4 py-3 text-left text-sm ${hoverBg} flex items-center gap-2 ${lang === 'ru' ? 'text-cyan-500 bg-cyan-500/10' : textMuted}`}
                    >
                      <span>🇷🇺</span>
                      <span>Русский</span>
                    </button>
                    <button
                      onClick={() => { setLang('en'); setLangDropdownOpen(false); }}
                      className={`w-full px-4 py-3 text-left text-sm ${hoverBg} flex items-center gap-2 ${lang === 'en' ? 'text-cyan-500 bg-cyan-500/10' : textMuted}`}
                    >
                      <span>🇬🇧</span>
                      <span>English</span>
                    </button>
                    <button
                      onClick={() => { setLang('zh'); setLangDropdownOpen(false); }}
                      className={`w-full px-4 py-3 text-left text-sm ${hoverBg} flex items-center gap-2 ${lang === 'zh' ? 'text-cyan-500 bg-cyan-500/10' : textMuted}`}
                    >
                      <span>🇨🇳</span>
                      <span>中文</span>
                    </button>
                  </div>
                )}
              </div>
              <button onClick={toggleTheme} className={`ml-2 p-2 rounded-lg ${hoverBg}`}>
                {isDark ? t.theme.light : t.theme.dark}
              </button>
            </div>
            <div className="flex items-center gap-2 lg:hidden">
              <div className="relative" ref={langDropdownRef}>
                <button 
                  onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                  className={`px-2 py-1 rounded-lg text-xs ${hoverBg} flex items-center gap-1`}
                >
                  {lang === 'ru' ? '🇷🇺' : lang === 'en' ? '🇬🇧' : '🇨🇳'}
                  <svg className={`w-3 h-3 transition-transform ${langDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {langDropdownOpen && (
                  <div className={`absolute right-0 mt-2 w-36 rounded-xl ${bgCard} border ${borderMain} shadow-lg overflow-hidden z-50`}>
                    <button
                      onClick={() => { setLang('ru'); setLangDropdownOpen(false); }}
                      className={`w-full px-3 py-2 text-left text-sm ${hoverBg} flex items-center gap-2 ${lang === 'ru' ? 'text-cyan-500 bg-cyan-500/10' : textMuted}`}
                    >
                      <span>🇷🇺</span>
                      <span>Русский</span>
                    </button>
                    <button
                      onClick={() => { setLang('en'); setLangDropdownOpen(false); }}
                      className={`w-full px-3 py-2 text-left text-sm ${hoverBg} flex items-center gap-2 ${lang === 'en' ? 'text-cyan-500 bg-cyan-500/10' : textMuted}`}
                    >
                      <span>🇬🇧</span>
                      <span>English</span>
                    </button>
                    <button
                      onClick={() => { setLang('zh'); setLangDropdownOpen(false); }}
                      className={`w-full px-3 py-2 text-left text-sm ${hoverBg} flex items-center gap-2 ${lang === 'zh' ? 'text-cyan-500 bg-cyan-500/10' : textMuted}`}
                    >
                      <span>🇨🇳</span>
                      <span>中文</span>
                    </button>
                  </div>
                )}
              </div>
              <button onClick={toggleTheme} className={`p-2 rounded-lg ${hoverBg}`}>{isDark ? t.theme.light : t.theme.dark}</button>
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
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500 bg-clip-text text-transparent">{t.hero.title}</span>
          </h1>
          <p className={`text-xl sm:text-2xl ${textSecondary} mb-4`}>{t.hero.subtitle}</p>
          <p className={`${textMuted} mb-10 max-w-2xl mx-auto`}>{t.hero.description}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={() => scrollTo('calculator')} className="px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold shadow-lg shadow-cyan-500/25">{t.hero.calculate}</button>
            <button onClick={() => scrollTo('about')} className={`px-8 py-4 rounded-xl border border-cyan-500/30 text-cyan-500 font-semibold ${hoverBg}`}>{t.hero.learnMore}</button>
          </div>
          <div className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto">
            <div className={`p-4 rounded-xl ${bgCard} border ${borderMain}`}>
              <div className="font-['Orbitron'] text-2xl font-bold text-cyan-500">6</div>
              <div className={`${textMuted} text-sm mt-1`}>{t.hero.printers}</div>
            </div>
            <div className={`p-4 rounded-xl ${bgCard} border ${borderMain}`}>
              <div className="font-['Orbitron'] text-2xl font-bold text-cyan-500">6+</div>
              <div className={`${textMuted} text-sm mt-1`}>{t.hero.materials}</div>
            </div>
            <div className={`p-4 rounded-xl ${bgCard} border ${borderMain}`}>
              <div className="font-['Orbitron'] text-2xl font-bold text-cyan-500">24/7</div>
              <div className={`${textMuted} text-sm mt-1`}>{t.hero.workHours}</div>
            </div>
            <div className={`p-4 rounded-xl ${bgCard} border ${borderMain}`}>
              <div className="font-['Orbitron'] text-2xl font-bold text-cyan-500">FDM</div>
              <div className={`${textMuted} text-sm mt-1`}>{t.hero.technology}</div>
            </div>
          </div>
        </div>
      </section>

      <section id="about" className="relative z-10 py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <SectionTitle title={t.about.title} subtitle={t.about.subtitle} isDark={isDark} />
          <div className="grid md:grid-cols-2 gap-8 mt-12">
            <div className={`${bgCard} rounded-2xl p-8 border ${borderMain}`}>
              <h3 className="font-['Orbitron'] text-xl font-bold text-cyan-500 mb-4">{t.about.fdmTitle}</h3>
              <p className={textSecondary}>{t.about.fdmDesc}</p>
            </div>
            <div className={`${bgCard} rounded-2xl p-8 border ${borderMain}`}>
              <h3 className="font-['Orbitron'] text-xl font-bold text-purple-400 mb-4">{t.about.printersTitle}</h3>
              <p className={textSecondary}>{t.about.printersDesc}</p>
            </div>
          </div>
        </div>
      </section>

      <section id="services" className="relative z-10 py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <SectionTitle title={t.services.title} subtitle={t.services.subtitle} isDark={isDark} />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
            <div className={`${bgCard} rounded-2xl p-6 border ${borderMain}`}>
              <div className="text-4xl mb-4">🖨</div>
              <h3 className={`font-['Orbitron'] text-lg font-bold ${textPrimary} mb-2`}>{t.services.printing}</h3>
              <p className={`${textMuted} text-sm`}>{t.services.printingDesc}</p>
              <p className="text-cyan-400 font-semibold mt-2">{t.services.printingPrice}</p>
            </div>
            <div className={`${bgCard} rounded-2xl p-6 border ${borderMain}`}>
              <div className="text-4xl mb-4">🎨</div>
              <h3 className={`font-['Orbitron'] text-lg font-bold ${textPrimary} mb-2`}>{t.services.modeling}</h3>
              <p className={`${textMuted} text-sm`}>{t.services.modelingDesc}</p>
              <p className="text-purple-400 font-semibold mt-2">{t.services.modelingPrice}</p>
            </div>
            <div className={`${bgCard} rounded-2xl p-6 border ${borderMain}`}>
              <div className="text-4xl mb-4">📡</div>
              <h3 className={`font-['Orbitron'] text-lg font-bold ${textPrimary} mb-2`}>{t.services.scanning}</h3>
              <p className={`${textMuted} text-sm`}>{t.services.scanningDesc}</p>
              <p className="text-green-400 font-semibold mt-2">{t.services.scanningPrice}</p>
            </div>
          </div>
          <div className={`mt-10 ${bgCard} rounded-2xl p-8 border ${borderMain} text-center`}>
            <h3 className={`font-['Orbitron'] text-xl font-bold ${textPrimary} mb-2`}>{t.services.discountTitle}</h3>
            <p className={textMuted}>{t.services.discountDesc}</p>
          </div>
        </div>
      </section>

      <section id="printers" className="relative z-10 py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <SectionTitle title={t.equipment.title} subtitle={t.equipment.subtitle} isDark={isDark} />
          <div className="mt-12 rounded-2xl overflow-hidden border border-white/10">
            <img src={equipmentImage} alt={t.equipment.title} loading="lazy" className="w-full h-64 object-cover" />
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {printers.map((printer, i) => (
              <div key={i} className={`${bgCard} rounded-xl p-6 border ${borderMain}`}>
                <h3 className={`font-['Orbitron'] text-sm font-bold ${textPrimary} mb-2`}>{printer.name}</h3>
                <p className={`${textMuted} text-sm mb-2`}>{printer.features}</p>
                <p className="text-xs text-cyan-500">{t.equipment.volume}: {printer.volume}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="materials" className="relative z-10 py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <SectionTitle title={t.materials.title} subtitle={t.materials.subtitle} isDark={isDark} />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
            {materials.map((mat, i) => (
              <div key={i} className={`${bgCard} rounded-xl p-6 border ${borderMain}`}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: mat.color }} />
                  <h3 className="font-['Orbitron'] text-sm font-bold" style={{ color: mat.color }}>{mat.name}</h3>
                </div>
                <p className={`${textMuted} text-sm`}>{mat.desc}</p>
                <p className="mt-4 font-['Orbitron'] text-lg font-bold" style={{ color: mat.color }}>{t.materials.from} {mat.price} ₽{t.materials.perGram}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="calculator" className="relative z-10 py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <SectionTitle title={t.calculator.title} subtitle={t.calculator.subtitle} isDark={isDark} />
          <div className={`mt-12 ${bgCard} rounded-2xl p-8 border ${borderMain}`}>
            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <label className={`block text-sm ${textMuted} mb-2 font-['Orbitron']`}>{t.calculator.material}</label>
                <select value={calcMaterial} onChange={(e) => setCalcMaterial(e.target.value)} className={`w-full ${bgCardAlt} border ${borderMain} rounded-xl px-4 py-3 ${textPrimary} text-sm`}>
                  {materials.map(m => <option key={m.name} value={m.name}>{m.name} — {m.price} ₽/г</option>)}
                </select>
              </div>
              <div>
                <label className={`block text-sm ${textMuted} mb-2 font-['Orbitron']`}>{t.calculator.weight}: {calcWeight} г</label>
                <input type="range" min="5" max="1000" value={calcWeight} onChange={(e) => setCalcWeight(Number(e.target.value))} className="w-full accent-cyan-500" />
                <input type="number" min="5" max="1000" value={calcWeight} onChange={(e) => setCalcWeight(Math.max(5, Math.min(1000, Number(e.target.value))))} className={`w-full ${bgCardAlt} border ${borderMain} rounded-xl px-4 py-2 ${textPrimary} text-sm mt-2`} />
              </div>
              <div className="sm:col-span-2">
                <label className={`block text-sm ${textMuted} mb-2 font-['Orbitron']`}>{t.calculator.complexity}</label>
                <div className="flex gap-2">
                  {[{ val: 1, label: t.calculator.simple }, { val: 1.5, label: t.calculator.medium }, { val: 2, label: t.calculator.high }].map(c => (
                    <button key={c.val} onClick={() => setCalcComplexity(c.val)} className={`flex-1 py-2 px-3 rounded-lg text-sm ${calcComplexity === c.val ? 'bg-cyan-500/20 border border-cyan-500/50 text-cyan-400' : `${bgCardAlt} border ${borderMain} ${textMuted}`}`}>{c.label}</button>
                  ))}
                </div>
              </div>
              <div>
                <label className={`block text-sm ${textMuted} mb-2 font-['Orbitron']`}>{t.calculator.quantity}</label>
                <input type="number" min="1" value={calcQuantity} onChange={(e) => setCalcQuantity(Math.max(1, Number(e.target.value)))} className={`w-full ${bgCardAlt} border ${borderMain} rounded-xl px-4 py-3 ${textPrimary} text-sm`} />
              </div>
              <div className="flex items-end">
                <div className={`flex items-center gap-3 p-3 rounded-xl ${bgCardAlt} w-full`}>
                  <button onClick={() => setCalcUrgent(!calcUrgent)} className={`w-11 h-6 rounded-full relative ${calcUrgent ? 'bg-cyan-500' : 'bg-gray-600'}`}>
                    <div className={`absolute top-1 w-4 h-4 rounded-full bg-white ${calcUrgent ? 'left-6' : 'left-1'}`} />
                  </button>
                  <span className={`${textSecondary} text-sm`}>{t.calculator.urgent}</span>
                </div>
              </div>
            </div>
            {getDiscount() > 0 && <div className="mt-4 p-3 rounded-xl bg-green-500/10 border border-green-500/20 text-center text-green-400 font-semibold">{t.calculator.discount} {getDiscount()}%!</div>}
            <div className="mt-8 p-6 rounded-xl bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-cyan-500/20 text-center">
              <p className={textMuted}>{t.calculator.estimatedCost}</p>
              <p className="font-['Orbitron'] text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">{calculatePrice().toLocaleString()} ₽</p>
            </div>
            <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
              <a href="https://t.me/ivanchay0937" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold">{t.calculator.discussTelegram}</a>
              <a href="https://max.ru/u/f9LHodD0cOJ4WswKoZ0gfs_dwKKmUdugV1HqBTNmTiMI0AyDcJAen50E6G4" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#0077FF] to-[#0055CC] text-white font-semibold">{t.calculator.discussMax}</a>
            </div>
          </div>
        </div>
      </section>

      <section id="gallery" className="relative z-10 py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <SectionTitle title={t.gallery.title} subtitle={t.gallery.subtitle} isDark={isDark} />
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
          <SectionTitle title={t.makerworld.title} subtitle={t.makerworld.subtitle} isDark={isDark} />
          <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className={`${bgCard} rounded-2xl p-8 border ${borderMain}`}>
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-orange-500/20 mb-4 text-3xl">🔍</div>
                <h3 className={`font-['Orbitron'] text-xl font-bold ${textPrimary} mb-2`}>{t.makerworld.catalogTitle}</h3>
                <p className={textMuted}>{t.makerworld.catalogDesc}</p>
              </div>
              <div className={`p-4 rounded-xl ${bgCardAlt} mb-4`}>
                <h4 className={`font-['Orbitron'] text-sm font-bold ${textPrimary} mb-3`}>{t.makerworld.howItWorks}</h4>
                <div className="space-y-2 text-sm">
                  <p className={textSecondary}><span className="text-orange-400 font-bold">1.</span> {t.makerworld.step1}</p>
                  <p className={textSecondary}><span className="text-orange-400 font-bold">2.</span> {t.makerworld.step2}</p>
                  <p className={textSecondary}><span className="text-orange-400 font-bold">3.</span> {t.makerworld.step3}</p>
                </div>
              </div>
              <a href="https://makerworld.com/ru" target="_blank" rel="noopener noreferrer" className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-red-600 text-white font-semibold">{t.makerworld.openCatalog}</a>
              <p className={`${textMutedLight} text-xs text-center mt-4`}>{t.makerworld.freeModels}</p>
            </div>
            <div className={`${bgCard} rounded-2xl p-8 border ${borderMain}`}>
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-green-500/20 mb-4 text-3xl">📸</div>
                <h3 className={`font-['Orbitron'] text-xl font-bold ${textPrimary} mb-2`}>{t.makerworld.generateTitle}</h3>
                <p className={textMuted}>{t.makerworld.generateDesc}</p>
              </div>
              <div className={`p-4 rounded-xl ${bgCardAlt} mb-4`}>
                <h4 className={`font-['Orbitron'] text-sm font-bold ${textPrimary} mb-3`}>{t.makerworld.howItWorks}</h4>
                <div className="space-y-2 text-sm">
                  <p className={textSecondary}><span className="text-green-400 font-bold">1.</span> {t.makerworld.genStep1}</p>
                  <p className={textSecondary}><span className="text-green-400 font-bold">2.</span> {t.makerworld.genStep2}</p>
                  <p className={textSecondary}><span className="text-green-400 font-bold">3.</span> {t.makerworld.genStep3}</p>
                </div>
              </div>
              <a href="https://makerworld.com/ru/makerlab" target="_blank" rel="noopener noreferrer" className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold">{t.makerworld.openMakerLab}</a>
              <p className={`${textMutedLight} text-xs text-center mt-4`}>{t.makerworld.freeTool}</p>
            </div>
          </div>
        </div>
      </section>

      <section id="location" className="relative z-10 py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <SectionTitle title={t.contacts.title} subtitle={t.contacts.subtitle} isDark={isDark} />
          <div className="grid md:grid-cols-2 gap-8 mt-12">
            <div className="space-y-6">
              <div className={`${bgCard} rounded-2xl p-6 border ${borderMain}`}>
                <h3 className="font-['Orbitron'] text-lg font-bold text-cyan-500 mb-4">{t.contacts.address}</h3>
                <p className={textPrimary}>{t.contacts.city}</p>
                <p className={textSecondary}>{t.contacts.street}</p>
              </div>
              <div className={`${bgCard} rounded-2xl p-6 border ${borderMain}`}>
                <h3 className="font-['Orbitron'] text-lg font-bold text-blue-400 mb-4">{t.contacts.messengers}</h3>
                <div className="space-y-3">
                  <a href="https://t.me/ivanchay0937" target="_blank" rel="noopener noreferrer" className={`flex items-center gap-3 p-3 rounded-xl ${bgCardAlt} ${hoverBg}`}>
                    <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">💬</div>
                    <div><div className={textPrimary}>@ivanchay0937</div><div className={`${textMuted} text-xs`}>{t.contacts.telegram}</div></div>
                  </a>
                  <a href="https://max.ru/u/f9LHodD0cOJ4WswKoZ0gfs_dwKKmUdugV1HqBTNmTiMI0AyDcJAen50E6G4" target="_blank" rel="noopener noreferrer" className={`flex items-center gap-3 p-3 rounded-xl ${bgCardAlt} ${hoverBg}`}>
                    <div className="w-10 h-10 rounded-lg bg-[#0077FF]/20 flex items-center justify-center">💬</div>
                    <div><div className={textPrimary}>{lang === 'ru' ? 'Написать в Max' : lang === 'en' ? 'Write in Max' : '在Max中写信'}</div><div className={`${textMuted} text-xs`}>{t.contacts.max}</div></div>
                  </a>
                  <a href="https://t.me/protolab_3d_pechat" target="_blank" rel="noopener noreferrer" className={`flex items-center gap-3 p-3 rounded-xl ${bgCardAlt} ${hoverBg}`}>
                    <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">📢</div>
                    <div><div className={textPrimary}>@protolab_3d_pechat</div><div className={`${textMuted} text-xs`}>{t.contacts.channel}</div></div>
                  </a>
                </div>
              </div>
            </div>
            <div className={`${bgCard} rounded-2xl overflow-hidden border ${borderMain}`}>
              <div className={`p-5 border-b ${borderMain}`}>
                <h3 className="font-['Orbitron'] text-lg font-bold text-cyan-500">{t.contacts.location}</h3>
                <p className={`${textMuted} text-sm mt-1`}>{t.contacts.city}, {t.contacts.street}</p>
              </div>
              <iframe src="https://maps.google.com/maps?q=55.691567,37.911851&z=17&output=embed" width="100%" height="320" style={{ border: 0 }} loading="lazy" title={t.contacts.location} />
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
          <p className={`${textMuted} text-sm`}>{t.footer.rights}</p>
        </div>
      </footer>
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
