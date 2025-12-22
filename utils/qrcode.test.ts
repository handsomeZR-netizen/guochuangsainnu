/**
 * QR Code 属性测试
 * Feature: nantong-blue-calico-refocus, Property 14: 二维码跳转正确性
 * 验证需求: 5.4
 */

import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import {
  generateProductEncyclopediaUrl,
  generatePatternEncyclopediaUrl,
  generateScenarioProductUrl,
  isValidQRCodeUrl
} from './qrcode';

describe('QR Code Properties', () => {
  /**
   * Feature: nantong-blue-calico-refocus, Property 14: 二维码跳转正确性
   * 
   * 属性：对于任意产品二维码扫描，系统应跳转到该产品对应的文化百科页面
   * 
   * 测试策略：
   * 1. 生成随机的产品ID、纹样ID和场景ID
   * 2. 为每个ID生成对应的百科页面URL
   * 3. 验证生成的URL格式正确且包含正确的ID
   * 4. 验证URL可以被正确解析
   */
  it('对于任意产品ID，生成的二维码URL应包含正确的产品ID路径', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1, maxLength: 50 }).filter(s => /^[a-zA-Z0-9-_]+$/.test(s)),
        (productId) => {
          const url = generateProductEncyclopediaUrl(productId);
          
          // 验证URL格式正确
          expect(isValidQRCodeUrl(url)).toBe(true);
          
          // 验证URL包含产品ID
          expect(url).toContain(`/encyclopedia/product/${productId}`);
          
          // 验证URL可以被解析
          const urlObj = new URL(url);
          expect(urlObj.pathname).toContain(productId);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('对于任意纹样ID，生成的二维码URL应包含正确的纹样ID路径', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1, maxLength: 50 }).filter(s => /^[a-zA-Z0-9-_]+$/.test(s)),
        (patternId) => {
          const url = generatePatternEncyclopediaUrl(patternId);
          
          // 验证URL格式正确
          expect(isValidQRCodeUrl(url)).toBe(true);
          
          // 验证URL包含纹样ID
          expect(url).toContain(`/encyclopedia/pattern/${patternId}`);
          
          // 验证URL可以被解析
          const urlObj = new URL(url);
          expect(urlObj.pathname).toContain(patternId);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('对于任意场景ID和产品ID组合，生成的二维码URL应包含正确的路径', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1, maxLength: 50 }).filter(s => /^[a-zA-Z0-9-_]+$/.test(s)),
        fc.string({ minLength: 1, maxLength: 50 }).filter(s => /^[a-zA-Z0-9-_]+$/.test(s)),
        (scenarioId, productId) => {
          const url = generateScenarioProductUrl(scenarioId, productId);
          
          // 验证URL格式正确
          expect(isValidQRCodeUrl(url)).toBe(true);
          
          // 验证URL包含场景ID和产品ID
          expect(url).toContain(`/encyclopedia/scenario/${scenarioId}/product/${productId}`);
          
          // 验证URL可以被解析
          const urlObj = new URL(url);
          expect(urlObj.pathname).toContain(scenarioId);
          expect(urlObj.pathname).toContain(productId);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('对于任意有效的HTTP/HTTPS URL，isValidQRCodeUrl应返回true', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('http', 'https'),
        fc.domain(),
        fc.string({ minLength: 1, maxLength: 100 }).filter(s => /^[a-zA-Z0-9-_/]+$/.test(s)),
        (protocol, domain, path) => {
          const url = `${protocol}://${domain}/${path}`;
          expect(isValidQRCodeUrl(url)).toBe(true);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('对于任意无效的URL字符串，isValidQRCodeUrl应返回false', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1, maxLength: 50 }).filter(s => !s.includes('://')),
        (invalidUrl) => {
          expect(isValidQRCodeUrl(invalidUrl)).toBe(false);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('生成的所有URL应使用相同的基础域名', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1, maxLength: 50 }).filter(s => /^[a-zA-Z0-9-_]+$/.test(s)),
        fc.string({ minLength: 1, maxLength: 50 }).filter(s => /^[a-zA-Z0-9-_]+$/.test(s)),
        (productId, patternId) => {
          const productUrl = generateProductEncyclopediaUrl(productId);
          const patternUrl = generatePatternEncyclopediaUrl(patternId);
          
          const productUrlObj = new URL(productUrl);
          const patternUrlObj = new URL(patternUrl);
          
          // 验证两个URL使用相同的协议和主机
          expect(productUrlObj.origin).toBe(patternUrlObj.origin);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('生成的URL路径应始终以/encyclopedia开头', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1, maxLength: 50 }).filter(s => /^[a-zA-Z0-9-_]+$/.test(s)),
        fc.constantFrom('product', 'pattern'),
        (id, type) => {
          const url = type === 'product' 
            ? generateProductEncyclopediaUrl(id)
            : generatePatternEncyclopediaUrl(id);
          
          const urlObj = new URL(url);
          expect(urlObj.pathname).toMatch(/^\/encyclopedia\//);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('相同的ID应始终生成相同的URL（幂等性）', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1, maxLength: 50 }).filter(s => /^[a-zA-Z0-9-_]+$/.test(s)),
        (productId) => {
          const url1 = generateProductEncyclopediaUrl(productId);
          const url2 = generateProductEncyclopediaUrl(productId);
          
          expect(url1).toBe(url2);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('不同的ID应生成不同的URL', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1, maxLength: 50 }).filter(s => /^[a-zA-Z0-9-_]+$/.test(s)),
        fc.string({ minLength: 1, maxLength: 50 }).filter(s => /^[a-zA-Z0-9-_]+$/.test(s)),
        (id1, id2) => {
          fc.pre(id1 !== id2); // 前提条件：两个ID不同
          
          const url1 = generateProductEncyclopediaUrl(id1);
          const url2 = generateProductEncyclopediaUrl(id2);
          
          expect(url1).not.toBe(url2);
        }
      ),
      { numRuns: 100 }
    );
  });
});
