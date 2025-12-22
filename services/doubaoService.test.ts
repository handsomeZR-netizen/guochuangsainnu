import { describe, it, expect, beforeEach } from 'vitest';
import fc from 'fast-check';
import { DoubaoService, DoubaoError } from './doubaoService';

/**
 * Feature: nantong-blue-calico-refocus, Property 9: Prompt核心元素完整性
 * Validates: Requirements 3.3
 * 
 * 对于任意纹样名称和生成选项，构建的Doubao Prompt应包含
 * "南通蓝印花布"、"刮浆印染纹理"、"植物靛蓝"这三个核心元素
 */

describe('DoubaoService Property Tests', () => {
  let service: DoubaoService;

  beforeEach(() => {
    service = new DoubaoService(process.env.ARK_API_KEY);
  });

  describe('Property 9: Prompt核心元素完整性', () => {
    it('应为任意纹样名称生成包含核心元素的Prompt', () => {
      // Feature: nantong-blue-calico-refocus, Property 9: Prompt核心元素完整性
      // Validates: Requirements 3.3

      fc.assert(
        fc.property(
          // 生成有效的纹样名称（1-20个字符的中文字符串）
          fc.stringMatching(/^[\u4e00-\u9fa5]{1,20}$/),
          fc.constantFrom('traditional', 'modern', undefined),
          (patternName, style) => {
            const prompt = service.buildPrompt(patternName, { 
              style: style as 'traditional' | 'modern' | undefined 
            });

            // 验证Prompt包含三个核心元素
            expect(prompt).toContain('南通蓝印花布');
            expect(prompt).toContain('刮浆印染');
            expect(prompt).toContain('植物靛蓝');

            // 验证Prompt包含纹样名称
            expect(prompt).toContain(patternName);

            // 验证Prompt是非空字符串
            expect(prompt.length).toBeGreaterThan(0);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('应为常见纹样生成包含核心元素的Prompt', () => {
      const commonPatterns = ['五福捧寿', '松鹤长春', '喜鹊登梅', '牡丹花开'];

      commonPatterns.forEach(patternName => {
        const prompt = service.buildPrompt(patternName);

        // 验证三个核心元素都存在
        expect(prompt).toContain('南通蓝印花布');
        expect(prompt).toContain('刮浆印染');
        expect(prompt).toContain('植物靛蓝');

        // 验证纹样名称存在
        expect(prompt).toContain(patternName);
      });
    });

    it('应为不同风格生成适当的Prompt', () => {
      const patternName = '五福捧寿';

      const traditionalPrompt = service.buildPrompt(patternName, { style: 'traditional' });
      const modernPrompt = service.buildPrompt(patternName, { style: 'modern' });

      // 两种风格都应包含核心元素
      [traditionalPrompt, modernPrompt].forEach(prompt => {
        expect(prompt).toContain('南通蓝印花布');
        expect(prompt).toContain('刮浆印染');
        expect(prompt).toContain('植物靛蓝');
      });

      // 传统风格应包含"传统工艺"
      expect(traditionalPrompt).toContain('传统工艺');

      // 现代风格应包含"现代简约"
      expect(modernPrompt).toContain('现代简约');
    });

    it('应为空选项生成默认Prompt', () => {
      const patternName = '五福捧寿';
      const prompt = service.buildPrompt(patternName, {});

      // 验证核心元素
      expect(prompt).toContain('南通蓝印花布');
      expect(prompt).toContain('刮浆印染');
      expect(prompt).toContain('植物靛蓝');
      expect(prompt).toContain(patternName);

      // 默认应该是传统风格
      expect(prompt).toContain('传统工艺');
    });
  });

  describe('错误处理', () => {
    it('应正确创建不同类型的错误', () => {
      const contentFilterError = new DoubaoError('CONTENT_FILTER', '内容不符合规范');
      expect(contentFilterError.code).toBe('CONTENT_FILTER');
      expect(contentFilterError.message).toBe('内容不符合规范');

      const invalidPromptError = new DoubaoError('INVALID_PROMPT', 'Prompt格式错误');
      expect(invalidPromptError.code).toBe('INVALID_PROMPT');

      const quotaError = new DoubaoError('QUOTA_EXCEEDED', '配额已用完');
      expect(quotaError.code).toBe('QUOTA_EXCEEDED');

      const generationError = new DoubaoError('GENERATION_FAILED', '生成失败');
      expect(generationError.code).toBe('GENERATION_FAILED');
    });

    it('应在无API密钥时创建服务但发出警告', () => {
      const serviceWithoutKey = new DoubaoService('');
      expect(serviceWithoutKey).toBeDefined();
      // 服务会在构造时发出警告，但不会抛出错误
      // 错误会在实际调用API时抛出
    });
  });
});
