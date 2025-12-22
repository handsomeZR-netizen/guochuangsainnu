/**
 * QR Code 工具函数
 * 为产品和纹样生成唯一的二维码URL
 */

/**
 * 生成产品文化百科页面URL
 * @param productId 产品ID
 * @returns 完整的URL
 */
export const generateProductEncyclopediaUrl = (productId: string): string => {
  const baseUrl = typeof window !== 'undefined' 
    ? window.location.origin 
    : 'https://nantong-blue-calico.com';
  
  return `${baseUrl}/encyclopedia/product/${productId}`;
};

/**
 * 生成纹样文化百科页面URL
 * @param patternId 纹样ID
 * @returns 完整的URL
 */
export const generatePatternEncyclopediaUrl = (patternId: string): string => {
  const baseUrl = typeof window !== 'undefined' 
    ? window.location.origin 
    : 'https://nantong-blue-calico.com';
  
  return `${baseUrl}/encyclopedia/pattern/${patternId}`;
};

/**
 * 生成场景产品的二维码URL
 * @param scenarioId 场景ID
 * @param productId 产品ID
 * @returns 完整的URL
 */
export const generateScenarioProductUrl = (
  scenarioId: string,
  productId: string
): string => {
  const baseUrl = typeof window !== 'undefined' 
    ? window.location.origin 
    : 'https://nantong-blue-calico.com';
  
  return `${baseUrl}/encyclopedia/scenario/${scenarioId}/product/${productId}`;
};

/**
 * 验证二维码URL是否有效
 * @param url 要验证的URL
 * @returns 是否有效
 */
export const isValidQRCodeUrl = (url: string): boolean => {
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
  } catch {
    return false;
  }
};
