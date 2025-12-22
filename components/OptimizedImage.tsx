import React, { useState, useEffect } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
  loading?: 'lazy' | 'eager';
  onLoad?: () => void;
  onError?: () => void;
}

/**
 * 优化的图片组件
 * - 支持WebP格式（如果可用）
 * - 自动懒加载
 * - 渐进式加载效果
 */
export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  className = '',
  style,
  loading = 'lazy',
  onLoad,
  onError
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [imageSrc, setImageSrc] = useState(src);

  useEffect(() => {
    // 检测浏览器是否支持WebP
    const checkWebPSupport = async () => {
      if (!window.createImageBitmap) {
        setImageSrc(src);
        return;
      }

      try {
        const webpData = 'data:image/webp;base64,UklGRiQAAABXRUJQVlA4IBgAAAAwAQCdASoBAAEAAwA0JaQAA3AA/vuUAAA=';
        const blob = await fetch(webpData).then(r => r.blob());
        await createImageBitmap(blob);
        
        // 浏览器支持WebP，尝试转换URL
        // 对于picsum.photos，可以添加format参数
        if (src.includes('picsum.photos')) {
          const url = new URL(src);
          url.searchParams.set('format', 'webp');
          setImageSrc(url.toString());
        } else {
          // 对于其他URL，尝试添加.webp扩展名
          const webpSrc = src.replace(/\.(jpg|jpeg|png)$/i, '.webp');
          setImageSrc(webpSrc);
        }
      } catch {
        // 不支持WebP，使用原始URL
        setImageSrc(src);
      }
    };

    checkWebPSupport();
  }, [src]);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    // 如果WebP加载失败，回退到原始格式
    if (imageSrc !== src) {
      setImageSrc(src);
      setHasError(false);
    } else {
      setHasError(true);
      onError?.();
    }
  };

  if (hasError) {
    return (
      <div 
        className={`bg-slate-200 flex items-center justify-center ${className}`}
        style={style}
      >
        <span className="text-slate-400 text-sm">图片加载失败</span>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden">
      {/* 加载占位符 */}
      {!isLoaded && (
        <div 
          className={`absolute inset-0 bg-slate-200 animate-pulse ${className}`}
          style={style}
        />
      )}
      
      {/* 实际图片 */}
      <img
        src={imageSrc}
        alt={alt}
        className={`${className} transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        style={style}
        loading={loading}
        onLoad={handleLoad}
        onError={handleError}
        decoding="async"
      />
    </div>
  );
};

export default OptimizedImage;
