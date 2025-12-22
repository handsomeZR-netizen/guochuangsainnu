export interface Product {
  id: string;
  name: string;
  nameEn: string;
  price: number;
  currency: string;
  image: string;
  description: string;
  craftsmanship: string;
  trend: 'up' | 'down' | 'stable';
  tags: string[];
}

// 场景相关类型
export interface ScenarioProduct {
  id: string;
  name: string;
  nameEn: string;
  price: number;
  currency: string;
  image: string;
  description: string;
  includes?: string[];
  customization?: string;
  types?: string[];
  pattern?: {
    name: string;
    nameEn: string;
    culturalMeaning?: string;
  };
}

// 纹样数据库类型
export interface Pattern {
  id: string;
  name: string;
  nameEn: string;
  category: '吉祥纹样' | '自然纹样' | '几何纹样';
  image: string;
  thumbnail: string;
  
  // 基础文化信息（静态）
  basicInfo: {
    symbolism: string[];
    occasion: string[];
    era: string;
  };
  
  // 详细解读（可由DeepSeek动态生成）
  culturalMeaning?: string;
  historicalOrigin?: string;
  
  // 使用场景
  suitableFor: Array<'parent-child' | 'banquet' | 'space'>;
  
  // 标签
  tags: string[];
}

export interface AIFeature {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export interface ScenarioConfig {
  id: 'parent-child' | 'banquet' | 'space';
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
  icon: string;
  bgColor: string;
  products: ScenarioProduct[];
  aiFeatures: AIFeature[];
}

export interface MarketData {
  platform: string;
  price: number;
  volume: number;
}

export interface TrendData {
  month: string;
  interest: number;
  value: number;
}

export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
  image?: string;
}

export enum SectionId {
  HERO = 'hero',
  DASHBOARD = 'dashboard',
  PRODUCTS = 'products',
  AIGC = 'aigc',
  COMMUNITY = 'community'
}

// 定制和订单相关类型
export interface CustomizationData {
  patternId: string;
  patternName: string;
  customText?: string;
  size: {
    width: number;
    height: number;
    unit: 'cm' | 'm';
  };
  quantity: number;
  notes?: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

export interface Order {
  id: string;
  customization: CustomizationData;
  productId: string;
  productName: string;
  totalPrice: number;
  currency: string;
  status: OrderStatus;
  artisan?: Artisan;
  createdAt: Date;
  updatedAt: Date;
  fundContribution: number; // 5% 利润拨入传承基金
}

export type OrderStatus = 
  | 'pending'        // 待处理
  | 'assigned'       // 已分配艺人
  | 'in-production'  // 制作中
  | 'quality-check'  // 质检中
  | 'passed'         // 质检通过
  | 'shipping'       // 物流中
  | 'completed'      // 已完成
  | 'cancelled';     // 已取消

export interface Artisan {
  id: string;
  name: string;
  experience: number; // 年数
  location: string;   // 南通
  specialties: string[]; // 擅长的纹样类型
  currentOrders: number; // 当前订单数
  rating: number; // 评分 1-5
}