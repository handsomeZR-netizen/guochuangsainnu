import React, { useState, useEffect } from 'react';
import { Menu, X, ShoppingBag } from 'lucide-react';
import { SectionId } from '../types';
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from './LanguageSwitcher';

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id: SectionId) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false);
    }
  };

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${isScrolled ? 'bg-slate-50/95 backdrop-blur-md shadow-md py-3' : 'bg-slate-50/80 backdrop-blur-sm py-5'}`}>
      <div className="container mx-auto px-6 flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => scrollTo(SectionId.HERO)}>
            <div className="w-8 h-8 bg-[#1e3a8a] rounded-full flex items-center justify-center overflow-hidden relative shadow-lg">
                <div className="absolute w-full h-full bg-[#3b82f6] animate-pulse opacity-60 blur-sm"></div>
            </div>
            <div className="flex flex-col">
              <span className={`text-xl font-bold tracking-widest ${isScrolled ? 'text-slate-900' : 'text-slate-900'} leading-none`}>
                墨韵智汇
              </span>
              <span className="text-[0.6rem] uppercase tracking-wider text-[#1e3a8a]">南通蓝印花布</span>
            </div>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-10">
          {[
            { id: SectionId.DASHBOARD, label: t('nav.dashboard') },
            { id: SectionId.PRODUCTS, label: t('nav.products') },
            { id: SectionId.AIGC, label: t('nav.aigc') },
          ].map((item) => (
            <button 
              key={item.id} 
              onClick={() => scrollTo(item.id)}
              className="text-slate-600 hover:text-[#1e3a8a] transition-colors text-sm font-bold tracking-widest font-serif"
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Actions */}
        <div className="hidden md:flex items-center gap-6">
          <LanguageSwitcher />
          <button className="relative text-slate-600 hover:text-[#1e3a8a] transition-colors">
            <ShoppingBag size={20} />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-[#3b82f6] rounded-full"></span>
          </button>
        </div>

        {/* Mobile Menu Toggle */}
        <button className="md:hidden text-slate-800" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-slate-50 border-t border-slate-200 py-4 px-6 flex flex-col gap-4 shadow-lg">
           {[
            { id: SectionId.DASHBOARD, label: t('nav.dashboard') },
            { id: SectionId.PRODUCTS, label: t('nav.products') },
            { id: SectionId.AIGC, label: t('nav.aigc') },
          ].map((item) => (
            <button 
              key={item.id} 
              onClick={() => scrollTo(item.id)}
              className="text-left text-slate-600 hover:text-[#1e3a8a] py-2 font-serif font-bold"
            >
              {item.label}
            </button>
          ))}
          <div className="pt-2 border-t border-slate-200">
            <LanguageSwitcher />
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;