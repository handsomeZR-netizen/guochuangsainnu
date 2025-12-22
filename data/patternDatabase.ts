/**
 * 南通蓝印花布纹样数据库
 * 包含常见传统纹样的基础信息和文化含义
 */

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

/**
 * 纹样数据库
 */
export const patterns: Pattern[] = [
  {
    id: 'wufu-pengshou',
    name: '五福捧寿',
    nameEn: 'Five Blessings Holding Longevity',
    category: '吉祥纹样',
    image: 'https://picsum.photos/800/800?random=101',
    thumbnail: 'https://picsum.photos/200/200?random=101',
    basicInfo: {
      symbolism: ['长寿', '福气', '吉祥', '圆满'],
      occasion: ['生日', '祝寿', '节庆'],
      era: '明清时期'
    },
    suitableFor: ['parent-child', 'banquet', 'space'],
    tags: ['传统', '吉祥', '寿辰', '福寿双全']
  },
  {
    id: 'songhe-changchun',
    name: '松鹤长春',
    nameEn: 'Pine and Crane Longevity',
    category: '自然纹样',
    image: 'https://picsum.photos/800/800?random=102',
    thumbnail: 'https://picsum.photos/200/200?random=102',
    basicInfo: {
      symbolism: ['长寿', '高洁', '坚韧', '延年益寿'],
      occasion: ['祝寿', '新居', '养生'],
      era: '宋代至今'
    },
    suitableFor: ['parent-child', 'space'],
    tags: ['自然', '长寿', '高雅', '文人']
  },
  {
    id: 'liannian-youyu',
    name: '连年有余',
    nameEn: 'Surplus Year After Year',
    category: '吉祥纹样',
    image: 'https://picsum.photos/800/800?random=103',
    thumbnail: 'https://picsum.photos/200/200?random=103',
    basicInfo: {
      symbolism: ['富足', '丰收', '年年有余', '生活美满'],
      occasion: ['春节', '开业', '婚礼'],
      era: '唐宋时期'
    },
    suitableFor: ['parent-child', 'banquet', 'space'],
    tags: ['吉祥', '富足', '莲花', '鱼']
  },
  {
    id: 'longfeng-chengxiang',
    name: '龙凤呈祥',
    nameEn: 'Dragon and Phoenix Auspiciousness',
    category: '吉祥纹样',
    image: 'https://picsum.photos/800/800?random=104',
    thumbnail: 'https://picsum.photos/200/200?random=104',
    basicInfo: {
      symbolism: ['夫妻和谐', '阴阳平衡', '尊贵', '吉祥'],
      occasion: ['婚礼', '庆典', '重大节日'],
      era: '汉代至今'
    },
    suitableFor: ['banquet'],
    tags: ['婚礼', '吉祥', '龙凤', '皇家']
  },
  {
    id: 'xishang-meishao',
    name: '喜上眉梢',
    nameEn: 'Joy Upon the Brows',
    category: '自然纹样',
    image: 'https://picsum.photos/800/800?random=105',
    thumbnail: 'https://picsum.photos/200/200?random=105',
    basicInfo: {
      symbolism: ['喜事临门', '欢乐', '好运', '报喜'],
      occasion: ['婚礼', '喜庆', '节日'],
      era: '明清时期'
    },
    suitableFor: ['banquet', 'space'],
    tags: ['喜庆', '喜鹊', '梅花', '报喜']
  },
  {
    id: 'bainian-haohe',
    name: '百年好合',
    nameEn: 'A Hundred Years of Harmony',
    category: '吉祥纹样',
    image: 'https://picsum.photos/800/800?random=106',
    thumbnail: 'https://picsum.photos/200/200?random=106',
    basicInfo: {
      symbolism: ['婚姻美满', '白头偕老', '和谐', '永恒'],
      occasion: ['婚礼', '结婚纪念日'],
      era: '宋代至今'
    },
    suitableFor: ['banquet'],
    tags: ['婚礼', '百合', '和谐', '永恒']
  },
  {
    id: 'meilan-zhuju',
    name: '梅兰竹菊',
    nameEn: 'Four Gentlemen',
    category: '自然纹样',
    image: 'https://picsum.photos/800/800?random=107',
    thumbnail: 'https://picsum.photos/200/200?random=107',
    basicInfo: {
      symbolism: ['高洁', '品格', '君子', '四季'],
      occasion: ['书房', '文人雅集', '礼品'],
      era: '宋代至今'
    },
    suitableFor: ['space'],
    tags: ['文人', '四君子', '高雅', '品格']
  },
  {
    id: 'binglie-wen',
    name: '冰裂纹',
    nameEn: 'Ice Crack Pattern',
    category: '几何纹样',
    image: 'https://picsum.photos/800/800?random=108',
    thumbnail: 'https://picsum.photos/200/200?random=108',
    basicInfo: {
      symbolism: ['自然之美', '残缺之美', '禅意', '简约'],
      occasion: ['现代家居', '茶室', '禅修空间'],
      era: '宋代瓷器纹样'
    },
    suitableFor: ['space'],
    tags: ['几何', '现代', '禅意', '简约']
  },
  {
    id: 'yunwen',
    name: '云纹',
    nameEn: 'Cloud Pattern',
    category: '自然纹样',
    image: 'https://picsum.photos/800/800?random=109',
    thumbnail: 'https://picsum.photos/200/200?random=109',
    basicInfo: {
      symbolism: ['祥云', '吉祥', '高远', '飘逸'],
      occasion: ['各类场合', '装饰', '服饰'],
      era: '商周时期至今'
    },
    suitableFor: ['parent-child', 'banquet', 'space'],
    tags: ['祥云', '吉祥', '传统', '飘逸']
  },
  {
    id: 'hudie-wen',
    name: '蝴蝶纹',
    nameEn: 'Butterfly Pattern',
    category: '自然纹样',
    image: 'https://picsum.photos/800/800?random=110',
    thumbnail: 'https://picsum.photos/200/200?random=110',
    basicInfo: {
      symbolism: ['自由', '美丽', '爱情', '变化'],
      occasion: ['儿童用品', '春季', '婚礼'],
      era: '唐代至今'
    },
    suitableFor: ['parent-child', 'banquet'],
    tags: ['蝴蝶', '自由', '美丽', '儿童']
  },
  {
    id: 'shi榴-wen',
    name: '石榴纹',
    nameEn: 'Pomegranate Pattern',
    category: '自然纹样',
    image: 'https://picsum.photos/800/800?random=111',
    thumbnail: 'https://picsum.photos/200/200?random=111',
    basicInfo: {
      symbolism: ['多子多福', '繁荣', '团圆', '兴旺'],
      occasion: ['婚礼', '祝福', '家庭'],
      era: '汉代至今'
    },
    suitableFor: ['parent-child', 'banquet'],
    tags: ['多子', '繁荣', '石榴', '家庭']
  },
  {
    id: 'huiwen',
    name: '回纹',
    nameEn: 'Meander Pattern',
    category: '几何纹样',
    image: 'https://picsum.photos/800/800?random=112',
    thumbnail: 'https://picsum.photos/200/200?random=112',
    basicInfo: {
      symbolism: ['连绵不断', '福寿绵长', '循环', '永恒'],
      occasion: ['边饰', '装饰', '各类场合'],
      era: '商周时期至今'
    },
    suitableFor: ['parent-child', 'banquet', 'space'],
    tags: ['几何', '连续', '边饰', '传统']
  }
];

/**
 * 根据ID获取纹样
 */
export const getPatternById = (id: string): Pattern | undefined => {
  return patterns.find(pattern => pattern.id === id);
};

/**
 * 根据名称搜索纹样
 */
export const searchPatternsByName = (query: string): Pattern[] => {
  const lowerQuery = query.toLowerCase();
  return patterns.filter(pattern =>
    pattern.name.toLowerCase().includes(lowerQuery) ||
    pattern.nameEn.toLowerCase().includes(lowerQuery)
  );
};

/**
 * 根据类别获取纹样
 */
export const getPatternsByCategory = (category: Pattern['category']): Pattern[] => {
  return patterns.filter(pattern => pattern.category === category);
};

/**
 * 根据场景获取适合的纹样
 */
export const getPatternsByScenario = (
  scenario: 'parent-child' | 'banquet' | 'space'
): Pattern[] => {
  return patterns.filter(pattern => pattern.suitableFor.includes(scenario));
};

/**
 * 根据标签获取纹样
 */
export const getPatternsByTag = (tag: string): Pattern[] => {
  return patterns.filter(pattern => pattern.tags.includes(tag));
};

/**
 * 获取所有纹样类别
 */
export const getAllCategories = (): Pattern['category'][] => {
  return ['吉祥纹样', '自然纹样', '几何纹样'];
};

/**
 * 获取随机纹样
 */
export const getRandomPatterns = (count: number = 3): Pattern[] => {
  const shuffled = [...patterns].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, patterns.length));
};
