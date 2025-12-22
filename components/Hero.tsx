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
    <section id={SectionId.HERO} className="relative min-h-screen flex items-center justify-center overflow-hidden bg-slate-50" style={{ zIndex: 'auto' }}>
      {/* Three.js Interactive Background */}
      <ThreeBackground />

      <div className="relative z-10 text-center px-4 sm:px-6 max-w-4xl mx-auto select-none pt-16 sm:pt-20 pb-10 pointer-events-auto">
        <div className={`transition-all duration-1000 transform -mt-8 sm:-mt-12 ${loaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <h2 className="text-blue-800 font-bold tracking-[0.15em] sm:tracking-[0.3em] text-xs sm:text-sm md:text-base mb-4 sm:mb-6 uppercase px-2">
            南通蓝印花布 · 文化传承 · 全球活化
          </h2>
          <h1 className="text-3xl sm:text-5xl md:text-8xl font-bold text-slate-900 mb-4 sm:mb-6 leading-tight font-serif">
            {t('brand.name').split('：')[0]}：<span className="text-blue-900">{t('brand.name').split('：')[1]?.split('全球')[0]}</span><br/>
            <span className="text-2xl sm:text-4xl md:text-6xl">{t('brand.name').includes('全球') ? t('brand.name').split('全球')[1] : 'Global Activation'}</span>
          </h1>
          <p className="text-lg sm:text-xl md:text-3xl text-blue-800 mb-3 sm:mb-4 max-w-3xl mx-auto leading-relaxed font-serif font-bold px-2">
            {t('brand.tagline')}
          </p>
          <p className="text-sm sm:text-base md:text-lg text-slate-600 mb-8 sm:mb-12 max-w-2xl mx-auto leading-relaxed px-2">
            {t('brand.subtitle')}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-6 justify-center items-center px-4">
            <button 
              onClick={() => document.getElementById(SectionId.DASHBOARD)?.scrollIntoView({behavior: 'smooth'})} 
              className="w-full sm:w-auto bg-[#1e3a8a] text-slate-50 px-8 sm:px-10 py-3 sm:py-4 hover:bg-[#3b82f6] active:bg-[#1e40af] transition-colors duration-300 tracking-widest text-base sm:text-lg font-bold shadow-lg hover:shadow-blue-900/20"
            >
              {t('hero.cta1')}
            </button>
            <button 
              onClick={() => document.getElementById(SectionId.AIGC)?.scrollIntoView({behavior: 'smooth'})} 
              className="w-full sm:w-auto border-2 border-[#1e3a8a] text-[#1e3a8a] px-8 sm:px-10 py-3 sm:py-4 hover:bg-blue-50 active:bg-blue-100 transition-colors duration-300 tracking-widest text-base sm:text-lg font-bold"
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