import React, { useEffect, useRef, memo, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Footer from './components/Footer';
import { LanguageSuggestion } from './components/LanguageSuggestion';
import ShopPage from './components/ShopPage';

// 懒加载重型组件
const DataDashboard = lazy(() => import('./components/DataDashboard'));
const ProductShowcase = lazy(() => import('./components/ProductShowcase'));
const AIGenerator = lazy(() => import('./components/AIGenerator'));

// 使用 Canvas 替代 DOM 拖尾效果，大幅减少 DOM 操作和 GC 压力
const useInkTrailCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<Array<{
    x: number;
    y: number;
    size: number;
    opacity: number;
    scale: number;
  }>>([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number>(0);
  const lastTimeRef = useRef(0);

  useEffect(() => {
    // 创建 Canvas
    const canvas = document.createElement('canvas');
    canvas.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 1;
      mix-blend-mode: multiply;
    `;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    document.body.appendChild(canvas);
    canvasRef.current = canvas;

    const ctx = canvas.getContext('2d')!;
    const particles = particlesRef.current;

    // 节流的鼠标移动处理 - 使用 RAF 确保每帧只处理一次
    let pendingMouseMove = false;
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
      
      if (!pendingMouseMove) {
        pendingMouseMove = true;
        requestAnimationFrame(() => {
          // 20% 概率添加粒子，减少粒子数量
          if (Math.random() > 0.8 && particles.length < 30) {
            particles.push({
              x: mouseRef.current.x,
              y: mouseRef.current.y,
              size: Math.random() * 10 + 5,
              opacity: 0.4,
              scale: 1
            });
          }
          pendingMouseMove = false;
        });
      }
    };

    // 动画循环
    const animate = (time: number) => {
      // 限制帧率到 30fps 以节省 CPU
      if (time - lastTimeRef.current < 33) {
        rafRef.current = requestAnimationFrame(animate);
        return;
      }
      lastTimeRef.current = time;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 更新和绘制粒子
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.opacity -= 0.02;
        p.scale += 0.03;

        if (p.opacity <= 0) {
          particles.splice(i, 1);
          continue;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * p.scale, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(30, 58, 138, ${p.opacity})`;
        ctx.filter = 'blur(5px)';
        ctx.fill();
      }

      // 绘制主光标
      ctx.beginPath();
      ctx.arc(mouseRef.current.x, mouseRef.current.y, 10, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(30, 58, 138, 0.5)';
      ctx.fill();

      rafRef.current = requestAnimationFrame(animate);
    };

    // 处理窗口大小变化
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(rafRef.current);
      if (canvasRef.current && document.body.contains(canvasRef.current)) {
        document.body.removeChild(canvasRef.current);
      }
    };
  }, []);
};

// 使用 memo 包裹主要组件以避免不必要的重渲染
const MemoizedNavbar = memo(Navbar);
const MemoizedHero = memo(Hero);
const MemoizedFooter = memo(Footer);

// 加载状态组件
const LoadingFallback: React.FC<{ height?: string }> = ({ height = 'h-96' }) => (
  <div className={`${height} flex items-center justify-center bg-slate-50`}>
    <div className="text-center">
      <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-800 mb-4"></div>
      <p className="text-slate-600 text-sm">加载中...</p>
    </div>
  </div>
);

// 首页组件
const HomePage: React.FC = () => {
  useInkTrailCanvas();
  
  return (
    <div className="min-h-screen flex flex-col relative">
      <LanguageSuggestion />
      <main className="flex-grow">
        <MemoizedHero />
        <Suspense fallback={<LoadingFallback height="h-screen" />}>
          <DataDashboard />
        </Suspense>
        <Suspense fallback={<LoadingFallback height="h-96" />}>
          <ProductShowcase />
        </Suspense>
        <Suspense fallback={<LoadingFallback height="h-96" />}>
          <AIGenerator />
        </Suspense>
      </main>
      <MemoizedFooter />
    </div>
  );
};

function App() {
  return (
    <Router>
      <MemoizedNavbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/shop" element={<ShopPage />} />
      </Routes>
    </Router>
  );
}

export default App;
