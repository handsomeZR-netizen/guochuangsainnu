import React, { Suspense, lazy, memo, useRef, useState, useEffect } from 'react';
import { SectionId } from '../types';
import { TrendingUp, Globe, Activity, ShieldCheck, Zap, ShoppingCart, Heart, Eye } from 'lucide-react';

// 懒加载 Recharts 组件
const LazyAreaChart = lazy(() => import('recharts').then(mod => ({ default: mod.AreaChart })));
const LazyArea = lazy(() => import('recharts').then(mod => ({ default: mod.Area })));
const LazyXAxis = lazy(() => import('recharts').then(mod => ({ default: mod.XAxis })));
const LazyYAxis = lazy(() => import('recharts').then(mod => ({ default: mod.YAxis })));
const LazyCartesianGrid = lazy(() => import('recharts').then(mod => ({ default: mod.CartesianGrid })));
const LazyTooltip = lazy(() => import('recharts').then(mod => ({ default: mod.Tooltip })));
const LazyResponsiveContainer = lazy(() => import('recharts').then(mod => ({ default: mod.ResponsiveContainer })));
const LazyRadarChart = lazy(() => import('recharts').then(mod => ({ default: mod.RadarChart })));
const LazyRadar = lazy(() => import('recharts').then(mod => ({ default: mod.Radar })));
const LazyPolarGrid = lazy(() => import('recharts').then(mod => ({ default: mod.PolarGrid })));
const LazyPolarAngleAxis = lazy(() => import('recharts').then(mod => ({ default: mod.PolarAngleAxis })));
const LazyPolarRadiusAxis = lazy(() => import('recharts').then(mod => ({ default: mod.PolarRadiusAxis })));

// 懒加载 Globe3D
const LazyGlobe3D = lazy(() => import('./Globe3D'));

// 过去12个月趋势数据 - 搜索热度和销售额
const trendData = [
  { month: '1月', searchVolume: 1200, sales: 8500 },
  { month: '2月', searchVolume: 1350, sales: 9200 },
  { month: '3月', searchVolume: 1180, sales: 8800 },
  { month: '4月', searchVolume: 1520, sales: 10500 },
  { month: '5月', searchVolume: 1890, sales: 12800 },
  { month: '6月', searchVolume: 2100, sales: 14200 },
  { month: '7月', searchVolume: 2350, sales: 15800 },
  { month: '8月', searchVolume: 2180, sales: 14900 },
  { month: '9月', searchVolume: 2420, sales: 16500 },
  { month: '10月', searchVolume: 2680, sales: 18200 },
  { month: '11月', searchVolume: 2950, sales: 20100 },
  { month: '12月', searchVolume: 3200, sales: 22500 },
];

// 交易事件类型
interface TransactionEvent {
  id: string;
  timestamp: Date;
  type: 'view' | 'favorite' | 'purchase';
  location: string;
  product: string;
  price?: number;
}

// 生成模拟交易事件
const generateTransactionEvent = (): TransactionEvent => {
  const types: Array<'view' | 'favorite' | 'purchase'> = ['view', 'favorite', 'purchase'];
  const locations = ['北京', '上海', '纽约', '伦敦', '东京', '巴黎', '悉尼', '多伦多', '新加坡', '首尔'];
  const products = [
    '五福捧寿手作锦囊',
    '松鹤长春靛蓝画卷',
    '冰裂纹软装诗布',
    '传统刮浆印染桌旗',
    '植物靛蓝透光灯罩',
    '吉祥纹样屏风',
  ];
  
  const type = types[Math.floor(Math.random() * types.length)];
  const location = locations[Math.floor(Math.random() * locations.length)];
  const product = products[Math.floor(Math.random() * products.length)];
  const price = type === 'purchase' ? Math.floor(Math.random() * 500) + 200 : undefined;
  
  return {
    id: `txn-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    timestamp: new Date(),
    type,
    location,
    product,
    price,
  };
};

// 价格对比数据 - 南通蓝印花布产品与竞品平台对比
const priceComparisonData = [
  { platform: 'Amazon', price: 85, fullMark: 100 },
  { platform: 'Shopee', price: 92, fullMark: 100 },
  { platform: 'eBay', price: 78, fullMark: 100 },
  { platform: '本平台', price: 68, fullMark: 100 },
];

// 图表加载占位符
const ChartPlaceholder = memo(() => (
  <div className="h-56 w-full flex items-center justify-center bg-slate-50 animate-pulse">
    <span className="text-slate-400 text-sm">加载图表中...</span>
  </div>
));

// Globe 加载占位符
const GlobePlaceholder = memo(() => (
  <div className="absolute inset-0 flex items-center justify-center bg-slate-900">
    <div className="text-blue-400 text-sm animate-pulse">加载 3D 地球中...</div>
  </div>
));

// 使用 Intersection Observer 实现懒加载
const useInView = (threshold = 0.1) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect(); // 只触发一次
        }
      },
      { threshold }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [threshold]);

  return { ref, isInView };
};

// 趋势曲线图表组件 - 书法笔触风格
const TrendChart = memo(() => {
  const { ref, isInView } = useInView();

  return (
    <div ref={ref} className="bg-white p-4 sm:p-6 border border-slate-100 shadow-xl shadow-slate-200/50 rounded-sm relative group hover:border-blue-200 transition-colors">
      <div className="flex justify-between items-center mb-3 sm:mb-4">
        <h3 className="text-base sm:text-lg font-bold text-slate-800 flex items-center gap-2 font-serif">
          <TrendingUp size={18} className="text-blue-800" /> 
          <span className="hidden sm:inline">12个月趋势分析</span>
          <span className="sm:hidden">趋势分析</span>
        </h3>
        <div className="text-xs text-slate-400 font-mono border px-2 py-0.5 rounded">LIVE</div>
      </div>
      <div className="h-36 sm:h-44 w-full">
        {isInView ? (
          <Suspense fallback={<ChartPlaceholder />}>
            <LazyResponsiveContainer width="100%" height="100%">
              <LazyAreaChart data={trendData}>
                <defs>
                  <linearGradient id="colorSearch" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1e3a8a" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#1e3a8a" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <LazyCartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <LazyXAxis 
                  dataKey="month" 
                  stroke="#94a3b8" 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false}
                  interval="preserveStartEnd"
                />
                <LazyYAxis 
                  yAxisId="left"
                  stroke="#1e3a8a" 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false}
                  width={35}
                />
                <LazyYAxis 
                  yAxisId="right"
                  orientation="right"
                  stroke="#3b82f6" 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false}
                  width={35}
                />
                <LazyTooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #e2e8f0', 
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                    borderRadius: '4px',
                    fontSize: '12px'
                  }}
                  itemStyle={{ color: '#0f172a', fontFamily: 'serif', fontSize: 12 }}
                  labelStyle={{ fontWeight: 'bold', marginBottom: 4 }}
                />
                <LazyArea 
                  yAxisId="left"
                  type="natural" 
                  dataKey="searchVolume" 
                  stroke="#1e3a8a" 
                  strokeWidth={2} 
                  fillOpacity={1} 
                  fill="url(#colorSearch)"
                  name="搜索热度"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <LazyArea 
                  yAxisId="right"
                  type="natural" 
                  dataKey="sales" 
                  stroke="#3b82f6" 
                  strokeWidth={2} 
                  fillOpacity={1} 
                  fill="url(#colorSales)"
                  name="销售额"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </LazyAreaChart>
            </LazyResponsiveContainer>
          </Suspense>
        ) : (
          <ChartPlaceholder />
        )}
      </div>
      <div className="mt-2 sm:mt-3 flex items-start gap-2">
        <div className="bg-blue-50 p-1.5 rounded-full text-blue-800 shrink-0">
          <Activity size={14} />
        </div>
        <p className="text-xs text-slate-500 leading-relaxed">
          <span className="font-bold text-slate-800">增长趋势：</span> 
          <span className="hidden sm:inline">南通蓝印花布搜索热度和销售额呈现稳定上升趋势，年度增长率达167%，市场需求持续旺盛。</span>
          <span className="sm:hidden">年度增长率达167%，市场需求旺盛。</span>
        </p>
      </div>
    </div>
  );
});

// 价格对比雷达图组件
const PriceComparisonChart = memo(() => {
  const { ref, isInView } = useInView();

  return (
    <div ref={ref} className="bg-white p-4 sm:p-6 border border-slate-100 shadow-xl shadow-slate-200/50 rounded-sm hover:border-blue-200 transition-colors">
      <div className="flex justify-between items-center mb-3 sm:mb-4">
        <h3 className="text-base sm:text-lg font-bold text-slate-800 flex items-center gap-2 font-serif">
          <ShieldCheck size={18} className="text-blue-800" /> 
          价格对比
        </h3>
        <div className="px-2 py-1 bg-blue-900 text-white text-xs font-bold font-mono tracking-wider">竞争力: 优</div>
      </div>
      <div className="h-36 sm:h-44 w-full flex justify-center">
        {isInView ? (
          <Suspense fallback={<ChartPlaceholder />}>
            <LazyResponsiveContainer width="100%" height="100%">
              <LazyRadarChart cx="50%" cy="50%" outerRadius="70%" data={priceComparisonData}>
                <LazyPolarGrid stroke="#cbd5e1" strokeWidth={1} />
                <LazyPolarAngleAxis 
                  dataKey="platform" 
                  tick={{ fill: '#1e3a8a', fontSize: 11, fontFamily: 'serif', fontWeight: 600 }} 
                />
                <LazyPolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                <LazyRadar 
                  name="价格指数" 
                  dataKey="price" 
                  stroke="#1e3a8a" 
                  strokeWidth={2} 
                  fill="#3b82f6" 
                  fillOpacity={0.25} 
                />
              </LazyRadarChart>
            </LazyResponsiveContainer>
          </Suspense>
        ) : (
          <ChartPlaceholder />
        )}
      </div>
      <div className="mt-2 sm:mt-3 flex items-start gap-2">
        <div className="bg-blue-50 p-1.5 rounded-full text-blue-800 shrink-0">
          <Activity size={14} />
        </div>
        <p className="text-xs text-slate-500 leading-relaxed">
          <span className="font-bold text-slate-800">价格优势：</span> 
          <span className="hidden sm:inline">本平台南通蓝印花布产品价格较Amazon低20%，较Shopee低26%，具有显著竞争优势。</span>
          <span className="sm:hidden">较主流平台低20-26%，竞争优势显著。</span>
        </p>
      </div>
    </div>
  );
});

// Globe 区域组件
const GlobeSection = memo(() => {
  const { ref, isInView } = useInView(0.05);

  return (
    <div ref={ref} className="lg:col-span-7 h-[300px] sm:h-[400px] lg:h-auto bg-slate-900 rounded-sm overflow-hidden relative shadow-2xl">
      {/* 3D Component */}
      <div className="absolute inset-0 z-0">
        {isInView ? (
          <Suspense fallback={<GlobePlaceholder />}>
            <LazyGlobe3D />
          </Suspense>
        ) : (
          <GlobePlaceholder />
        )}
      </div>
      
      {/* Overlay UI on top of Globe */}
      <div className="absolute top-0 left-0 p-4 sm:p-6 z-10 pointer-events-none w-full h-full flex flex-col justify-between">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2 font-serif mb-1 sm:mb-2">
              <Globe className="text-blue-400" size={20} /> 全球文化热力
            </h3>
            <p className="text-blue-200/70 max-w-sm text-xs hidden sm:block">
              实时追踪非遗工艺品跨境流向。光点代表实时交易订单与物流轨迹。
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl sm:text-3xl font-bold text-white font-serif">4,821</div>
            <div className="text-blue-300 text-xs uppercase tracking-widest">今日活跃</div>
          </div>
        </div>

        {/* Stats overlay at bottom */}
        <div className="flex gap-4 sm:gap-6 border-t border-white/10 pt-3 sm:pt-4 backdrop-blur-sm bg-black/20 -mx-4 sm:-mx-6 px-4 sm:px-6 -mb-4 sm:-mb-6 pb-3 sm:pb-4">
          <div>
            <div className="text-lg sm:text-xl font-bold text-blue-400">42%</div>
            <div className="text-slate-400 text-xs uppercase">北美</div>
          </div>
          <div>
            <div className="text-lg sm:text-xl font-bold text-white">28%</div>
            <div className="text-slate-400 text-xs uppercase">欧洲</div>
          </div>
          <div>
            <div className="text-lg sm:text-xl font-bold text-white">18%</div>
            <div className="text-slate-400 text-xs uppercase">亚太</div>
          </div>
        </div>
      </div>
    </div>
  );
});

// 实时交易流组件
const LiveTransactionFeed = memo(() => {
  const [events, setEvents] = useState<TransactionEvent[]>([]);
  const [displayEvents, setDisplayEvents] = useState<TransactionEvent[]>([]);

  // 初始化事件队列
  useEffect(() => {
    const initialEvents = Array.from({ length: 5 }, () => generateTransactionEvent());
    setEvents(initialEvents);
    setDisplayEvents(initialEvents);
  }, []);

  // 每5秒添加新事件
  useEffect(() => {
    const interval = setInterval(() => {
      const newEvent = generateTransactionEvent();
      setEvents(prev => {
        const updated = [newEvent, ...prev].slice(0, 20); // 保持最多20个事件
        return updated;
      });
      
      // 延迟更新显示，创建动画效果
      setTimeout(() => {
        setDisplayEvents(prev => [newEvent, ...prev].slice(0, 10));
      }, 100);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getIcon = (type: TransactionEvent['type']) => {
    switch (type) {
      case 'purchase':
        return <ShoppingCart size={14} className="text-green-400 shrink-0" />;
      case 'favorite':
        return <Heart size={14} className="text-red-400 shrink-0" />;
      case 'view':
        return <Eye size={14} className="text-blue-400 shrink-0" />;
    }
  };

  const getActionText = (type: TransactionEvent['type']) => {
    switch (type) {
      case 'purchase':
        return '购买了';
      case 'favorite':
        return '收藏了';
      case 'view':
        return '浏览了';
    }
  };

  const getTimeAgo = (timestamp: Date) => {
    const seconds = Math.floor((new Date().getTime() - timestamp.getTime()) / 1000);
    if (seconds < 60) return `${seconds}秒前`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}分钟前`;
    const hours = Math.floor(minutes / 60);
    return `${hours}小时前`;
  };

  return (
    <div className="w-full bg-slate-900/95 backdrop-blur-md text-blue-50 overflow-hidden py-3 mb-10 sm:mb-16 border-y border-blue-800 shadow-lg">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex items-center gap-3 sm:gap-4 mb-2">
          <Zap size={16} className="text-yellow-400 animate-pulse shrink-0" />
          <span className="text-xs font-bold tracking-wider text-blue-300">实时交易流</span>
        </div>
        <div className="space-y-1.5 max-h-24 sm:max-h-32 overflow-hidden">
          {displayEvents.slice(0, 5).map((event, index) => (
            <div
              key={event.id}
              className="flex items-center gap-2 sm:gap-3 text-xs font-mono animate-slideIn flex-wrap sm:flex-nowrap"
              style={{ 
                animationDelay: `${index * 50}ms`,
                opacity: 1 - (index * 0.15)
              }}
            >
              {getIcon(event.type)}
              <span className="text-slate-400 shrink-0">{getTimeAgo(event.timestamp)}</span>
              <span className="text-blue-200 hidden sm:inline">来自{event.location}的用户</span>
              <span className="text-blue-200 sm:hidden">{event.location}</span>
              <span className="text-slate-400">{getActionText(event.type)}</span>
              <span className="text-white font-semibold truncate max-w-[120px] sm:max-w-none">{event.product}</span>
              {event.price && (
                <span className="text-green-400 font-bold shrink-0">¥{event.price}</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});

const DataDashboard: React.FC = () => {
  return (
    <section id={SectionId.DASHBOARD} className="py-16 sm:py-24 bg-white/50 backdrop-blur-sm relative" style={{ zIndex: 'auto' }}>
      <div className="container mx-auto px-4 sm:px-6">
        <div className="mb-10 sm:mb-16 text-center">
          <span className="text-blue-800 font-bold tracking-widest text-xs uppercase mb-2 block opacity-70">
            Data Trust System
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl text-slate-900 font-bold mb-3 sm:mb-4 font-serif">
            墨韵数屏 <span className="font-light italic text-blue-900">Intelligence</span>
          </h2>
          <div className="w-16 sm:w-24 h-1 bg-gradient-to-r from-blue-900 to-blue-200 mx-auto mb-4 sm:mb-6"></div>
          <p className="text-slate-600 max-w-2xl mx-auto font-serif text-base sm:text-lg px-2">
            实时价值评估 · 全球需求追踪 · 真伪溯源验证<br/>
            <span className="text-xs sm:text-sm opacity-80 mt-2 block">由墨韵独家 AI 数据引擎驱动，让文化交易透明可视。</span>
          </p>
        </div>

        {/* 实时交易流 */}
        <LiveTransactionFeed />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
          {/* Left Column: Charts (Span 5) */}
          <div className="lg:col-span-5 flex flex-col gap-4 sm:gap-6">
            <TrendChart />
            <PriceComparisonChart />
          </div>

          {/* Right Column: 3D Globe (Span 7) */}
          <GlobeSection />
        </div>
      </div>
    </section>
  );
};

export default memo(DataDashboard);
