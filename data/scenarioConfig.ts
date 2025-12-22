/**
 * 南通蓝印花布三大场景配置
 * 场景驱动的产品展示数据
 */

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

/**
 * 场景1: 手作时光·亲子成长
 */
const parentChildScenario: ScenarioConfig = {
  id: 'parent-child',
  title: '手作时光 · 亲子成长',
  titleEn: 'Handcraft Time · Parent-Child Growth',
  description: '让孩子在靛蓝纹样里，读懂一个流传千年的吉祥故事',
  descriptionEn: 'Let children understand thousand-year-old auspicious stories through indigo patterns',
  icon: '🎨',
  bgColor: 'from-blue-50 to-indigo-50',
  products: [
    {
      id: 'pc-1',
      name: '手作锦囊DIY包',
      nameEn: 'Handcraft DIY Kit',
      price: 88,
      currency: 'USD',
      image: 'https://picsum.photos/400/500?random=1',
      description: '包含预制刮浆布料、天然靛蓝染料和纹样解说书，让孩子亲手体验南通蓝印花布的传统工艺',
      includes: [
        '预制刮浆布料（30x30cm）',
        '天然靛蓝染料包',
        '纹样解说书（儿童版）',
        '防护手套和围裙',
        '工艺视频教程二维码'
      ],
      pattern: {
        name: '五福捧寿',
        nameEn: 'Five Blessings Holding Longevity',
        culturalMeaning: '五只蝙蝠环绕寿字，寓意福寿双全'
      }
    },
    {
      id: 'pc-2',
      name: '儿童科普绘本套装',
      nameEn: 'Children\'s Educational Picture Book Set',
      price: 45,
      currency: 'USD',
      image: 'https://picsum.photos/400/500?random=2',
      description: '用生动的故事讲述南通蓝印花布的历史，配合AR互动体验',
      includes: [
        '《靛蓝的秘密》绘本',
        '纹样贴纸套装',
        'AR互动卡片',
        '非遗传承人视频访谈'
      ],
      pattern: {
        name: '松鹤长春',
        nameEn: 'Pine and Crane Longevity',
        culturalMeaning: '松树和仙鹤象征长寿和高洁'
      }
    },
    {
      id: 'pc-3',
      name: '亲子围裙套装',
      nameEn: 'Parent-Child Apron Set',
      price: 120,
      currency: 'USD',
      image: 'https://picsum.photos/400/500?random=3',
      description: '大小两件蓝印花布围裙，可定制家庭专属纹样',
      customization: '可添加家庭姓氏或孩子姓名的吉祥纹样',
      pattern: {
        name: '连年有余',
        nameEn: 'Surplus Year After Year',
        culturalMeaning: '莲花和鱼的组合，寓意生活富足'
      }
    }
  ],
  aiFeatures: [
    {
      id: 'pc-ai-1',
      name: '儿童版文化科普',
      description: 'AI生成适合儿童理解的纹样故事和非遗知识',
      icon: '📚'
    },
    {
      id: 'pc-ai-2',
      name: '染色效果预览',
      description: '上传孩子的设计草图，预览染色后的效果',
      icon: '🎨'
    },
    {
      id: 'pc-ai-3',
      name: '二维码文化百科',
      description: '扫描产品二维码，查看纹样的详细文化解读',
      icon: '📱'
    }
  ]
};

/**
 * 场景2: 宴设青蓝·婚宴旅拍
 */
const banquetScenario: ScenarioConfig = {
  id: 'banquet',
  title: '宴设青蓝 · 婚宴旅拍',
  titleEn: 'Indigo Banquet · Wedding Photography',
  description: '靛蓝画卷替代签到本，成为可传家的艺术品',
  descriptionEn: 'Indigo scrolls replace guest books, becoming heirloom artworks',
  icon: '💒',
  bgColor: 'from-indigo-50 to-blue-100',
  products: [
    {
      id: 'bq-1',
      name: '靛蓝画卷·签到本',
      nameEn: 'Indigo Scroll Guest Book',
      price: 280,
      currency: 'USD',
      image: 'https://picsum.photos/400/500?random=4',
      description: '手工刮浆印染的长卷，可定制新人姓名缩写的吉祥纹样，宾客签名后可装裱收藏',
      customization: '含新人姓名字母缩写的吉祥纹样，可选择龙凤呈祥、鸳鸯戏水等主题',
      pattern: {
        name: '龙凤呈祥',
        nameEn: 'Dragon and Phoenix Auspiciousness',
        culturalMeaning: '龙凤相配，象征夫妻和谐美满'
      }
    },
    {
      id: 'bq-2',
      name: '宴席桌旗定制',
      nameEn: 'Banquet Table Runner Customization',
      price: 150,
      currency: 'USD',
      image: 'https://picsum.photos/400/500?random=5',
      description: '根据婚宴主题AI生成专属纹样，每桌一条，营造东方美学氛围',
      customization: '根据婚宴主题AI生成纹样，支持批量定制',
      pattern: {
        name: '喜上眉梢',
        nameEn: 'Joy Upon the Brows',
        culturalMeaning: '喜鹊登梅，寓意喜事临门'
      }
    },
    {
      id: 'bq-3',
      name: '新中式伴手礼盒',
      nameEn: 'New Chinese Style Gift Box',
      price: 65,
      currency: 'USD',
      image: 'https://picsum.photos/400/500?random=6',
      description: '蓝印花布包装的茶叶或糕点礼盒，可定制祝福语',
      includes: [
        '蓝印花布包装盒',
        '定制祝福卡片',
        '纹样书签',
        '可选茶叶或糕点'
      ],
      pattern: {
        name: '百年好合',
        nameEn: 'A Hundred Years of Harmony',
        culturalMeaning: '百合花象征百年好合'
      }
    },
    {
      id: 'bq-4',
      name: '旅拍道具套装',
      nameEn: 'Travel Photography Props Set',
      price: 180,
      currency: 'USD',
      image: 'https://picsum.photos/400/500?random=7',
      description: '包含蓝印花布团扇、披肩、手帕等，适合中式婚纱照拍摄',
      includes: [
        '双面绣团扇',
        '蓝印花布披肩',
        '配套手帕',
        '便携收纳袋'
      ]
    }
  ],
  aiFeatures: [
    {
      id: 'bq-ai-1',
      name: '宴席3D效果图',
      description: '上传宴会厅照片，AI生成蓝印花布布置的3D效果预览',
      icon: '🏛️'
    },
    {
      id: 'bq-ai-2',
      name: '祝词生成',
      description: 'AI生成融合传统文化的婚礼祝词和纹样寓意解读',
      icon: '✍️'
    },
    {
      id: 'bq-ai-3',
      name: '纹样定制推荐',
      description: '根据新人故事和喜好，AI推荐最适合的纹样组合',
      icon: '💡'
    }
  ]
};

/**
 * 场景3: 空间诗学·家居软装
 */
const spaceScenario: ScenarioConfig = {
  id: 'space',
  title: '空间诗学 · 家居软装',
  titleEn: 'Space Poetics · Home Furnishing',
  description: '将蓝印花布解构为屏风、挂画、透光灯罩',
  descriptionEn: 'Deconstructing blue calico into screens, paintings, and translucent lampshades',
  icon: '🏠',
  bgColor: 'from-slate-50 to-blue-50',
  products: [
    {
      id: 'sp-1',
      name: '软装诗布·屏风',
      nameEn: 'Poetic Fabric Screen',
      price: 450,
      currency: 'USD',
      image: 'https://picsum.photos/400/500?random=8',
      description: '可折叠的蓝印花布屏风，既是隔断也是艺术品',
      types: ['三折屏风', '四折屏风', '六折屏风'],
      customization: '可选择传统纹样或现代简约风格',
      pattern: {
        name: '梅兰竹菊',
        nameEn: 'Four Gentlemen',
        culturalMeaning: '四君子象征高洁品格'
      }
    },
    {
      id: 'sp-2',
      name: '装裱挂画',
      nameEn: 'Mounted Hanging Painting',
      price: 320,
      currency: 'USD',
      image: 'https://picsum.photos/400/500?random=9',
      description: '精选蓝印花布片段，配以实木画框，适合现代家居',
      types: ['方形60x60cm', '长方形80x60cm', '条幅120x40cm'],
      pattern: {
        name: '冰裂纹',
        nameEn: 'Ice Crack Pattern',
        culturalMeaning: '自然开裂的纹理，体现残缺之美'
      }
    },
    {
      id: 'sp-3',
      name: '透光灯罩',
      nameEn: 'Translucent Lampshade',
      price: 180,
      currency: 'USD',
      image: 'https://picsum.photos/400/500?random=10',
      description: '灯光透过蓝印花布，投射出诗意的光影效果',
      types: ['吊灯', '台灯', '落地灯'],
      customization: '可调节光影浓度和纹样密度'
    },
    {
      id: 'sp-4',
      name: '抱枕套装',
      nameEn: 'Cushion Cover Set',
      price: 95,
      currency: 'USD',
      image: 'https://picsum.photos/400/500?random=11',
      description: '多种纹样组合的抱枕套，可混搭使用',
      includes: [
        '45x45cm抱枕套 x 4',
        '可拆洗内胆',
        '隐形拉链设计'
      ]
    },
    {
      id: 'sp-5',
      name: '茶席布艺',
      nameEn: 'Tea Ceremony Cloth',
      price: 120,
      currency: 'USD',
      image: 'https://picsum.photos/400/500?random=12',
      description: '适合茶室使用的蓝印花布茶席，营造禅意空间',
      types: ['小茶席60x40cm', '大茶席90x60cm']
    }
  ],
  aiFeatures: [
    {
      id: 'sp-ai-1',
      name: '房间照片分析',
      description: '上传房间照片，AI分析色调风格并推荐适合的蓝印花布软装',
      icon: '📸'
    },
    {
      id: 'sp-ai-2',
      name: '色调搭配推荐',
      description: 'AI推荐3种不同的纹样和布局方案，确保与现有装修协调',
      icon: '🎨'
    },
    {
      id: 'sp-ai-3',
      name: '光效模拟',
      description: '预览透光灯罩在不同时间段的光影效果',
      icon: '💡'
    }
  ]
};

/**
 * 导出所有场景配置
 */
export const scenarios: ScenarioConfig[] = [
  parentChildScenario,
  banquetScenario,
  spaceScenario
];

/**
 * 根据ID获取场景配置
 */
export const getScenarioById = (id: string): ScenarioConfig | undefined => {
  return scenarios.find(scenario => scenario.id === id);
};

/**
 * 获取所有场景ID列表
 */
export const getScenarioIds = (): string[] => {
  return scenarios.map(scenario => scenario.id);
};
