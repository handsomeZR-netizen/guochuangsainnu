import React, { useState, useEffect } from 'react';
import { Menu, X, ShoppingBag, User, Info } from 'lucide-react';
import { SectionId } from '../types';
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from './LanguageSwitcher';
import AboutUs from './AboutUs';
import ShoppingCart from './ShoppingCart';
import Login from './Login';

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const { t } = useTranslation();

  const handleLogin = (name: string) => {
    setIsLoggedIn(true);
    setUsername(name);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername('');
  };

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
          <button 
            onClick={() => setIsAboutOpen(true)}
            className="text-slate-600 hover:text-[#1e3a8a] transition-colors text-sm font-bold tracking-widest font-serif"
          >
            关于我们
          </button>
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
          <button 
            onClick={() => setIsCartOpen(true)}
            className="relative text-slate-600 hover:text-[#1e3a8a] transition-colors"
          >
            <ShoppingBag size={20} />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-[#3b82f6] rounded-full"></span>
          </button>
          {isLoggedIn ? (
            <div className="relative group">
              <button className="flex items-center gap-2 text-slate-600 hover:text-[#1e3a8a] transition-colors">
                <User size={20} />
                <span className="text-sm font-bold">{username}</span>
              </button>
              <div className="absolute right-0 top-full mt-2 bg-white shadow-lg rounded-lg py-2 w-40 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                <button className="w-full text-left px-4 py-2 hover:bg-slate-50 text-sm">个人中心</button>
                <button className="w-full text-left px-4 py-2 hover:bg-slate-50 text-sm">我的订单</button>
                <button 
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 hover:bg-slate-50 text-sm text-red-600"
                >
                  退出登录
                </button>
              </div>
            </div>
          ) : (
            <button 
              onClick={() => setIsLoginOpen(true)}
              className="flex items-center gap-2 bg-[#1e3a8a] hover:bg-[#1e40af] text-white px-4 py-2 rounded-lg transition-colors text-sm font-bold"
            >
              <User size={18} />
              登录
            </button>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button className="md:hidden text-slate-800" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-slate-50 border-t border-slate-200 py-4 px-6 flex flex-col gap-4 shadow-lg">
          <button 
            onClick={() => {
              setIsAboutOpen(true);
              setIsMenuOpen(false);
            }}
            className="text-left text-slate-600 hover:text-[#1e3a8a] py-2 font-serif font-bold"
          >
            关于我们
          </button>
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
          <div className="pt-2 border-t border-slate-200 space-y-3">
            <LanguageSwitcher />
            {!isLoggedIn && (
              <button 
                onClick={() => {
                  setIsLoginOpen(true);
                  setIsMenuOpen(false);
                }}
                className="w-full bg-[#1e3a8a] text-white py-2 rounded-lg font-bold"
              >
                登录
              </button>
            )}
          </div>
        </div>
      )}

      {/* Modals */}
      <AboutUs isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} />
      <ShoppingCart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <Login isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} onLogin={handleLogin} />
    </nav>
  );
};

export default Navbar;