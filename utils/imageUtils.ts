/**
 * 图片路径工具函数
 * 根据环境变量决定使用原图还是压缩图
 */

export const getImagePath = (imagePath: string): string => {
  const useCompressed = import.meta.env.VITE_USE_COMPRESSED_IMAGES === 'true';
  
  if (useCompressed && imagePath.startsWith('/images/')) {
    return imagePath.replace('/images/', '/images-compressed/');
  }
  
  return imagePath;
};

/**
 * 获取图片的srcSet，提供多种尺寸选择
 */
export const getImageSrcSet = (imagePath: string): string => {
  const basePath = getImagePath(imagePath);
  // 对于压缩图片，我们只提供一个尺寸
  // 如果需要多尺寸，可以在压缩脚本中生成多个版本
  return basePath;
};

/**
 * 预加载关键图片
 */
export const preloadImage = (imagePath: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = getImagePath(imagePath);
  });
};

/**
 * 批量预加载图片
 */
export const preloadImages = async (imagePaths: string[]): Promise<void> => {
  try {
    await Promise.all(imagePaths.map(preloadImage));
  } catch (error) {
    console.warn('部分图片预加载失败:', error);
  }
};