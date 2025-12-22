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
            <div className="flex gap-3">
               {/* Social placeholders */}
               <div className="w-10 h-10 sm:w-8 sm:h-8 bg-slate-800 hover:bg-white active:bg-slate-200 transition-colors cursor-pointer rounded-full"></div>
               <div className="w-10 h-10 sm:w-8 sm:h-8 bg-slate-800 hover:bg-white active:bg-slate-200 transition-colors cursor-pointer rounded-full"></div>
               <div className="w-10 h-10 sm:w-8 sm:h-8 bg-slate-800 hover:bg-white active:bg-slate-200 transition-colors cursor-pointer rounded-full"></div>
            </div>
        </div>
      </div>
      <div className="container mx-auto px-4 sm:px-6 mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-slate-800 text-center text-xs text-slate-600">
        {t('footer.copyright')}
      </div>
    </footer>
  );
};

export default Footer;