import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { X, Globe } from 'lucide-react';
import { getIPLocation, shouldShowLanguageSuggestion, IPLocationData } from '../services/ipLocationService';

/**
 * 语言建议横幅组件
 * 根据IP地址自动识别用户位置并建议语言
 */
export const LanguageSuggestion: React.FC = () => {
  const { i18n } = useTranslation();
  const [showSuggestion, setShowSuggestion] = useState(false);
  const [locationData, setLocationData] = useState<IPLocationData | null>(null);
  
  useEffect(() => {
    const checkLanguageSuggestion = async () => {
      // 检查是否已经关闭过建议
      const dismissed = localStorage.getItem('languageSuggestionDismissed');
      if (dismissed === 'true') {
        return;
      }
      
      // 获取IP位置信息
      const data = await getIPLocation();
      setLocationData(data);
      
      // 检查是否需要显示建议
      if (shouldShowLanguageSuggestion(i18n.language, data.suggestedLanguage)) {
        setShowSuggestion(true);
      }
    };
    
    checkLanguageSuggestion();
  }, [i18n.language]);
  
  const handleAccept = () => {
    if (locationData) {
      i18n.changeLanguage(locationData.suggestedLanguage);
    }
    setShowSuggestion(false);
    localStorage.setItem('languageSuggestionDismissed', 'true');
  };
  
  const handleDismiss = () => {
    setShowSuggestion(false);
    localStorage.setItem('languageSuggestionDismissed', 'true');
  };
  
  if (!showSuggestion || !locationData) {
    return null;
  }
  
  const suggestedLanguageName = locationData.suggestedLanguage === 'zh' ? '中文' : 'English';
  
  return (
    <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 max-w-md w-full mx-4">
      <div className="bg-white rounded-lg shadow-xl border border-blue-200 p-4 flex items-start gap-3">
        <Globe className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="text-sm text-slate-700 mb-2">
            {locationData.suggestedLanguage === 'zh' 
              ? `检测到您来自${locationData.country}，是否切换到中文？`
              : `We detected you're from ${locationData.country}. Switch to English?`
            }
          </p>
          <div className="flex gap-2">
            <button
              onClick={handleAccept}
              className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
            >
              {locationData.suggestedLanguage === 'zh' ? '切换到中文' : 'Switch to English'}
            </button>
            <button
              onClick={handleDismiss}
              className="px-3 py-1 bg-slate-100 text-slate-700 text-sm rounded hover:bg-slate-200 transition-colors"
            >
              {locationData.suggestedLanguage === 'zh' ? '保持当前语言' : 'Keep current'}
            </button>
          </div>
        </div>
        <button
          onClick={handleDismiss}
          className="text-slate-400 hover:text-slate-600 transition-colors"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
