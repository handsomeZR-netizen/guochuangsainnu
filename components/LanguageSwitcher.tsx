import React from 'react';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';

/**
 * 语言切换组件
 * 支持中英文切换，并保持当前浏览状态
 */
export const LanguageSwitcher: React.FC = () => {
  const { i18n, t } = useTranslation();
  
  const toggleLanguage = () => {
    const newLang = i18n.language === 'zh' ? 'en' : 'zh';
    i18n.changeLanguage(newLang);
  };
  
  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-900/20 hover:bg-blue-900/30 transition-colors text-blue-100"
      aria-label={t('common.switchLanguage')}
    >
      <Globe className="w-4 h-4" />
      <span className="text-sm font-medium">
        {i18n.language === 'zh' ? 'EN' : '中文'}
      </span>
    </button>
  );
};
