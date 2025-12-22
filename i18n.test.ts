import { describe, it, expect, beforeEach } from 'vitest';
import fc from 'fast-check';
import i18n from './i18n';

/**
 * i18n多语言功能的属性测试
 * Feature: nantong-blue-calico-refocus
 */

describe('i18n - Property Tests', () => {
  beforeEach(async () => {
    // 重置语言到默认状态
    await i18n.changeLanguage('zh');
  });

  /**
   * 属性 21: 产品双语支持
   * 验证需求: 8.4
   * 
   * 对于任意产品详情页面，系统应提供中英双语的纹样解读和工艺说明
   */
  it('Property 21: 产品双语支持 - 所有关键翻译键在中英文中都存在', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constantFrom('zh', 'en'),
        fc.constantFrom(
          'brand.name',
          'brand.tagline',
          'brand.subtitle',
          'nav.dashboard',
          'nav.products',
          'nav.aigc',
          'hero.cta1',
          'hero.cta2',
          'product.price',
          'product.customize',
          'ai.title',
          'dashboard.title',
          'common.loading',
          'common.error'
        ),
        async (language, translationKey) => {
          await i18n.changeLanguage(language);
          
          const translation = i18n.t(translationKey);
          
          // 翻译应该存在且不为空
          expect(translation).toBeTruthy();
          expect(translation.length).toBeGreaterThan(0);
          
          // 翻译不应该返回键本身（表示缺失翻译）
          expect(translation).not.toBe(translationKey);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * 属性 21 (扩展): 场景标题双语完整性
   * 验证需求: 8.4
   * 
   * 对于任意场景（亲子、宴席、空间），中英文标题和描述都应该存在
   */
  it('Property 21 (扩展): 场景标题双语完整性', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constantFrom('zh', 'en'),
        fc.constantFrom('parentChild', 'banquet', 'space'),
        async (language, scenario) => {
          await i18n.changeLanguage(language);
          
          const title = i18n.t(`scenarios.${scenario}.title`);
          const description = i18n.t(`scenarios.${scenario}.description`);
          
          // 标题和描述都应该存在
          expect(title).toBeTruthy();
          expect(description).toBeTruthy();
          
          // 标题和描述应该有实际内容
          expect(title.length).toBeGreaterThan(0);
          expect(description.length).toBeGreaterThan(0);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * 属性 22: 语言切换状态保持
   * 验证需求: 8.5
   * 
   * 对于任意语言切换操作，i18n的当前语言应该正确更新
   */
  it('Property 22: 语言切换状态保持 - 切换语言后应正确反映当前语言', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constantFrom('zh', 'en'),
        async (targetLanguage) => {
          await i18n.changeLanguage(targetLanguage);
          
          // 当前语言应该与目标语言一致
          expect(i18n.language).toBe(targetLanguage);
          
          // 翻译应该使用正确的语言
          const brandName = i18n.t('brand.name');
          if (targetLanguage === 'zh') {
            expect(brandName).toContain('墨韵智汇');
          } else {
            expect(brandName).toContain('Ink Rhythm');
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * 属性 22 (扩展): 语言切换的幂等性
   * 验证需求: 8.5
   * 
   * 对于任意语言，多次切换到同一语言应该产生相同的结果
   */
  it('Property 22 (扩展): 语言切换的幂等性', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constantFrom('zh', 'en'),
        async (language) => {
          // 第一次切换
          await i18n.changeLanguage(language);
          const firstResult = i18n.language;
          const firstTranslation = i18n.t('brand.name');
          
          // 第二次切换到同一语言
          await i18n.changeLanguage(language);
          const secondResult = i18n.language;
          const secondTranslation = i18n.t('brand.name');
          
          // 结果应该相同（幂等性）
          expect(secondResult).toBe(firstResult);
          expect(secondTranslation).toBe(firstTranslation);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * 属性 21+22 (组合): 语言切换后翻译内容应该改变
   * 验证需求: 8.4, 8.5
   * 
   * 对于任意翻译键，在不同语言下应该返回不同的翻译内容
   */
  it('Property 21+22 (组合): 语言切换后翻译内容应该改变', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constantFrom(
          'hero.cta1',
          'product.customize',
          'ai.generate',
          'common.loading'
        ),
        async (translationKey) => {
          // 获取中文翻译
          await i18n.changeLanguage('zh');
          const zhTranslation = i18n.t(translationKey);
          
          // 获取英文翻译
          await i18n.changeLanguage('en');
          const enTranslation = i18n.t(translationKey);
          
          // 中英文翻译应该不同
          expect(zhTranslation).not.toBe(enTranslation);
          
          // 两者都应该有内容
          expect(zhTranslation.length).toBeGreaterThan(0);
          expect(enTranslation.length).toBeGreaterThan(0);
        }
      ),
      { numRuns: 100 }
    );
  });
});

/**
 * 单元测试：具体翻译验证
 */
describe('i18n - Unit Tests', () => {
  it('应该正确加载中文翻译', async () => {
    await i18n.changeLanguage('zh');
    expect(i18n.t('brand.name')).toContain('墨韵智汇');
    expect(i18n.t('brand.tagline')).toContain('不止于布');
  });

  it('应该正确加载英文翻译', async () => {
    await i18n.changeLanguage('en');
    expect(i18n.t('brand.name')).toContain('Ink Rhythm');
    expect(i18n.t('brand.tagline')).toContain('More than fabric');
  });

  it('应该支持场景标题的中文翻译', async () => {
    await i18n.changeLanguage('zh');
    expect(i18n.t('scenarios.parentChild.title')).toBe('手作时光 · 亲子成长');
    expect(i18n.t('scenarios.banquet.title')).toBe('宴设青蓝 · 婚宴旅拍');
    expect(i18n.t('scenarios.space.title')).toBe('空间诗学 · 家居软装');
  });

  it('应该支持场景标题的英文翻译', async () => {
    await i18n.changeLanguage('en');
    expect(i18n.t('scenarios.parentChild.title')).toBe('Handcraft Time · Parent-Child Growth');
    expect(i18n.t('scenarios.banquet.title')).toBe('Indigo Banquet · Wedding Photography');
    expect(i18n.t('scenarios.space.title')).toBe('Space Poetics · Home Furnishing');
  });

  it('应该支持导航菜单的双语翻译', async () => {
    await i18n.changeLanguage('zh');
    expect(i18n.t('nav.dashboard')).toBe('数据大屏');
    expect(i18n.t('nav.products')).toBe('产品展示');
    
    await i18n.changeLanguage('en');
    expect(i18n.t('nav.dashboard')).toBe('Dashboard');
    expect(i18n.t('nav.products')).toBe('Products');
  });
});
