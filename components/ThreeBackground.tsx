import React, { useState, useEffect, memo } from 'react';

// 轮播图片列表
const CAROUSEL_IMAGES = [
  '/index_back/1.png',
  '/index_back/2.png',
];

// 轮播间隔时间（毫秒）
const CAROUSEL_INTERVAL = 5000;

const ThreeBackground: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoaded, setIsLoaded] = useState<boolean[]>(new Array(CAROUSEL_IMAGES.length).fill(false));

  // 预加载图片
  useEffect(() => {
    CAROUSEL_IMAGES.forEach((src, index) => {
      const img = new Image();
      img.onload = () => {
        setIsLoaded(prev => {
          const newState = [...prev];
          newState[index] = true;
          return newState;
        });
      };
      img.src = src;
    });
  }, []);

  // 自动轮播
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % CAROUSEL_IMAGES.length);
    }, CAROUSEL_INTERVAL);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      {/* 图片轮播层 */}
      {CAROUSEL_IMAGES.map((src, index) => (
        <div
          key={src}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentIndex ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <img
            src={src}
            alt=""
            className="w-full h-full object-cover"
            style={{ filter: 'brightness(1.1) contrast(1.05)' }}
            loading={index === 0 ? 'eager' : 'lazy'}
          />
        </div>
      ))}

      {/* 垂直渐变遮罩层：顶部深 -> 中央浅 -> 底部深（降低透明度） */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `linear-gradient(to bottom, 
            rgba(0, 40, 100, 0.4) 0%, 
            rgba(0, 40, 100, 0.15) 40%,
            rgba(0, 40, 100, 0.15) 60%,
            rgba(0, 40, 100, 0.4) 100%
          )`,
        }}
      />

      {/* 底部过渡到页面背景 */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none"
        style={{
          background: 'linear-gradient(to top, rgba(248, 250, 252, 1) 0%, rgba(248, 250, 252, 0) 100%)',
        }}
      />
    </div>
  );
};

export default memo(ThreeBackground);
