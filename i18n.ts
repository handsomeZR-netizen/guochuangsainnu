import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// 中文翻译
const zhTranslations = {
  // 品牌和标语
  brand: {
    name: '墨韵智汇：南通蓝印花布全球活化方案',
    tagline: '不止于布，是一场可生活的东方美学复兴',
    subtitle: '健康染于身，文化养于心'
  },
  
  // 导航
  nav: {
    home: '首页',
    dashboard: '数据大屏',
    products: '产品展示',
    aigc: 'AI工坊',
    community: '社区'
  },
  
  // Hero区域
  hero: {
    cta1: '探索市场数据',
    cta2: 'AI灵感工坊',
    scrollDown: '向下滚动探索更多'
  },
  
  // 场景标题
  scenarios: {
    parentChild: {
      title: '手作时光 · 亲子成长',
      description: '让孩子在靛蓝纹样里，读懂一个流传千年的吉祥故事'
    },
    banquet: {
      title: '宴设青蓝 · 婚宴旅拍',
      description: '靛蓝画卷替代签到本，成为可传家的艺术品'
    },
    space: {
      title: '空间诗学 · 家居软装',
      description: '将蓝印花布解构为屏风、挂画、透光灯罩'
    }
  },
  
  // AI功能
  ai: {
    title: 'AI智能功能',
    patternExplanation: '纹样文化解读',
    imageGeneration: '效果图生成',
    roomAnalysis: '房间分析推荐',
    generating: '生成中...',
    generate: '生成',
    upload: '上传图片',
    inputPlaceholder: '请输入纹样名称或描述...',
    error: '生成失败，请重试',
    retry: '重试'
  },
  
  // 产品相关
  product: {
    price: '价格',
    includes: '包含',
    customization: '定制选项',
    types: '类型',
    pattern: '纹样',
    addToCart: '加入购物车',
    customize: '立即定制',
    viewDetails: '查看',
    scanQR: '扫码查看文化百科'
  },
  
  // 数据大屏
  dashboard: {
    title: '全球市场数据',
    priceComparison: '价格对比',
    trends: '趋势分析',
    liveTransactions: '实时交易',
    platform: '平台',
    avgPrice: '平均价格',
    searchVolume: '搜索量',
    salesVolume: '销售量'
  },
  
  // 定制表单
  customization: {
    title: '产品定制',
    patternName: '纹样名称',
    customText: '定制文字',
    size: '尺寸',
    width: '宽度',
    height: '高度',
    quantity: '数量',
    notes: '备注',
    submit: '提交订单',
    cancel: '取消',
    validation: {
      patternRequired: '请输入纹样名称',
      patternLength: '纹样名称必须在1-20个字符之间',
      textLength: '定制文字不能超过50个字符',
      sizeRange: '尺寸必须在1-500cm之间',
      quantityMin: '数量至少为1'
    }
  },
  
  // 订单状态
  order: {
    status: {
      pending: '待处理',
      assigned: '已分配艺人',
      inProduction: '制作中',
      qualityCheck: '质检中',
      passed: '质检通过',
      shipping: '物流中',
      completed: '已完成',
      cancelled: '已取消'
    },
    artisan: '艺人',
    trackingInfo: '物流追踪',
    fundContribution: '传承基金贡献'
  },
  
  // 通用
  common: {
    loading: '加载中...',
    error: '出错了',
    success: '成功',
    confirm: '确认',
    cancel: '取消',
    save: '保存',
    delete: '删除',
    edit: '编辑',
    close: '关闭',
    more: '更多',
    less: '收起',
    language: '语言',
    switchLanguage: '切换语言'
  },
  
  // 页脚
  footer: {
    about: '关于我们',
    contact: '联系方式',
    terms: '服务条款',
    privacy: '隐私政策',
    copyright: '© 2024 墨韵智汇 版权所有'
  }
};

// 英文翻译
const enTranslations = {
  // Brand and tagline
  brand: {
    name: 'Ink Rhythm Intelligence: Nantong Blue Calico Global Activation',
    tagline: 'More than fabric, a revival of livable Eastern aesthetics',
    subtitle: 'A love letter across the ocean in indigo, written to time'
  },
  
  // Navigation
  nav: {
    home: 'Home',
    dashboard: 'Dashboard',
    products: 'Products',
    aigc: 'AI Workshop',
    community: 'Community'
  },
  
  // Hero section
  hero: {
    cta1: 'Explore Market Data',
    cta2: 'AI Inspiration Workshop',
    scrollDown: 'Scroll down to explore more'
  },
  
  // Scenario titles
  scenarios: {
    parentChild: {
      title: 'Handcraft Time · Parent-Child Growth',
      description: 'Let children understand thousand-year-old auspicious stories through indigo patterns'
    },
    banquet: {
      title: 'Indigo Banquet · Wedding Photography',
      description: 'Indigo scrolls replace guest books, becoming heirloom artworks'
    },
    space: {
      title: 'Space Poetics · Home Furnishing',
      description: 'Deconstructing blue calico into screens, paintings, and translucent lampshades'
    }
  },
  
  // AI features
  ai: {
    title: 'AI Intelligent Features',
    patternExplanation: 'Pattern Cultural Interpretation',
    imageGeneration: 'Effect Image Generation',
    roomAnalysis: 'Room Analysis & Recommendation',
    generating: 'Generating...',
    generate: 'Generate',
    upload: 'Upload Image',
    inputPlaceholder: 'Enter pattern name or description...',
    error: 'Generation failed, please retry',
    retry: 'Retry'
  },
  
  // Product related
  product: {
    price: 'Price',
    includes: 'Includes',
    customization: 'Customization',
    types: 'Types',
    pattern: 'Pattern',
    addToCart: 'Add to Cart',
    customize: 'Customize Now',
    viewDetails: 'View',
    scanQR: 'Scan QR for Cultural Encyclopedia'
  },
  
  // Dashboard
  dashboard: {
    title: 'Global Market Data',
    priceComparison: 'Price Comparison',
    trends: 'Trend Analysis',
    liveTransactions: 'Live Transactions',
    platform: 'Platform',
    avgPrice: 'Avg Price',
    searchVolume: 'Search Volume',
    salesVolume: 'Sales Volume'
  },
  
  // Customization form
  customization: {
    title: 'Product Customization',
    patternName: 'Pattern Name',
    customText: 'Custom Text',
    size: 'Size',
    width: 'Width',
    height: 'Height',
    quantity: 'Quantity',
    notes: 'Notes',
    submit: 'Submit Order',
    cancel: 'Cancel',
    validation: {
      patternRequired: 'Please enter pattern name',
      patternLength: 'Pattern name must be between 1-20 characters',
      textLength: 'Custom text cannot exceed 50 characters',
      sizeRange: 'Size must be between 1-500cm',
      quantityMin: 'Quantity must be at least 1'
    }
  },
  
  // Order status
  order: {
    status: {
      pending: 'Pending',
      assigned: 'Artisan Assigned',
      inProduction: 'In Production',
      qualityCheck: 'Quality Check',
      passed: 'QC Passed',
      shipping: 'Shipping',
      completed: 'Completed',
      cancelled: 'Cancelled'
    },
    artisan: 'Artisan',
    trackingInfo: 'Tracking Info',
    fundContribution: 'Heritage Fund Contribution'
  },
  
  // Common
  common: {
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    confirm: 'Confirm',
    cancel: 'Cancel',
    save: 'Save',
    delete: 'Delete',
    edit: 'Edit',
    close: 'Close',
    more: 'More',
    less: 'Less',
    language: 'Language',
    switchLanguage: 'Switch Language'
  },
  
  // Footer
  footer: {
    about: 'About Us',
    contact: 'Contact',
    terms: 'Terms of Service',
    privacy: 'Privacy Policy',
    copyright: '© 2024 Ink Rhythm Intelligence. All rights reserved.'
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      zh: {
        translation: zhTranslations
      },
      en: {
        translation: enTranslations
      }
    },
    fallbackLng: 'zh',
    debug: false,
    
    interpolation: {
      escapeValue: false
    },
    
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage']
    }
  });

export default i18n;
