import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import { getSuggestedLanguage, shouldShowLanguageSuggestion } from './ipLocationService';

/**
 * 多语言功能的属性测试
 * Feature: nantong-blue-calico-refocus
 */

describe('IP Location Service - Property Tests', () => {
  /**
   * 属性 20: IP语言识别
   * 验证需求: 8.1
   * 
   * 对于任意访问者的IP地址（国家代码），系统应识别其地理位置并建议对应的语言选项（中文或英文）
   */
  it('Property 20: IP语言识别 - 中文地区应建议中文，其他地区应建议英文', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('CN', 'TW', 'HK', 'MO', 'SG', 'US', 'GB', 'CA', 'AU', 'JP', 'KR', 'FR', 'DE'),
        (countryCode) => {
          const suggestedLanguage = getSuggestedLanguage(countryCode);
          
          // 中文地区（中国大陆、台湾、香港、澳门、新加坡）应建议中文
          const chineseRegions = ['CN', 'TW', 'HK', 'MO', 'SG'];
          if (chineseRegions.includes(countryCode)) {
            expect(suggestedLanguage).toBe('zh');
          } else {
            // 其他地区应建议英文
            expect(suggestedLanguage).toBe('en');
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * 属性 20 (扩展): 国家代码大小写不敏感
   * 验证需求: 8.1
   * 
   * 对于任意国家代码（无论大小写），系统应正确识别并建议语言
   */
  it('Property 20 (扩展): 国家代码大小写不敏感', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('cn', 'CN', 'Cn', 'cN', 'tw', 'TW', 'us', 'US'),
        (countryCode) => {
          const suggestedLanguage = getSuggestedLanguage(countryCode);
          
          // 应该返回有效的语言代码
          expect(['zh', 'en']).toContain(suggestedLanguage);
          
          // 大小写不应影响结果
          const upperCase = getSuggestedLanguage(countryCode.toUpperCase());
          const lowerCase = getSuggestedLanguage(countryCode.toLowerCase());
          expect(upperCase).toBe(lowerCase);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * 属性 22: 语言切换状态保持
   * 验证需求: 8.5
   * 
   * 对于任意当前语言和建议语言的组合，shouldShowLanguageSuggestion函数应正确判断是否显示建议
   */
  it('Property 22: 语言切换状态保持 - 当前语言与建议语言不同时应显示建议', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('zh', 'en'),
        fc.constantFrom('zh', 'en'),
        (currentLang, suggestedLang) => {
          const shouldShow = shouldShowLanguageSuggestion(currentLang, suggestedLang);
          
          if (currentLang === suggestedLang) {
            // 当前语言与建议语言相同，不应显示建议
            expect(shouldShow).toBe(false);
          } else {
            // 当前语言与建议语言不同，应显示建议
            expect(shouldShow).toBe(true);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * 属性 22 (扩展): 语言建议的对称性
   * 验证需求: 8.5
   * 
   * 如果从语言A切换到语言B需要显示建议，那么从语言B切换到语言A也应该显示建议
   */
  it('Property 22 (扩展): 语言建议的对称性', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('zh', 'en'),
        fc.constantFrom('zh', 'en'),
        (lang1, lang2) => {
          const shouldShow1to2 = shouldShowLanguageSuggestion(lang1, lang2);
          const shouldShow2to1 = shouldShowLanguageSuggestion(lang2, lang1);
          
          // 对称性：A→B 和 B→A 的建议状态应该一致
          expect(shouldShow1to2).toBe(shouldShow2to1);
        }
      ),
      { numRuns: 100 }
    );
  });
});

/**
 * 单元测试：具体场景验证
 */
describe('IP Location Service - Unit Tests', () => {
  it('应该为中国大陆建议中文', () => {
    expect(getSuggestedLanguage('CN')).toBe('zh');
  });

  it('应该为台湾建议中文', () => {
    expect(getSuggestedLanguage('TW')).toBe('zh');
  });

  it('应该为香港建议中文', () => {
    expect(getSuggestedLanguage('HK')).toBe('zh');
  });

  it('应该为新加坡建议中文', () => {
    expect(getSuggestedLanguage('SG')).toBe('zh');
  });

  it('应该为美国建议英文', () => {
    expect(getSuggestedLanguage('US')).toBe('en');
  });

  it('应该为英国建议英文', () => {
    expect(getSuggestedLanguage('GB')).toBe('en');
  });

  it('当前语言与建议语言相同时不应显示建议', () => {
    expect(shouldShowLanguageSuggestion('zh', 'zh')).toBe(false);
    expect(shouldShowLanguageSuggestion('en', 'en')).toBe(false);
  });

  it('当前语言与建议语言不同时应显示建议', () => {
    expect(shouldShowLanguageSuggestion('zh', 'en')).toBe(true);
    expect(shouldShowLanguageSuggestion('en', 'zh')).toBe(true);
  });
});
