# 设计文档

## 概述

本设计文档描述了南通蓝印花布全球活化平台的技术架构和实现方案。该平台将现有的"墨韵智汇"系统重新聚焦于南通蓝印花布，通过整合DeepSeek-V3（文本逻辑）和Doubao-Seedream（视觉生成）两个国产AI模型，打造一个集文化传承、智能定制、数据可视化于一体的沉浸式电商平台。

核心设计理念：
- **文化优先**: 将南通蓝印花布的工艺、纹样、历史作为核心内容
- **AI赋能**: 利用双模型架构提供智能化的文化解读和视觉生成
- **场景驱动**: 围绕"亲子、宴席、空间"三大场景设计产品和交互
- **性能优化**: 确保3D渲染和AI调用不影响用户体验
- **全球化**: 支持多语言和跨境交易

## 架构

### 系统架构图

```
┌─────────────────────────────────────────────────────────────┐
│                        前端层 (React)                        │
├─────────────────────────────────────────────────────────────┤
│  Hero区域    │  数据大屏   │  产品展示   │  AI工坊         │
│  (品牌展示)  │  (Globe3D)  │  (三场景)   │  (双模型)       │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                      服务层 (Services)                       │
├──────────────────────────┬──────────────────────────────────┤
│  DeepSeek Service        │  Doubao Service                  │
│  - 文化解读              │  - 纹样生成                      │
│  - 文案生成              │  - 效果图预览                    │
│  - 搭配推荐              │  - 空间模拟                      │
└──────────────────────────┴──────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                    外部API (Volces ARK)                      │
├──────────────────────────┬──────────────────────────────────┤
│  deepseek-v3-2-251201    │  doubao-seedream-4-5-251128      │
└──────────────────────────┴──────────────────────────────────┘
```

### 技术栈

**前端框架**:
- React 19.2.3 + TypeScript
- Vite 6.2.0 (构建工具)
- TailwindCSS 4.1.18 (样式)

**3D渲染**:
- Three.js 0.160.0
- WebGL + GLSL Shader

**数据可视化**:
- Recharts 3.6.0 (图表)
- 自定义Canvas动画

**AI集成**:
- Volces ARK API (火山引擎)
- DeepSeek-V3-2-251201 (文本)
- Doubao-Seedream-4-5-251128 (图像)

## 组件和接口

### 核心组件结构

#### 1. Hero组件 (Hero.tsx)

**职责**: 品牌展示和首屏视觉冲击

**更新内容**:
```typescript
interface HeroProps {
  brandName: string; // "墨韵智汇：南通蓝印花布全球活化方案"
  tagline: string;   // "不止于布，是一场可生活的东方美学复兴"
  subtitle: string;  // 针对不同市场的情感化文案
}
```

**关键特性**:
- 靛蓝色主题 (#1e3a8a, #3b82f6)
- ThreeBackground组件展示蓝印花布纹样粒子效果
- 双CTA按钮：探索市场数据 / AI灵感工坊

#### 2. Globe3D组件 (Globe3D.tsx)

**职责**: 展示全球市场分布和贸易路线

**接口定义**:
```typescript
interface Globe3DProps {
  tradeRoutes: TradeRoute[];
  marketHotspots: MarketHotspot[];
  autoRotate?: boolean;
  interactionEnabled?: boolean;
}

interface TradeRoute {
  from: CityCoordinate;  // 南通为起点
  to: CityCoordinate;
  volume: number;        // 贸易量
  color: string;         // 路线颜色
}

interface MarketHotspot {
  city: string;
  coordinate: CityCoordinate;
  orderCount: number;
  visitCount: number;
  heatLevel: 'low' | 'medium' | 'high';
}

interface CityCoordinate {
  lat: number;
  lon: number;
  name: string;
}
```

**性能优化**:
- Intersection Observer: 视口外暂停渲染
- 帧率限制: 30fps
- 几何体细分降低: 64→32
- 粒子数量控制: 最多2个/路线

#### 3. DataDashboard组件 (DataDashboard.tsx)

**职责**: 数据可视化大屏

**子组件**:
```typescript
// 全球热力图
<Globe3D 
  tradeRoutes={routes}
  marketHotspots={hotspots}
/>

// 价格对比雷达图
<PriceComparisonChart 
  platforms={['Amazon', 'Etsy', 'eBay', '本平台']}
  products={blueCalicoPrices}
/>

// 趋势曲线
<TrendChart 
  data={monthlyTrends}
  metrics={['搜索热度', '销售额', '收藏量']}
/>

// 实时交易流
<LiveTransactionFeed 
  events={realtimeEvents}
  maxDisplay={5}
/>
```

#### 4. ProductShowcase组件 (ProductShowcase.tsx)

**职责**: 三大场景产品展示

**场景配置**:
```typescript
interface ScenarioConfig {
  id: 'parent-child' | 'banquet' | 'space';
  title: string;
  description: string;
  products: Product[];
  aiFeatures: AIFeature[];
}

const scenarios: ScenarioConfig[] = [
  {
    id: 'parent-child',
    title: '手作时光 · 亲子成长',
    description: '让孩子在靛蓝纹样里，读懂一个流传千年的吉祥故事',
    products: [
      {
        name: '手作锦囊DIY包',
        includes: ['预制刮浆布料', '天然靛蓝染料', '纹样解说书'],
        aiFeature: '扫码查看儿童版非遗故事'
      }
    ],
    aiFeatures: ['文化科普生成', '染色效果预览']
  },
  {
    id: 'banquet',
    title: '宴设青蓝 · 婚宴旅拍',
    description: '靛蓝画卷替代签到本，成为可传家的艺术品',
    products: [
      {
        name: '靛蓝画卷',
        customization: '含新人姓名字母缩写的吉祥纹样'
      },
      {
        name: '桌旗定制',
        customization: '根据婚宴主题AI生成纹样'
      }
    ],
    aiFeatures: ['宴席3D效果图', '祝词生成']
  },
  {
    id: 'space',
    title: '空间诗学 · 家居软装',
    description: '将蓝印花布解构为屏风、挂画、透光灯罩',
    products: [
      {
        name: '软装诗布',
        types: ['屏风', '挂画', '透光灯罩']
      }
    ],
    aiFeatures: ['房间照片分析', '色调搭配推荐', '光效模拟']
  }
];
```

#### 5. AIGenerator组件 (AIGenerator.tsx)

**职责**: AI双模型交互界面

**接口定义**:
```typescript
interface AIGeneratorProps {
  mode: 'text' | 'image' | 'combined';
}

interface AIRequest {
  type: 'pattern-explanation' | 'image-generation' | 'room-analysis';
  input: string | File;
  options?: {
    language?: 'zh' | 'en';
    style?: 'traditional' | 'modern';
    targetAudience?: 'adult' | 'child';
  };
}

interface AIResponse {
  text?: {
    content: string;
    source: 'deepseek-v3';
    tokens: number;
  };
  image?: {
    url: string;
    source: 'doubao-seedream';
    size: string;
  };
  error?: string;
}
```

### 服务层接口

#### DeepSeek Service

```typescript
// services/deepseekService.ts
class DeepSeekService {
  private apiKey: string;
  private baseURL: string = 'https://ark.cn-beijing.volces.com/api/v3';
  
  /**
   * 生成纹样文化解读
   */
  async generatePatternExplanation(
    patternName: string,
    targetAudience: 'adult' | 'child' = 'adult'
  ): Promise<string> {
    const systemPrompt = targetAudience === 'child' 
      ? '你是一位善于给儿童讲故事的非遗传承人，用简单生动的语言解释传统纹样。'
      : '你是南通蓝印花布的文化专家，深入解读纹样的历史渊源和文化寓意。';
    
    const userPrompt = `请解释南通蓝印花布中"${patternName}"纹样的文化含义、历史背景和吉祥寓意。`;
    
    return this.callAPI(systemPrompt, userPrompt);
  }
  
  /**
   * 生成营销文案
   */
  async generateMarketingCopy(
    product: Product,
    market: 'domestic' | 'overseas'
  ): Promise<string> {
    const context = market === 'overseas'
      ? '目标客户是海外华人，强调乡愁和文化连接'
      : '目标客户是国内中产家庭，强调健康和教育价值';
    
    const prompt = `为以下产品生成营销文案：${product.name}。${context}`;
    
    return this.callAPI('你是专业的文化产品营销专家', prompt);
  }
  
  /**
   * 分析房间照片并推荐搭配
   */
  async analyzeRoomAndRecommend(
    roomDescription: string
  ): Promise<RecommendationResult> {
    const prompt = `
      用户房间描述：${roomDescription}
      请分析色调风格，并推荐3种适合的南通蓝印花布软装方案。
      每个方案包括：纹样选择、布局建议、理由说明。
    `;
    
    const response = await this.callAPI(
      '你是室内设计专家，擅长中式美学搭配',
      prompt
    );
    
    return this.parseRecommendation(response);
  }
  
  private async callAPI(
    systemContent: string,
    userContent: string
  ): Promise<string> {
    const response = await fetch(`${this.baseURL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`
      },
      body: JSON.stringify({
        model: 'deepseek-v3-2-251201',
        messages: [
          { role: 'system', content: systemContent },
          { role: 'user', content: userContent }
        ]
      })
    });
    
    const data = await response.json();
    return data.choices[0].message.content;
  }
}
```

#### Doubao Service

```typescript
// services/doubaoService.ts
class DoubaoService {
  private apiKey: string;
  private baseURL: string = 'https://ark.cn-beijing.volces.com/api/v3';
  
  /**
   * 生成蓝印花布纹样效果图
   */
  async generatePatternImage(
    patternName: string,
    options: ImageGenerationOptions = {}
  ): Promise<string> {
    const prompt = this.buildPrompt(patternName, options);
    
    const response = await fetch(`${this.baseURL}/images/generations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`
      },
      body: JSON.stringify({
        model: 'doubao-seedream-4-5-251128',
        prompt: prompt,
        size: options.size || '2K',
        response_format: 'url',
        watermark: true,
        sequential_image_generation: 'disabled',
        stream: false
      })
    });
    
    const data = await response.json();
    return data.data[0].url;
  }
  
  /**
   * 构建专业的Prompt
   */
  private buildPrompt(
    patternName: string,
    options: ImageGenerationOptions
  ): string {
    const baseElements = [
      '南通蓝印花布 (Nantong Blue Calico)',
      '刮浆印染纹理 (Scraping Paste Dyeing Texture)',
      '植物靛蓝 Natural Indigo',
      '冰裂纹 (Ice Crack Pattern)',
      '手工质感 (Handmade Texture)',
      '宣纸底纹 (Rice Paper Background)'
    ];
    
    const patternDescription = `传统吉祥纹样：${patternName}`;
    
    const styleModifiers = [
      '高精度细节',
      '柔和光影',
      '东方美学',
      '留白艺术',
      options.style === 'modern' ? '现代简约' : '传统工艺'
    ];
    
    return [
      ...baseElements,
      patternDescription,
      ...styleModifiers
    ].join(', ');
  }
  
  /**
   * 预览染色效果
   */
  async previewDyeingEffect(
    userSketchUrl: string,
    patternName: string
  ): Promise<string> {
    // 注意：这需要图生图功能，当前API可能不支持
    // 这里展示接口设计，实际实现可能需要调整
    const prompt = `
      将用户草图转换为南通蓝印花布风格，
      应用${patternName}纹样，
      保持靛蓝色调和刮浆印染质感
    `;
    
    return this.generatePatternImage(patternName, {
      referenceImage: userSketchUrl
    });
  }
}

interface ImageGenerationOptions {
  size?: '1K' | '2K' | '4K';
  style?: 'traditional' | 'modern';
  referenceImage?: string;
}
```

## 数据模型

### 产品数据模型

```typescript
interface Product {
  id: string;
  name: string;
  nameEn: string;
  scenario: 'parent-child' | 'banquet' | 'space';
  
  // 基本信息
  description: string;
  price: number;
  currency: string;
  
  // 蓝印花布特性
  pattern: Pattern;
  craftsmanship: CraftsmanshipDetail;
  material: Material;
  
  // 视觉资源
  images: string[];
  aiGeneratedPreview?: string;
  
  // 定制选项
  customizable: boolean;
  customizationOptions?: CustomizationOption[];
  
  // 市场数据
  trend: 'up' | 'down' | 'stable';
  competitorPrices: CompetitorPrice[];
  
  tags: string[];
}

interface Pattern {
  name: string;
  nameEn: string;
  category: '吉祥纹样' | '自然纹样' | '几何纹样';
  culturalMeaning: string;  // DeepSeek生成
  historicalOrigin: string; // DeepSeek生成
  symbolism: string[];
}

interface CraftsmanshipDetail {
  technique: '刮浆印染' | '扎染' | '蜡染';
  dyeMaterial: '天然靛蓝' | '化学染料';
  artisan?: {
    name: string;
    experience: number;
    location: '南通';
  };
  productionTime: number; // 天数
}

interface Material {
  fabric: '纯棉' | '麻' | '丝';
  weight: number; // 克/平方米
  size: {
    width: number;
    height: number;
    unit: 'cm' | 'm';
  };
}

interface CustomizationOption {
  type: 'pattern' | 'size' | 'text' | 'color-intensity';
  label: string;
  options: string[] | { min: number; max: number };
  aiAssisted: boolean; // 是否有AI辅助
}

interface CompetitorPrice {
  platform: 'Amazon' | 'Etsy' | 'eBay' | 'Taobao';
  price: number;
  currency: string;
  url: string;
  lastUpdated: Date;
}
```

### 市场数据模型

```typescript
interface MarketData {
  globalHeatmap: HeatmapData[];
  priceComparison: PriceComparisonData;
  trends: TrendData[];
  liveTransactions: TransactionEvent[];
}

interface HeatmapData {
  country: string;
  city: string;
  coordinate: { lat: number; lon: number };
  metrics: {
    visits: number;
    orders: number;
    revenue: number;
    growthRate: number; // 百分比
  };
  heatLevel: number; // 0-100
}

interface PriceComparisonData {
  category: string;
  platforms: {
    name: string;
    avgPrice: number;
    priceRange: { min: number; max: number };
    sampleSize: number;
  }[];
  ourPosition: 'competitive' | 'premium' | 'budget';
}

interface TrendData {
  month: string;
  searchVolume: number;
  salesVolume: number;
  avgPrice: number;
  topPatterns: string[];
}

interface TransactionEvent {
  id: string;
  timestamp: Date;
  type: 'view' | 'favorite' | 'purchase';
  location: string;
  product: string;
  anonymous: boolean;
}
```

### AI交互数据模型

```typescript
interface AIInteraction {
  id: string;
  userId?: string;
  timestamp: Date;
  type: 'pattern-explanation' | 'image-generation' | 'room-analysis';
  
  input: {
    text?: string;
    image?: string;
    options: Record<string, any>;
  };
  
  output: {
    deepseek?: {
      content: string;
      tokens: number;
      latency: number; // ms
    };
    doubao?: {
      imageUrl: string;
      size: string;
      latency: number; // ms
    };
  };
  
  feedback?: {
    rating: 1 | 2 | 3 | 4 | 5;
    comment?: string;
  };
}
```



## 错误处理

### API调用错误处理

**DeepSeek API错误**:
```typescript
class DeepSeekError extends Error {
  constructor(
    public code: 'RATE_LIMIT' | 'INVALID_KEY' | 'TIMEOUT' | 'SERVER_ERROR',
    public message: string,
    public retryable: boolean
  ) {
    super(message);
  }
}

// 错误处理策略
const handleDeepSeekError = (error: DeepSeekError): string => {
  switch (error.code) {
    case 'RATE_LIMIT':
      return '请求过于频繁，请稍后再试';
    case 'INVALID_KEY':
      return 'API密钥无效，请联系管理员';
    case 'TIMEOUT':
      if (error.retryable) {
        // 自动重试，最多3次
        return retryWithBackoff(3);
      }
      return '请求超时，请重试';
    case 'SERVER_ERROR':
      return '服务暂时不可用，请稍后再试';
    default:
      return '未知错误，请联系技术支持';
  }
};
```

**Doubao API错误**:
```typescript
class DoubaoError extends Error {
  constructor(
    public code: 'CONTENT_FILTER' | 'INVALID_PROMPT' | 'QUOTA_EXCEEDED' | 'GENERATION_FAILED',
    public message: string
  ) {
    super(message);
  }
}

const handleDoubaoError = (error: DoubaoError): string => {
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
};
```

### 3D渲染错误处理

```typescript
// Globe3D组件错误边界
class Globe3DErrorBoundary extends React.Component<Props, State> {
  state = { hasError: false, error: null };
  
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }
  
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Globe3D渲染错误:', error, errorInfo);
    
    // 降级方案：显示静态地图
    this.setState({ 
      fallbackMode: 'static-map' 
    });
  }
  
  render() {
    if (this.state.hasError) {
      return <StaticGlobeMap data={this.props.data} />;
    }
    
    return this.props.children;
  }
}
```

### 用户输入验证

```typescript
// 定制表单验证
interface ValidationRule {
  field: string;
  validator: (value: any) => boolean;
  errorMessage: string;
}

const customizationValidation: ValidationRule[] = [
  {
    field: 'patternName',
    validator: (v) => v && v.length > 0 && v.length <= 20,
    errorMessage: '纹样名称必须在1-20个字符之间'
  },
  {
    field: 'customText',
    validator: (v) => !v || v.length <= 50,
    errorMessage: '定制文字不能超过50个字符'
  },
  {
    field: 'size',
    validator: (v) => v.width > 0 && v.height > 0 && v.width <= 500 && v.height <= 500,
    errorMessage: '尺寸必须在1-500cm之间'
  }
];

const validateCustomization = (data: CustomizationData): ValidationResult => {
  const errors: string[] = [];
  
  for (const rule of customizationValidation) {
    if (!rule.validator(data[rule.field])) {
      errors.push(rule.errorMessage);
    }
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
};
```

### 网络错误处理

```typescript
// 统一的网络请求包装器
const fetchWithRetry = async (
  url: string,
  options: RequestInit,
  maxRetries: number = 3
): Promise<Response> => {
  let lastError: Error;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch(url, {
        ...options,
        signal: AbortSignal.timeout(10000) // 10秒超时
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      return response;
    } catch (error) {
      lastError = error as Error;
      
      // 指数退避
      if (i < maxRetries - 1) {
        await new Promise(resolve => 
          setTimeout(resolve, Math.pow(2, i) * 1000)
        );
      }
    }
  }
  
  throw new Error(`请求失败（已重试${maxRetries}次）: ${lastError.message}`);
};
```

## 测试策略

### 单元测试

**测试框架**: Vitest (与Vite集成良好)

**测试覆盖范围**:

1. **服务层测试**:
```typescript
// services/deepseekService.test.ts
describe('DeepSeekService', () => {
  it('应正确生成纹样解读', async () => {
    const service = new DeepSeekService(mockApiKey);
    const result = await service.generatePatternExplanation('五福捧寿');
    
    expect(result).toContain('五福');
    expect(result).toContain('寓意');
  });
  
  it('应处理API错误', async () => {
    const service = new DeepSeekService('invalid-key');
    
    await expect(
      service.generatePatternExplanation('测试')
    ).rejects.toThrow(DeepSeekError);
  });
});

// services/doubaoService.test.ts
describe('DoubaoService', () => {
  it('应生成正确的Prompt', () => {
    const service = new DoubaoService(mockApiKey);
    const prompt = service['buildPrompt']('松鹤长春', {});
    
    expect(prompt).toContain('南通蓝印花布');
    expect(prompt).toContain('刮浆印染');
    expect(prompt).toContain('松鹤长春');
  });
});
```

2. **组件测试**:
```typescript
// components/ProductShowcase.test.tsx
describe('ProductShowcase', () => {
  it('应渲染三个场景卡片', () => {
    render(<ProductShowcase />);
    
    expect(screen.getByText('手作时光')).toBeInTheDocument();
    expect(screen.getByText('宴设青蓝')).toBeInTheDocument();
    expect(screen.getByText('空间诗学')).toBeInTheDocument();
  });
  
  it('点击场景应展开详情', async () => {
    render(<ProductShowcase />);
    
    const parentChildCard = screen.getByText('手作时光');
    await userEvent.click(parentChildCard);
    
    expect(screen.getByText('手作锦囊DIY包')).toBeVisible();
  });
});
```

3. **工具函数测试**:
```typescript
// utils/coordinate.test.ts
describe('latLonToVector3', () => {
  it('应正确转换北京坐标', () => {
    const vector = latLonToVector3(39.90, 116.40, 5);
    
    expect(vector.x).toBeCloseTo(-3.14, 1);
    expect(vector.y).toBeCloseTo(3.21, 1);
    expect(vector.z).toBeCloseTo(2.89, 1);
  });
});
```

### 属性测试 (Property-Based Testing)

**测试框架**: fast-check

**配置要求**:
- 每个属性测试至少运行100次迭代
- 每个测试必须标注对应的设计文档属性编号
- 标注格式: `// Feature: nantong-blue-calico-refocus, Property X: [属性描述]`

**属性测试示例**:

```typescript
import fc from 'fast-check';

// 属性测试：坐标转换的往返一致性
describe('Coordinate Conversion Properties', () => {
  it('vector3转经纬度再转回应保持一致', () => {
    // Feature: nantong-blue-calico-refocus, Property 1: 坐标转换往返一致性
    fc.assert(
      fc.property(
        fc.float({ min: -90, max: 90 }),  // 纬度
        fc.float({ min: -180, max: 180 }), // 经度
        fc.float({ min: 1, max: 10 }),     // 半径
        (lat, lon, radius) => {
          const vector = latLonToVector3(lat, lon, radius);
          const { lat: lat2, lon: lon2 } = vector3ToLatLon(vector);
          
          expect(lat2).toBeCloseTo(lat, 1);
          expect(lon2).toBeCloseTo(lon, 1);
        }
      ),
      { numRuns: 100 }
    );
  });
});

// 属性测试：Prompt构建的完整性
describe('Doubao Prompt Properties', () => {
  it('生成的Prompt应始终包含核心元素', () => {
    // Feature: nantong-blue-calico-refocus, Property 2: Prompt完整性
    fc.assert(
      fc.property(
        fc.string({ minLength: 1, maxLength: 20 }), // 纹样名称
        fc.constantFrom('traditional', 'modern'),    // 风格
        (patternName, style) => {
          const service = new DoubaoService(mockApiKey);
          const prompt = service['buildPrompt'](patternName, { style });
          
          // 必须包含的核心元素
          expect(prompt).toContain('南通蓝印花布');
          expect(prompt).toContain('刮浆印染');
          expect(prompt).toContain('植物靛蓝');
          expect(prompt).toContain(patternName);
        }
      ),
      { numRuns: 100 }
    );
  });
});

// 属性测试：价格比较的逻辑正确性
describe('Price Comparison Properties', () => {
  it('我们的价格应在合理范围内', () => {
    // Feature: nantong-blue-calico-refocus, Property 3: 价格合理性
    fc.assert(
      fc.property(
        fc.array(
          fc.record({
            platform: fc.constantFrom('Amazon', 'Etsy', 'eBay'),
            price: fc.float({ min: 10, max: 1000 })
          }),
          { minLength: 1, maxLength: 10 }
        ),
        (competitorPrices) => {
          const ourPrice = calculateOurPrice(competitorPrices);
          const avgCompetitorPrice = average(competitorPrices.map(p => p.price));
          
          // 我们的价格应在竞品平均价的0.8-1.5倍之间
          expect(ourPrice).toBeGreaterThanOrEqual(avgCompetitorPrice * 0.8);
          expect(ourPrice).toBeLessThanOrEqual(avgCompetitorPrice * 1.5);
        }
      ),
      { numRuns: 100 }
    );
  });
});
```

### 集成测试

**测试场景**:

1. **AI双模型协同测试**:
```typescript
describe('AI Integration', () => {
  it('应完成完整的纹样定制流程', async () => {
    // 1. 用户输入纹样名称
    const patternName = '五福捧寿';
    
    // 2. DeepSeek生成文化解读
    const explanation = await deepseekService.generatePatternExplanation(patternName);
    expect(explanation).toBeTruthy();
    
    // 3. Doubao生成效果图
    const imageUrl = await doubaoService.generatePatternImage(patternName);
    expect(imageUrl).toMatch(/^https?:\/\//);
    
    // 4. 验证图像可访问
    const imageResponse = await fetch(imageUrl);
    expect(imageResponse.ok).toBe(true);
  });
});
```

2. **3D渲染性能测试**:
```typescript
describe('Globe3D Performance', () => {
  it('应在视口外停止渲染', async () => {
    const { container } = render(<Globe3D />);
    
    // 模拟滚动到视口外
    const observer = new IntersectionObserver(() => {});
    observer.unobserve(container);
    
    // 等待一帧
    await new Promise(resolve => requestAnimationFrame(resolve));
    
    // 验证渲染已停止
    expect(getAnimationFrameCount()).toBe(0);
  });
});
```

### 端到端测试

**测试框架**: Playwright

**关键用户流程**:

1. **首次访问流程**:
```typescript
test('用户首次访问应看到完整的品牌展示', async ({ page }) => {
  await page.goto('/');
  
  // 验证Hero区域
  await expect(page.locator('h1')).toContainText('墨韵智汇');
  await expect(page.locator('text=南通蓝印花布')).toBeVisible();
  
  // 验证水墨拖尾效果
  await page.mouse.move(100, 100);
  await page.mouse.move(200, 200);
  const canvas = page.locator('canvas');
  await expect(canvas).toBeVisible();
});
```

2. **AI生成流程**:
```typescript
test('用户应能生成纹样解读和效果图', async ({ page }) => {
  await page.goto('/#aigc');
  
  // 输入纹样名称
  await page.fill('input[placeholder*="纹样"]', '松鹤长春');
  await page.click('button:has-text("生成")');
  
  // 等待DeepSeek响应
  await expect(page.locator('.cultural-explanation')).toBeVisible({ timeout: 10000 });
  
  // 等待Doubao响应
  await expect(page.locator('img[alt*="效果图"]')).toBeVisible({ timeout: 15000 });
});
```

### 性能测试

**关键指标**:

| 指标 | 目标值 | 测量方法 |
|------|--------|----------|
| 首屏加载时间 (FCP) | < 1.5s | Lighthouse |
| 最大内容绘制 (LCP) | < 2.5s | Lighthouse |
| 交互延迟 (INP) | < 200ms | Chrome DevTools |
| 3D渲染帧率 | ≥ 30fps | Stats.js |
| API响应时间 (DeepSeek) | < 3s | 自定义监控 |
| API响应时间 (Doubao) | < 10s | 自定义监控 |

**性能测试脚本**:
```typescript
describe('Performance Benchmarks', () => {
  it('Canvas粒子系统应保持30fps', async () => {
    const fps = await measureFPS(1000); // 测量1秒
    expect(fps).toBeGreaterThanOrEqual(30);
  });
  
  it('Globe3D在视口外应释放70%GPU', async () => {
    const gpuBefore = await measureGPUUsage();
    
    // 滚动到视口外
    scrollToBottom();
    await wait(100);
    
    const gpuAfter = await measureGPUUsage();
    const reduction = (gpuBefore - gpuAfter) / gpuBefore;
    
    expect(reduction).toBeGreaterThanOrEqual(0.7);
  });
});
```



## 正确性属性

*属性是指在系统所有有效执行中都应该保持为真的特征或行为——本质上是关于系统应该做什么的形式化陈述。属性作为人类可读规范和机器可验证正确性保证之间的桥梁。*

基于需求文档中的验收标准，我们识别出以下可通过属性测试验证的正确性属性：

### 属性 1: 主题颜色一致性
*对于任意*页面滚动位置和交互状态，系统应始终保持靛蓝色调（#1e3a8a, #3b82f6）作为主色调
**验证需求: 1.4**

### 属性 2: 交互反馈存在性
*对于任意*用户交互（鼠标移动、点击），系统应展示靛蓝色的水墨拖尾效果
**验证需求: 1.5**

### 属性 3: 贸易路线起点一致性
*对于任意*显示的贸易路线，其起点坐标应为南通（31.23°N, 121.47°E）
**验证需求: 2.2**

### 属性 4: 地球旋转响应性
*对于任意*鼠标位置变化，3D地球的旋转角度应相应调整，且调整方向与鼠标移动方向一致
**验证需求: 2.3**

### 属性 5: 视口外渲染暂停
*对于任意*不在视口内的3D组件，其渲染循环应处于暂停状态
**验证需求: 2.4**

### 属性 6: 响应式尺寸调整
*对于任意*窗口尺寸变化，3D地球组件的宽高应与容器尺寸保持一致
**验证需求: 2.5**

### 属性 7: AI文化解读生成
*对于任意*有效的纹样关键词输入，系统应调用DeepSeek-V3并返回包含文化含义的文本
**验证需求: 3.1**

### 属性 8: 解读内容展示
*对于任意*DeepSeek-V3返回的非空文本，系统应在产品详情页面的指定区域展示该内容
**验证需求: 3.2**

### 属性 9: Prompt核心元素完整性
*对于任意*纹样名称和生成选项，构建的Doubao Prompt应包含"南通蓝印花布"、"刮浆印染纹理"、"植物靛蓝"这三个核心元素
**验证需求: 3.3**

### 属性 10: 图像URL有效性
*对于任意*Doubao-Seedream返回的图像URL，该URL应可访问且返回有效的图像内容
**验证需求: 3.4**

### 属性 11: API错误友好提示
*对于任意*API调用失败（DeepSeek或Doubao），系统应显示用户友好的错误消息并提供重试按钮
**验证需求: 3.5**

### 属性 12: 场景AI推荐可用性
*对于任意*产品场景（亲子、宴席、空间），系统应提供AI辅助的产品推荐功能
**验证需求: 4.5**

### 属性 13: 纹样文化解读生成
*对于任意*用户选择的纹样，系统应使用DeepSeek-V3生成该纹样的文化寓意说明
**验证需求: 5.1**

### 属性 14: 二维码跳转正确性
*对于任意*产品二维码扫描，系统应跳转到该产品对应的文化百科页面
**验证需求: 5.4**

### 属性 15: 草图染色效果预览
*对于任意*用户上传的设计草图图片，系统应调用Doubao-Seedream生成染色后的效果预览
**验证需求: 6.1**

### 属性 16: 房间照片分析推荐
*对于任意*用户上传的房间照片，系统应使用DeepSeek-V3分析并返回软装推荐方案
**验证需求: 6.2**

### 属性 17: 推荐方案数量下限
*对于任意*AI生成的推荐请求，返回的纹样和布局选项数量应≥3
**验证需求: 6.3**

### 属性 18: 方案3D预览生成
*对于任意*用户选择的推荐方案，系统应生成该方案的3D预览效果
**验证需求: 6.4**

### 属性 19: 定制订单保存完整性
*对于任意*用户确认的定制参数，系统应完整保存所有参数并生成包含这些参数的订单记录
**验证需求: 6.5**

### 属性 20: IP语言识别
*对于任意*访问者的IP地址，系统应识别其地理位置并建议对应的语言选项（中文或英文）
**验证需求: 8.1**

### 属性 21: 产品双语支持
*对于任意*产品详情页面，系统应提供中英双语的纹样解读和工艺说明
**验证需求: 8.4**

### 属性 22: 语言切换状态保持
*对于任意*当前浏览状态（页面位置、购物车内容），语言切换后这些状态应保持不变
**验证需求: 8.5**

### 属性 23: 订单艺人分配
*对于任意*完成的定制订单，系统应自动分配给至少一位南通当地的合作艺人
**验证需求: 9.1**

### 属性 24: 工作流状态转换 - 质检触发
*对于任意*艺人标记为"完成制作"的订单，系统应自动将订单状态更新为"待质检"
**验证需求: 9.2**

### 属性 25: 工作流状态转换 - 物流启动
*对于任意*质检状态为"通过"的订单，系统应启动跨境物流并向用户发送追踪信息
**验证需求: 9.3**

### 属性 26: 基金计算正确性
*对于任意*完成的订单，拨入传承基金的金额应等于订单利润的5%（误差<0.01元）
**验证需求: 9.4**

### 属性 27: 数据点详情展示
*对于任意*用户点击的数据大屏数据点，系统应显示该数据点的详细信息弹窗
**验证需求: 10.4**

### 属性 28: 实时交易流更新
*对于任意*新的交易事件（收藏、购买），系统应在5秒内在数据大屏上显示对应的交易流动画
**验证需求: 10.5**

### 属性反思与优化

经过审查，我们识别出以下可以合并或优化的属性：

- **属性7和属性13**都涉及DeepSeek生成纹样解读，可以合并为一个更通用的属性
- **属性24和属性25**都是工作流状态转换，可以合并为一个状态机属性
- **属性15和属性16**都是AI图像/文本生成，但针对不同输入类型，保持独立更清晰

**优化后的核心属性**（保留原编号以便追溯）：

### 属性 7+13（合并）: AI纹样解读生成
*对于任意*有效的纹样名称（无论来自用户输入还是产品选择），系统应调用DeepSeek-V3并返回包含文化含义、历史背景和吉祥寓意的文本
**验证需求: 3.1, 5.1**

### 属性 24+25（合并）: 订单工作流状态转换
*对于任意*订单状态变更（艺人完成→质检、质检通过→物流），系统应自动触发下一阶段的流程并更新订单状态
**验证需求: 9.2, 9.3**

