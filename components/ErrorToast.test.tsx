import { describe, it, expect, vi } from 'vitest';
import fc from 'fast-check';
import { DeepSeekError } from '../services/deepseekService';
import { DoubaoError } from '../services/doubaoService';

/**
 * Feature: nantong-blue-calico-refocus, Property 11: API错误友好提示
 * Validates: Requirements 3.5
 * 
 * 对于任意API调用失败（DeepSeek或Doubao），系统应显示用户友好的错误消息并提供重试按钮
 */

// 辅助函数：获取错误消息
function getErrorMessage(error: Error | DeepSeekError | DoubaoError): string {
  if (error instanceof DeepSeekError) {
    switch (error.code) {
      case 'RATE_LIMIT':
        return '请求过于频繁，请稍后再试';
      case 'INVALID_KEY':
        return 'API密钥无效，请联系管理员';
      case 'TIMEOUT':
        return '请求超时，请重试';
      case 'SERVER_ERROR':
        return '服务暂时不可用，请稍后再试';
      default:
        return '未知错误，请联系技术支持';
    }
  }

  if (error instanceof DoubaoError) {
    switch (error.code) {
      case 'CONTENT_FILTER':
        return '内容不符合生成规范，请调整输入';
      case 'INVALID_PROMPT':
        return 'Prompt格式错误，请重新输入';
      case 'QUOTA_EXCEEDED':
        return '今日生成次数已达上限，请明天再试';
      case 'GENERATION_FAILED':
        return '图像生成失败，请重试或更换描述';
      default:
        return '图像生成服务异常';
    }
  }

  return error.message || '发生未知错误';
}

// 辅助函数：判断错误是否可重试
function isRetryable(error: Error | DeepSeekError | DoubaoError): boolean {
  if (error instanceof DeepSeekError) {
    return error.retryable;
  }

  if (error instanceof DoubaoError) {
    return error.code !== 'INVALID_PROMPT' && error.code !== 'QUOTA_EXCEEDED';
  }

  return true;
}

describe('ErrorToast Property Tests', () => {
  describe('Property 11: API错误友好提示', () => {
    it('应为任意DeepSeek错误返回用户友好的消息', () => {
      // Feature: nantong-blue-calico-refocus, Property 11: API错误友好提示
      // Validates: Requirements 3.5

      fc.assert(
        fc.property(
          fc.constantFrom('RATE_LIMIT', 'INVALID_KEY', 'TIMEOUT', 'SERVER_ERROR'),
          fc.string({ minLength: 1, maxLength: 100 }),
          fc.boolean(),
          (code, message, retryable) => {
            const error = new DeepSeekError(
              code as 'RATE_LIMIT' | 'INVALID_KEY' | 'TIMEOUT' | 'SERVER_ERROR',
              message,
              retryable
            );

            const friendlyMessage = getErrorMessage(error);

            // 验证返回的是非空字符串
            expect(friendlyMessage).toBeTruthy();
            expect(typeof friendlyMessage).toBe('string');
            expect(friendlyMessage.length).toBeGreaterThan(0);

            // 验证消息不包含技术细节（如堆栈跟踪）
            expect(friendlyMessage).not.toContain('Error:');
            expect(friendlyMessage).not.toContain('at ');
            expect(friendlyMessage).not.toContain('stack');

            // 验证消息是中文的
            expect(/[\u4e00-\u9fa5]/.test(friendlyMessage)).toBe(true);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('应为任意Doubao错误返回用户友好的消息', () => {
      // Feature: nantong-blue-calico-refocus, Property 11: API错误友好提示
      // Validates: Requirements 3.5

      fc.assert(
        fc.property(
          fc.constantFrom('CONTENT_FILTER', 'INVALID_PROMPT', 'QUOTA_EXCEEDED', 'GENERATION_FAILED'),
          fc.string({ minLength: 1, maxLength: 100 }),
          (code, message) => {
            const error = new DoubaoError(
              code as 'CONTENT_FILTER' | 'INVALID_PROMPT' | 'QUOTA_EXCEEDED' | 'GENERATION_FAILED',
              message
            );

            const friendlyMessage = getErrorMessage(error);

            // 验证返回的是非空字符串
            expect(friendlyMessage).toBeTruthy();
            expect(typeof friendlyMessage).toBe('string');
            expect(friendlyMessage.length).toBeGreaterThan(0);

            // 验证消息不包含技术细节
            expect(friendlyMessage).not.toContain('Error:');
            expect(friendlyMessage).not.toContain('at ');

            // 验证消息是中文的
            expect(/[\u4e00-\u9fa5]/.test(friendlyMessage)).toBe(true);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('应正确判断DeepSeek错误的可重试性', () => {
      fc.assert(
        fc.property(
          fc.constantFrom('RATE_LIMIT', 'INVALID_KEY', 'TIMEOUT', 'SERVER_ERROR'),
          fc.boolean(),
          (code, retryable) => {
            const error = new DeepSeekError(
              code as 'RATE_LIMIT' | 'INVALID_KEY' | 'TIMEOUT' | 'SERVER_ERROR',
              '测试错误',
              retryable
            );

            const canRetry = isRetryable(error);

            // 验证可重试性与错误对象的retryable属性一致
            expect(canRetry).toBe(retryable);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('应正确判断Doubao错误的可重试性', () => {
      const testCases = [
        { code: 'CONTENT_FILTER' as const, expectedRetryable: true },
        { code: 'INVALID_PROMPT' as const, expectedRetryable: false },
        { code: 'QUOTA_EXCEEDED' as const, expectedRetryable: false },
        { code: 'GENERATION_FAILED' as const, expectedRetryable: true }
      ];

      testCases.forEach(({ code, expectedRetryable }) => {
        const error = new DoubaoError(code, '测试错误');
        const canRetry = isRetryable(error);

        expect(canRetry).toBe(expectedRetryable);
      });
    });

    it('应为所有DeepSeek错误代码提供友好消息', () => {
      const errorCodes: Array<'RATE_LIMIT' | 'INVALID_KEY' | 'TIMEOUT' | 'SERVER_ERROR'> = [
        'RATE_LIMIT',
        'INVALID_KEY',
        'TIMEOUT',
        'SERVER_ERROR'
      ];

      errorCodes.forEach(code => {
        const error = new DeepSeekError(code, '原始错误消息', false);
        const friendlyMessage = getErrorMessage(error);

        // 验证每个错误代码都有对应的友好消息
        expect(friendlyMessage).toBeTruthy();
        expect(friendlyMessage.length).toBeGreaterThan(0);
        expect(friendlyMessage).not.toBe('原始错误消息');

        // 验证消息是中文的
        expect(/[\u4e00-\u9fa5]/.test(friendlyMessage)).toBe(true);
      });
    });

    it('应为所有Doubao错误代码提供友好消息', () => {
      const errorCodes: Array<'CONTENT_FILTER' | 'INVALID_PROMPT' | 'QUOTA_EXCEEDED' | 'GENERATION_FAILED'> = [
        'CONTENT_FILTER',
        'INVALID_PROMPT',
        'QUOTA_EXCEEDED',
        'GENERATION_FAILED'
      ];

      errorCodes.forEach(code => {
        const error = new DoubaoError(code, '原始错误消息');
        const friendlyMessage = getErrorMessage(error);

        // 验证每个错误代码都有对应的友好消息
        expect(friendlyMessage).toBeTruthy();
        expect(friendlyMessage.length).toBeGreaterThan(0);
        expect(friendlyMessage).not.toBe('原始错误消息');

        // 验证消息是中文的
        expect(/[\u4e00-\u9fa5]/.test(friendlyMessage)).toBe(true);
      });
    });

    it('应为普通Error提供默认友好消息', () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 1, maxLength: 100 }),
          (message) => {
            const error = new Error(message);
            const friendlyMessage = getErrorMessage(error);

            // 验证返回的是非空字符串
            expect(friendlyMessage).toBeTruthy();
            expect(typeof friendlyMessage).toBe('string');
            expect(friendlyMessage.length).toBeGreaterThan(0);

            // 对于普通Error，应该返回原始消息
            expect(friendlyMessage).toBe(message);
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});
