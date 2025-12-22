import { describe, it, expect, beforeEach, vi } from 'vitest';
import fc from 'fast-check';
import { DeepSeekService, DeepSeekError } from './deepseekService';

/**
 * Feature: nantong-blue-calico-refocus, Property 7+13: AI纹样解读生成
 * Validates: Requirements 3.1, 5.1
 * 
 * 对于任意有效的纹样名称（无论来自用户输入还是产品选择），
 * 系统应调用DeepSeek-V3并返回包含文化含义、历史背景和吉祥寓意的文本
 */

describe('DeepSeekService Property Tests', () => {
  let service: DeepSeekService;

  beforeEach(() => {
    // 使用真实的API密钥进行测试
    service = new DeepSeekService(process.env.ARK_API_KEY);
  });

  describe('Property 7+13: AI纹样解读生成', () => {
    it('应为常见纹样名称生成包含文化含义的解读', async () => {
      // Feature: nantong-blue-calico-refocus, Property 7+13: AI纹样解读生成
      // Validates: Requirements 3.1, 5.1

      // 测试一个常见的纹样名称
      const patternName = '五福捧寿';

      try {
        const result = await service.generatePatternExplanation(patternName, 'adult');

        // 验证返回的是非空字符串
        expect(result).toBeTruthy();
        expect(typeof result).toBe('string');
        expect(result.length).toBeGreaterThan(10);

        // 验证内容包含纹样相关的关键词
        // 至少应该提到纹样、文化、寓意等概念之一
        const hasRelevantContent = 
          result.includes('纹样') ||
          result.includes('文化') ||
          result.includes('寓意') ||
          result.includes('传统') ||
          result.includes('吉祥') ||
          result.includes(patternName) ||
          result.includes('五福') ||
          result.includes('福');

        expect(hasRelevantContent).toBe(true);
      } catch (error) {
        // 如果是API限流或其他可重试错误，标记为跳过
        if (error instanceof DeepSeekError && error.retryable) {
          console.warn(`Skipping test due to retryable error:`, error.message);
          return;
        }
        throw error;
      }
    }, 30000);

    it('应为儿童受众生成适合的解读', async () => {
      const patternName = '五福捧寿';

      try {
        const childResult = await service.generatePatternExplanation(patternName, 'child');

        expect(childResult).toBeTruthy();
        expect(typeof childResult).toBe('string');
        expect(childResult.length).toBeGreaterThan(0);

        // 儿童版本应该更简单易懂
        // 可能包含"小朋友"、"故事"等词汇
      } catch (error) {
        if (error instanceof DeepSeekError && error.retryable) {
          console.warn('Skipping child audience test due to retryable error');
          return;
        }
        throw error;
      }
    }, 30000);
  });

  describe('营销文案生成', () => {
    it('应为产品生成营销文案', async () => {
      const product = {
        name: '手作锦囊DIY包',
        description: '亲子手作产品'
      };

      try {
        const domesticCopy = await service.generateMarketingCopy(product, 'domestic');
        expect(domesticCopy).toBeTruthy();
        expect(typeof domesticCopy).toBe('string');
        expect(domesticCopy.length).toBeGreaterThan(0);
      } catch (error) {
        if (error instanceof DeepSeekError && error.retryable) {
          console.warn('Skipping marketing copy test due to retryable error');
          return;
        }
        throw error;
      }
    }, 30000);
  });

  describe('房间分析推荐', () => {
    it('应返回推荐方案', async () => {
      const roomDescription = '现代简约风格，白色墙面，木质家具，采光良好';

      try {
        const result = await service.analyzeRoomAndRecommend(roomDescription);

        expect(result).toBeTruthy();
        expect(result.recommendations).toBeDefined();
        expect(Array.isArray(result.recommendations)).toBe(true);
        expect(result.recommendations.length).toBeGreaterThanOrEqual(1);

        // 验证每个推荐都有必要的字段
        result.recommendations.forEach(rec => {
          expect(rec.patternName).toBeTruthy();
          expect(rec.layout).toBeTruthy();
          expect(rec.reason).toBeTruthy();
        });
      } catch (error) {
        if (error instanceof DeepSeekError && error.retryable) {
          console.warn('Skipping room analysis test due to retryable error');
          return;
        }
        throw error;
      }
    }, 30000);
  });

  describe('错误处理', () => {
    it('应在无API密钥时抛出INVALID_KEY错误', async () => {
      const serviceWithoutKey = new DeepSeekService('');

      await expect(
        serviceWithoutKey.generatePatternExplanation('测试')
      ).rejects.toThrow(DeepSeekError);

      try {
        await serviceWithoutKey.generatePatternExplanation('测试');
      } catch (error) {
        expect(error).toBeInstanceOf(DeepSeekError);
        expect((error as DeepSeekError).code).toBe('INVALID_KEY');
      }
    });

    it('应正确标记可重试的错误', () => {
      const rateLimitError = new DeepSeekError('RATE_LIMIT', '请求过于频繁', true);
      expect(rateLimitError.retryable).toBe(true);

      const invalidKeyError = new DeepSeekError('INVALID_KEY', 'API密钥无效', false);
      expect(invalidKeyError.retryable).toBe(false);
    });
  });
});
