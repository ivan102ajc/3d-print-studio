import { useState, useEffect, useRef } from 'react';

function App() {
  const [scrollY, setScrollY] = useState(0);
  const [activeSection, setActiveSection] = useState('hero');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [calcMaterial, setCalcMaterial] = useState('PLA');
  const [calcWeight, setCalcWeight] = useState(50);
  const [calcComplexity, setCalcComplexity] = useState(1);
  const [calcQuantity, setCalcQuantity] = useState(1);
  const [calcUrgent, setCalcUrgent] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
      const sections = ['hero', 'about', 'printers', 'materials', 'calculator', 'gallery', 'location', 'contact'];
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
    { name: 'PETG', desc: 'Прочность и универсальность', price: 10, color: '#7b61ff' },
    { name: 'ABS', desc: 'Устойчивость к температурам', price: 12, color: '#ff6b6b' },
    { name: 'TPU', desc: 'Гибкие детали', price: 15, color: '#ffd93d' },
    { name: 'PA12/PA6/PA66', desc: 'Инженерные материалы', price: 25, color: '#6bff9e' },
    { name: 'Карбононаполненные', desc: 'Повышенная жёсткость и прочность', price: 30, color: '#ff9e6b' },
  ];

  const printers = [
    { name: 'Bambu Lab P1S', features: 'Высокоскоростная печать, автоматическая калибровка', volume: '256×256×256 мм', icon: '🖨' },
    { name: 'Creality K1 Max', features: 'Большой объём печати, высокая скорость', volume: '300×300×300 мм', icon: '🖨' },
    { name: 'Flying Bear Ghost 4', features: 'Закрытая камера, стабильная печать', volume: '255×210×210 мм', icon: '🖨' },
    { name: 'Bambu Lab H2S', features: 'Премиум качество, мультиматериал', volume: '256×256×256 мм', icon: '🖨' },
    { name: 'Bambu Lab A1 Combo', features: 'AMS система, быстрая смена цвета', volume: '256×256×256 мм', icon: '🖨' },
    { name: 'Z-Bolt S300 HT', features: 'Высокотемпературная печать до 500°C', volume: '300×300×400 мм', icon: '🖨' },
  ];

  const calculatePrice = () => {
    const material = materials.find(m => m.name === calcMaterial);
    if (!material) return 0;
    let price = material.price * calcWeight * calcComplexity * calcQuantity;
    if (calcUrgent) price *= 1.5;
    return Math.round(price);
  };

  const navItems = [
    { id: 'hero', label: 'Главная' },
    { id: 'about', label: 'О нас' },
    { id: 'printers', label: 'Оборудование' },
    { id: 'materials', label: 'Материалы' },
    { id: 'calculator', label: 'Калькулятор' },
    { id: 'gallery', label: 'Работы' },
    { id: 'location', label: 'Контакты' },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a1a] text-white font-['Inter'] overflow-x-hidden">
      {/* Animated background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a1a] via-[#0d1b2a] to-[#1a0a2e]" />
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: `radial-gradient(circle at 20% 50%, rgba(0, 240, 255, 0.15) 0%, transparent 50%),
                           radial-gradient(circle at 80% 20%, rgba(123, 97, 255, 0.15) 0%, transparent 50%),
                           radial-gradient(circle at 50% 80%, rgba(255, 107, 107, 0.1) 0%, transparent 50%)`
        }} />
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `linear-gradient(rgba(0,240,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(0,240,255,0.3) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }} />
      </div>

      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrollY > 50 ? 'bg-[#0a0a1a]/90 backdrop-blur-xl border-b border-cyan-500/20' : ''}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-purple-600 flex items-center justify-center font-['Orbitron'] font-bold text-sm">P3</div>
              <span className="font-['Orbitron'] font-bold text-lg bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">ProtoLab 3D</span>
            </div>
            
            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-1">
              {navItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => scrollTo(item.id)}
                  className={`px-3 py-2 rounded-lg text-sm transition-all duration-300 ${activeSection === item.id ? 'text-cyan-400 bg-cyan-400/10' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* Mobile menu button */}
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden text-white p-2">
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

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#0a0a1a]/95 backdrop-blur-xl border-b border-cyan-500/20">
            <div className="px-4 py-3 space-y-1">
              {navItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => scrollTo(item.id)}
                  className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${activeSection === item.id ? 'text-cyan-400 bg-cyan-400/10' : 'text-gray-400 hover:text-white'}`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section id="hero" className="relative z-10 min-h-screen flex items-center justify-center px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-full border border-cyan-500/30 bg-cyan-500/5">
            <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-cyan-400 text-sm font-['Orbitron']">FDM 3D-ПЕЧАТЬ</span>
          </div>
          <h1 className="font-['Orbitron'] text-4xl sm:text-5xl md:text-7xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500 bg-clip-text text-transparent">
              ProtoLab 3D
            </span>
          </h1>
          <p className="text-xl sm:text-2xl text-gray-300 mb-4 max-w-3xl mx-auto">
            Профессиональная 3D-печать и моделирование
          </p>
          <p className="text-gray-400 mb-10 max-w-2xl mx-auto text-lg">
            От прототипа до серии. 6 принтеров, 6+ материалов, неограниченные возможности.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={() => scrollTo('calculator')} className="px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold hover:from-cyan-400 hover:to-blue-500 transition-all duration-300 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:scale-105">
              Рассчитать стоимость
            </button>
            <button onClick={() => scrollTo('about')} className="px-8 py-4 rounded-xl border border-cyan-500/30 text-cyan-400 font-semibold hover:bg-cyan-500/10 transition-all duration-300 hover:scale-105">
              Узнать больше
            </button>
          </div>
          
          {/* Stats */}
          <div className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {[
              { value: '6', label: 'Принтеров' },
              { value: '6+', label: 'Материалов' },
              { value: '24/7', label: 'Работаем' },
              { value: 'FDM', label: 'Технология' },
            ].map((stat, i) => (
              <div key={i} className="p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
                <div className="font-['Orbitron'] text-2xl font-bold text-cyan-400">{stat.value}</div>
                <div className="text-gray-400 text-sm mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <svg className="w-6 h-6 text-cyan-400/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="relative z-10 py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <SectionTitle title="О нас" subtitle="Что мы делаем и для кого" />
          
          <div className="grid md:grid-cols-2 gap-8 mt-12">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-2xl opacity-20 group-hover:opacity-40 transition-opacity blur" />
              <div className="relative bg-[#111827] rounded-2xl p-8 border border-white/10">
                <h3 className="font-['Orbitron'] text-xl font-bold text-cyan-400 mb-4">Технология FDM</h3>
                <p className="text-gray-300 leading-relaxed mb-6">
                  Послойная печать пластиком — надёжная и универсальная технология, 
                  подходящая для широкого спектра задач.
                </p>
                <div className="space-y-3">
                  {['Детали взамен сломанных', 'Корпуса и крепления', 'Прототипы', 'DIY-проекты', 'Электроника', 'Функциональные изделия', 'Небольшие серии'].map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-cyan-500/20 flex items-center justify-center flex-shrink-0">
                        <svg className="w-3 h-3 text-cyan-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="text-gray-300">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl opacity-20 group-hover:opacity-40 transition-opacity blur" />
              <div className="relative bg-[#111827] rounded-2xl p-8 border border-white/10">
                <h3 className="font-['Orbitron'] text-xl font-bold text-purple-400 mb-4">Почему несколько принтеров?</h3>
                <div className="space-y-4">
                  {[
                    { icon: '⚡', text: 'Быстрее выполнение заказов' },
                    { icon: '🕐', text: 'Меньше ожидания' },
                    { icon: '🎨', text: 'Печать разными материалами одновременно' },
                    { icon: '📦', text: 'Изготовление от 1 детали до серии' },
                    { icon: '🔧', text: 'Подбор оборудования под задачу' },
                    { icon: '📐', text: 'Разные объёмы печати' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-4 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
                      <span className="text-2xl">{item.icon}</span>
                      <span className="text-gray-300">{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Printers Section */}
      <section id="printers" className="relative z-10 py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <SectionTitle title="Наше оборудование" subtitle="6 принтеров для любых задач" />
          
          <div className="mt-12 relative rounded-2xl overflow-hidden border border-white/10">
            <img 
              src="https://image.qwenlm.ai/generated-images/e8aad0eb-7b20-4090-b283-fb7428f71b9f/_result.png" 
              alt="Наша мастерская 3D-печати" 
              className="w-full h-48 sm:h-64 object-cover opacity-60"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a1a] via-transparent to-transparent" />
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {printers.map((printer, i) => (
              <div key={i} className="group relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-xl opacity-0 group-hover:opacity-50 transition-opacity duration-500 blur-sm" />
                <div className="relative bg-[#111827] rounded-xl p-6 border border-white/10 hover:border-cyan-500/30 transition-all duration-300">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center text-xl">
                      {printer.icon}
                    </div>
                    <h3 className="font-['Orbitron'] text-sm font-bold text-white">{printer.name}</h3>
                  </div>
                  <p className="text-gray-400 text-sm mb-2">{printer.features}</p>
                  <div className="flex items-center gap-2 text-xs text-cyan-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                    </svg>
                    <span>Объём: {printer.volume}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Materials Section */}
      <section id="materials" className="relative z-10 py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <SectionTitle title="Материалы" subtitle="Подбираем пластик под вашу задачу" />
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
            {materials.map((mat, i) => (
              <div key={i} className="group relative">
                <div className="absolute -inset-0.5 rounded-xl opacity-20 group-hover:opacity-40 transition-opacity blur-sm" style={{ background: `linear-gradient(135deg, ${mat.color}, transparent)` }} />
                <div className="relative bg-[#111827] rounded-xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: mat.color }} />
                    <h3 className="font-['Orbitron'] text-sm font-bold" style={{ color: mat.color }}>{mat.name}</h3>
                  </div>
                  <p className="text-gray-400 text-sm">{mat.desc}</p>
                  <div className="mt-4 pt-4 border-t border-white/5">
                    <span className="text-xs text-gray-500">от</span>
                    <span className="font-['Orbitron'] text-lg font-bold ml-1" style={{ color: mat.color }}>{mat.price} ₽</span>
                    <span className="text-xs text-gray-500 ml-1">/ грамм</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Calculator Section */}
      <section id="calculator" className="relative z-10 py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <SectionTitle title="Калькулятор стоимости" subtitle="Рассчитайте примерную стоимость заказа" />
          
          <div className="mt-12 relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-2xl opacity-20 blur" />
            <div className="relative bg-[#111827] rounded-2xl p-6 sm:p-8 border border-white/10">
              <div className="grid sm:grid-cols-2 gap-6">
                {/* Material */}
                <div>
                  <label className="block text-sm text-gray-400 mb-2 font-['Orbitron']">Материал</label>
                  <select 
                    value={calcMaterial} 
                    onChange={(e) => setCalcMaterial(e.target.value)}
                    className="w-full bg-[#0a0a1a] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-cyan-500/50 focus:outline-none transition-colors"
                  >
                    {materials.map(m => (
                      <option key={m.name} value={m.name}>{m.name} — {m.price} ₽/г</option>
                    ))}
                  </select>
                </div>

                {/* Weight */}
                <div>
                  <label className="block text-sm text-gray-400 mb-2 font-['Orbitron']">Вес (грамм)</label>
                  <input 
                    type="range" 
                    min="5" 
                    max="1000" 
                    value={calcWeight}
                    onChange={(e) => setCalcWeight(Number(e.target.value))}
                    className="w-full accent-cyan-500"
                  />
                  <div className="text-cyan-400 font-['Orbitron'] text-lg mt-1">{calcWeight} г</div>
                </div>

                {/* Complexity */}
                <div>
                  <label className="block text-sm text-gray-400 mb-2 font-['Orbitron']">Сложность</label>
                  <div className="flex gap-2">
                    {[
                      { val: 1, label: 'Простая' },
                      { val: 1.5, label: 'Средняя' },
                      { val: 2, label: 'Высокая' },
                    ].map(c => (
                      <button
                        key={c.val}
                        onClick={() => setCalcComplexity(c.val)}
                        className={`flex-1 py-2 px-3 rounded-lg text-sm transition-all ${calcComplexity === c.val ? 'bg-cyan-500/20 border border-cyan-500/50 text-cyan-400' : 'bg-white/5 border border-white/10 text-gray-400 hover:border-white/20'}`}
                      >
                        {c.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quantity */}
                <div>
                  <label className="block text-sm text-gray-400 mb-2 font-['Orbitron']">Количество</label>
                  <input 
                    type="number" 
                    min="1" 
                    max="1000"
                    value={calcQuantity}
                    onChange={(e) => setCalcQuantity(Math.max(1, Number(e.target.value)))}
                    className="w-full bg-[#0a0a1a] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-cyan-500/50 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Urgent */}
              <div className="mt-6 flex items-center gap-3">
                <button
                  onClick={() => setCalcUrgent(!calcUrgent)}
                  className={`w-12 h-6 rounded-full transition-all relative ${calcUrgent ? 'bg-cyan-500' : 'bg-white/10'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${calcUrgent ? 'left-7' : 'left-1'}`} />
                </button>
                <span className="text-gray-300 text-sm">Срочный заказ (+50%)</span>
              </div>

              {/* Result */}
              <div className="mt-8 p-6 rounded-xl bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-cyan-500/20">
                <div className="text-center">
                  <div className="text-gray-400 text-sm mb-1">Примерная стоимость</div>
                  <div className="font-['Orbitron'] text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                    {calculatePrice().toLocaleString()} ₽
                  </div>
                  <div className="text-gray-500 text-xs mt-2">* Точная стоимость после согласования с менеджером</div>
                </div>
              </div>

              <div className="mt-6 text-center">
                <a 
                  href="https://t.me/ivanchay0937" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold hover:from-cyan-400 hover:to-blue-500 transition-all duration-300 shadow-lg shadow-cyan-500/25"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/>
                  </svg>
                  Обсудить заказ в Telegram
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section id="gallery" className="relative z-10 py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <SectionTitle title="Наши работы" subtitle="Примеры выполненных проектов" />
          
          <div className="grid sm:grid-cols-2 gap-6 mt-12">
            <div className="relative group rounded-2xl overflow-hidden border border-white/10 hover:border-cyan-500/30 transition-all duration-300">
              <img 
                src="https://image.qwenlm.ai/generated-images/4190945e-14a9-4645-a92b-c86338e701cd/_result.png" 
                alt="3D печать на Bambu Lab P1S" 
                className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a1a] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                <p className="text-white font-['Orbitron'] text-sm">Процесс печати</p>
                <p className="text-gray-400 text-xs">Bambu Lab P1S • PETG</p>
              </div>
            </div>
            
            <div className="relative group rounded-2xl overflow-hidden border border-white/10 hover:border-purple-500/30 transition-all duration-300">
              <img 
                src="https://image.qwenlm.ai/generated-images/00f58d60-985a-4dd4-91e2-a2c2e7af764f/_result.png" 
                alt="Напечатанные изделия" 
                className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a1a] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                <p className="text-white font-['Orbitron'] text-sm">Готовые изделия</p>
                <p className="text-gray-400 text-xs">Различные материалы</p>
              </div>
            </div>

            <div className="relative group rounded-2xl overflow-hidden border border-white/10 hover:border-cyan-500/30 transition-all duration-300 sm:col-span-2">
              <img 
                src="https://image.qwenlm.ai/generated-images/e8aad0eb-7b20-4090-b283-fb7428f71b9f/_result.png" 
                alt="Мастерская 3D-печати" 
                className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a1a] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                <p className="text-white font-['Orbitron'] text-sm">Наша мастерская</p>
                <p className="text-gray-400 text-xs">6 принтеров работают одновременно</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Location & Contact Section */}
      <section id="location" className="relative z-10 py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <SectionTitle title="Контакты" subtitle="Свяжитесь с нами любым удобным способом" />
          
          <div className="grid md:grid-cols-2 gap-8 mt-12">
            {/* Contact info */}
            <div className="space-y-6">
              <div className="bg-[#111827] rounded-2xl p-6 border border-white/10">
                <h3 className="font-['Orbitron'] text-lg font-bold text-cyan-400 mb-4">Telegram</h3>
                <a href="https://t.me/ivanchay0937" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                    <svg className="w-5 h-5 text-blue-400" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/>
                    </svg>
                  </div>
                  <div>
                    <div className="text-white font-medium">@ivanchay0937</div>
                    <div className="text-gray-400 text-sm">Личные сообщения</div>
                  </div>
                </a>
                <a href="https://t.me/protolab_3d_pechat" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors mt-3">
                  <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                    <svg className="w-5 h-5 text-purple-400" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/>
                    </svg>
                  </div>
                  <div>
                    <div className="text-white font-medium">@protolab_3d_pechat</div>
                    <div className="text-gray-400 text-sm">Наш канал</div>
                  </div>
                </a>
              </div>

              <div className="bg-[#111827] rounded-2xl p-6 border border-white/10">
                <h3 className="font-['Orbitron'] text-lg font-bold text-purple-400 mb-4">Сайт</h3>
                <a href="https://sites.google.com/view/protolab-3d/главная-страница" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
                  <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                    <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-white font-medium">protolab-3d</div>
                    <div className="text-gray-400 text-sm">Google Sites</div>
                  </div>
                </a>
              </div>

              <div className="bg-[#111827] rounded-2xl p-6 border border-white/10">
                <h3 className="font-['Orbitron'] text-lg font-bold text-yellow-400 mb-4">Условия работы</h3>
                <div className="space-y-3 text-gray-300 text-sm">
                  <div className="flex items-start gap-2">
                    <span className="text-cyan-400">→</span>
                    <span>Принимаем заказы от 1 штуки</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-cyan-400">→</span>
                    <span>Срок выполнения: от 1 дня (зависит от сложности)</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-cyan-400">→</span>
                    <span>Возможна помощь с 3D-моделированием</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-cyan-400">→</span>
                    <span>Отправка по всей России</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-cyan-400">→</span>
                    <span>Оплата: перевод / наличные</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Map */}
            <div className="bg-[#111827] rounded-2xl overflow-hidden border border-white/10 h-fit">
              <div className="p-4 border-b border-white/10">
                <h3 className="font-['Orbitron'] text-lg font-bold text-cyan-400">Местоположение</h3>
                <p className="text-gray-400 text-sm mt-1">Работаем удалённо, принимаем заказы онлайн</p>
              </div>
              <div className="relative h-80 bg-[#0d1b2a]">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2000000!2d37.6173!3d55.7558!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNTXCsDQ1JzIwLjkiTiAzN8KwMzcnMDIuMyJF!5e0!3m2!1sru!2sru!4v1"
                  width="100%" 
                  height="100%" 
                  style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg) brightness(0.8) contrast(1.2)' }}
                  allowFullScreen 
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Карта"
                />
                <div className="absolute inset-0 pointer-events-none border-2 border-cyan-500/20 rounded-none" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 py-8 px-4">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-gradient-to-br from-cyan-400 to-purple-600 flex items-center justify-center font-['Orbitron'] font-bold text-[8px]">P3</div>
            <span className="font-['Orbitron'] text-sm text-gray-400">ProtoLab 3D</span>
          </div>
          <p className="text-gray-500 text-sm">© 2024 ProtoLab 3D. Все права защищены.</p>
          <div className="flex gap-4">
            <a href="https://t.me/protolab_3d_pechat" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-cyan-400 transition-colors">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/>
              </svg>
            </a>
          </div>
        </div>
      </footer>

      {/* Floating particles */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-cyan-400/30 animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${5 + Math.random() * 10}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}

function SectionTitle({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="text-center">
      <h2 className="font-['Orbitron'] text-3xl sm:text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
        {title}
      </h2>
      <p className="text-gray-400 mt-2">{subtitle}</p>
      <div className="mt-4 mx-auto w-24 h-1 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500" />
    </div>
  );
}

export default App;
