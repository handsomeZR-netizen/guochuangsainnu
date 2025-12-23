import React, { useEffect, useState } from 'react';
import { ArrowDown } from 'lucide-react';
import { SectionId } from '../types';
import ThreeBackground from './ThreeBackground';
import { useTranslation } from 'react-i18next';

const Hero: React.FC = () => {
  const [loaded, setLoaded] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    setLoaded(true);
  }, []);

  return (
    <section id={SectionId.HERO} className="relative min-h-screen flex items-center justify-center overflow-hidden bg-slate-50 pt-20 sm:pt-24" style={{ zIndex: 'auto' }}>
      {/* Three.js Interactive Background */}
      <ThreeBackground />

      <div className="relative z-10 px-4 sm:px-6 max-w-3xl mx-auto select-none pb-10 pointer-events-auto">
        {/* 半透明承载卡片 - 内容左对齐 */}
        <div 
          className={`transition-all duration-1000 transform ${loaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
          style={{
            background: 'rgba(255, 255, 255, 0.6)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            padding: '40px 32px',
            borderRadius: '16px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
          }}
        >
          {/* 1. 项目定位小字 - 弱化处理 */}
          <p className="text-xs sm:text-sm tracking-[0.2em] mb-6 sm:mb-8" style={{ color: '#64748b' }}>
            南通蓝印花布 · 文化传承 · 全球活化
          </p>

          {/* 2. 主标题 - 稳定断行 */}
          <h1 
            className="font-bold mb-2 font-serif"
            style={{ 
              color: '#0B1A33',
              fontSize: 'clamp(32px, 6vw, 52px)',
              lineHeight: '1.22',
              letterSpacing: '0.02em',
            }}
          >
            墨韵智汇
          </h1>
          <h1 
            className="font-bold mb-5 sm:mb-6 font-serif"
            style={{ 
              color: '#1E4FB3',
              fontSize: 'clamp(32px, 6vw, 52px)',
              lineHeight: '1.22',
              letterSpacing: '0.02em',
            }}
          >
            南通蓝印花布
          </h1>

          {/* 3. 标签化「活化方案」 */}
          <span 
            className="inline-block px-4 py-1.5 text-xs sm:text-sm font-medium rounded-full mb-5 sm:mb-6"
            style={{ 
              color: '#1e3a8a',
              border: '1.5px solid #93c5fd',
              background: 'rgba(219, 234, 254, 0.5)',
            }}
          >
            非遗活化方案
          </span>

          {/* 4. 一句话价值主张 - 情绪锚点 */}
          <p 
            className="text-base sm:text-lg md:text-xl mb-3 leading-relaxed font-serif font-semibold"
            style={{ color: '#1e40af' }}
          >
            {t('brand.tagline')}
          </p>

          {/* 5. 次级说明 - 弱化余韵 */}
          <p 
            className="text-sm mb-8 sm:mb-10 leading-relaxed"
            style={{ color: '#94a3b8' }}
          >
            {t('brand.subtitle')}
          </p>
          
          {/* 6. 按钮组 - 主次分明 */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <button 
              onClick={() => document.getElementById(SectionId.DASHBOARD)?.scrollIntoView({behavior: 'smooth'})} 
              className="w-full sm:w-auto bg-[#1e3a8a] text-white px-10 sm:px-12 py-3.5 hover:bg-[#1e40af] active:bg-[#172554] transition-colors duration-300 tracking-wider text-sm sm:text-base font-bold shadow-lg hover:shadow-xl rounded-lg"
            >
              {t('hero.cta1')}
            </button>
            <button 
              onClick={() => document.getElementById(SectionId.AIGC)?.scrollIntoView({behavior: 'smooth'})} 
              className="w-full sm:w-auto border border-[#1e3a8a]/40 text-[#1e3a8a] bg-white/60 px-8 sm:px-10 py-3.5 hover:bg-white hover:border-[#1e3a8a]/60 hover:shadow-md transition-all duration-300 tracking-wider text-sm sm:text-base font-medium rounded-lg"
            >
              {t('hero.cta2')}
            </button>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce text-[#3b82f6]/50">
        <ArrowDown size={32} />
      </div>
    </section>
  );
};

export default Hero;