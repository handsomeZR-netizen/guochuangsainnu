/**
 * IP地理位置服务
 * 用于根据用户IP地址识别地理位置并建议语言
 */

export interface IPLocationData {
  country: string;
  countryCode: string;
  city?: string;
  suggestedLanguage: 'zh' | 'en';
}

/**
 * 根据IP地址获取地理位置信息
 * 使用免费的ipapi.co API
 */
export const getIPLocation = async (): Promise<IPLocationData> => {
  try {
    const response = await fetch('https://ipapi.co/json/', {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // 根据国家代码建议语言
    const suggestedLanguage = getSuggestedLanguage(data.country_code);
    
    return {
      country: data.country_name || 'Unknown',
      countryCode: data.country_code || 'XX',
      city: data.city,
      suggestedLanguage
    };
  } catch (error) {
    console.error('Failed to fetch IP location:', error);
    
    // 降级方案：使用浏览器语言
    const browserLang = navigator.language.toLowerCase();
    const suggestedLanguage = browserLang.startsWith('zh') ? 'zh' : 'en';
    
    return {
      country: 'Unknown',
      countryCode: 'XX',
      suggestedLanguage
    };
  }
};

/**
 * 根据国家代码建议语言
 * 中国大陆、台湾、香港、澳门、新加坡等地区建议中文
 * 其他地区建议英文
 */
export const getSuggestedLanguage = (countryCode: string): 'zh' | 'en' => {
  const chineseRegions = ['CN', 'TW', 'HK', 'MO', 'SG'];
  return chineseRegions.includes(countryCode.toUpperCase()) ? 'zh' : 'en';
};

/**
 * 检查是否应该显示语言建议提示
 * 如果用户当前语言与建议语言不同，返回true
 */
export const shouldShowLanguageSuggestion = (
  currentLanguage: string,
  suggestedLanguage: string
): boolean => {
  return currentLanguage !== suggestedLanguage;
};
