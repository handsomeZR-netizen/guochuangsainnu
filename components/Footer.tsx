import React from 'react';
import { useTranslation } from 'react-i18next';

const Footer: React.FC = () => {
  const { t } = useTranslation();
  
  return (
    <footer className="bg-slate-900 text-slate-400 py-8 sm:py-12 border-t border-slate-800">
      <div className="container mx-auto px-4 sm:px-6 grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
        <div className="col-span-2 md:col-span-1">
            <h4 className="text-white font-bold text-lg mb-3 sm:mb-4 tracking-widest">墨韵智汇</h4>
            <p className="text-sm text-slate-500 leading-relaxed">
                {t('brand.subtitle')}
            </p>
        </div>
        <div>
            <h4 className="text-white font-bold text-sm mb-3 sm:mb-4 uppercase">{t('footer.about')}</h4>
            <ul className="space-y-2 text-sm">
                <li><a href="#dashboard" className="hover:text-white transition-colors block py-1">{t('nav.dashboard')}</a></li>
                <li><a href="#products" className="hover:text-white transition-colors block py-1">{t('nav.products')}</a></li>
                <li><a href="#aigc" className="hover:text-white transition-colors block py-1">{t('nav.aigc')}</a></li>
            </ul>
        </div>
        <div>
            <h4 className="text-white font-bold text-sm mb-3 sm:mb-4 uppercase">{t('footer.terms')}</h4>
            <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors block py-1">{t('footer.privacy')}</a></li>
                <li><a href="#" className="hover:text-white transition-colors block py-1">{t('footer.terms')}</a></li>
            </ul>
        </div>
        <div className="col-span-2 md:col-span-1">
            <h4 className="text-white font-bold text-sm mb-3 sm:mb-4 uppercase">{t('footer.contact')}</h4>
            <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                  <a href="https://github.com/handsomeZR-netizen" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">handsomeZR-netizen</a>
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                  <span>15156555878</span>
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                  <a href="mailto:1516924835@qq.com" className="hover:text-white transition-colors">1516924835@qq.com</a>
                </li>
            </ul>
        </div>
      </div>
      <div className="container mx-auto px-4 sm:px-6 mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-slate-800 text-center text-xs text-slate-600">
        {t('footer.copyright')}
      </div>
    </footer>
  );
};

export default Footer;