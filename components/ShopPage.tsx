import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Grid3x3, List, ArrowLeft, Filter, X } from 'lucide-react';
import Footer from './Footer';
import ProductCard, { Product } from './ProductCard';
import ProductDetailModal from './ProductDetailModal';

interface Category {
  id: string;
  name: string;
  nameEn: string;
  subcategories?: string[];
}

const ShopPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // 商品分类
  const categories: Category[] = [
    { id: 'all', name: '全部商品', nameEn: 'All Products' },
    { id: 'handcraft', name: '巧手非遗体验', nameEn: 'Handcraft Experience', subcategories: ['蓝染', '拼豆', '拼图', '织布', '手编'] },
    { id: 'banquet', name: '宴席用品', nameEn: 'Banquet Supplies', subcategories: ['桌旗', '餐具', '装饰', '伴手礼'] },
    { id: 'homedecor', name: '空间装饰', nameEn: 'Home Decoration', subcategories: ['餐桌', '床品', '窗帘', '收纳', '灯具', '壁纸'] },
    { id: 'travel', name: '旅拍', nameEn: 'Travel Photography', subcategories: ['服饰', '配饰', '道具', '收纳', '纪念品'] },
  ];

  // 产品数据
  const products: Product[] = [
    // 巧手非遗体验系列
    {
      id: 'h1',
      name: '蓝染奇趣盒',
      nameEn: 'Indigo Dyeing Fun Box',
      price: 89,
      currency: 'CNY',
      priceEur: 11.99,
      image: '/images-compressed/shop-h1.jpg',
      description: '这款蓝染奇趣盲盒专为亲子手作打造，将传统蓝染工艺转化为充满惊喜的盲盒玩法。盒内随机搭配天然靛蓝染料、纯棉布料、不同款式的绑扎工具，还藏有神秘的蓝印花布经典纹样模板，每一次开箱都是未知的乐趣。',
      craftDetails: '天然靛蓝染料 · 纯棉布料 · 传统蓝染工艺',
      priceStatus: '🎁 亲子体验',
      tags: ['蓝染', '亲子', '手作'],
      category: 'handcraft'
    },
    {
      id: 'h2',
      name: '趣味拼豆创意盒',
      nameEn: 'Perler Beads Creative Box',
      price: 69,
      currency: 'CNY',
      priceEur: 9.49,
      image: '/images-compressed/shop-h2.jpg',
      description: '以蓝印花布经典纹样为灵感，打造专属亲子的趣味拼豆创意盒。盒内包含不同色系的拼豆、模板、熨烫纸、镊子等工具，图案涵盖缠枝莲、云纹、小蓝花等国风元素。',
      craftDetails: '蓝印花布纹样设计 · 完整工具套装 · 国风元素',
      priceStatus: '🎨 创意手工',
      tags: ['拼豆', '亲子', '国风'],
      category: 'handcraft'
    },
    {
      id: 'h3',
      name: '3D立体拼图',
      nameEn: '3D Puzzle',
      price: 79,
      currency: 'CNY',
      priceEur: 10.99,
      image: '/images-compressed/shop-h3.jpg',
      description: '这款3D立体拼图取材于蓝印花布的经典应用场景，如江南水乡的乌篷船等，将国风美学与益智拼装相结合。拼图零件边缘光滑、咬合紧密，家长和孩子可以分工协作。',
      craftDetails: '江南水乡场景 · 精密咬合 · 立体拼装',
      priceStatus: '🧩 益智拼装',
      tags: ['拼图', '亲子', '江南'],
      category: 'handcraft'
    },
    {
      id: 'h4',
      name: '小小织布匠·扎染体验套装',
      nameEn: 'Weaving & Tie-Dye Kit',
      price: 128,
      currency: 'CNY',
      priceEur: 16.99,
      image: '/images-compressed/shop-h4.jpg',
      description: '集织布与扎染两大传统手工艺于一体的亲子体验套装，专为儿童设计迷你织布机，搭配纯棉纱线、靛蓝染料、绑扎绳等材料。',
      craftDetails: '迷你织布机 · 天然靛蓝染料 · 传统手工艺',
      priceStatus: '🧵 织染体验',
      tags: ['织布', '扎染', '传统工艺'],
      category: 'handcraft'
    },
    {
      id: 'h5',
      name: '手编团扇包',
      nameEn: 'Hand-woven Fan Bag',
      price: 109,
      currency: 'CNY',
      priceEur: 14.49,
      image: '/images-compressed/shop-h5.jpg',
      description: '这款手编团扇包是亲子手作的创意之选，将手编工艺与蓝印花布元素巧妙融合。套装内含编织线材、蓝印花布贴片、团扇骨架、针线等材料，教程详细易懂。',
      craftDetails: '手编工艺 · 蓝印花布贴片 · 实用装饰两用',
      priceStatus: '🪭 创意手编',
      tags: ['手编', '团扇', '实用'],
      category: 'handcraft'
    },

    // 宴席用品系列
    {
      id: 'b1',
      name: '主题桌旗',
      nameEn: 'Theme Table Runner',
      price: 124,
      currency: 'CNY',
      priceEur: 17.9,
      image: '/images-compressed/shop-b1.jpg',
      description: '采用纯棉蓝印花布材质，纹样为"缠枝莲""宝相花"等吉祥纹样，尺寸适配8人桌、10人桌等常规宴席桌型，边缘做流苏或锁边处理。',
      craftDetails: '纯棉蓝印花布 · 吉祥纹样 · 流苏锁边',
      priceStatus: '🎊 宴席装饰',
      tags: ['桌旗', '宴席', '吉祥'],
      category: 'banquet'
    },
    {
      id: 'b2',
      name: '席位卡与桌号牌',
      nameEn: 'Place Card & Table Number',
      price: 44,
      currency: 'CNY',
      priceEur: 6.35,
      image: '/images-compressed/shop-b2.jpg',
      description: '底座为实木材质，正面嵌入蓝印花布贴片，贴片纹样为"小团花""回纹"，席位卡标注宾客姓名，桌号牌为靛蓝底色+白色纹样数字。',
      craftDetails: '实木底座 · 蓝印花布贴片 · 精致工艺',
      priceStatus: '🏷️ 席位标识',
      tags: ['席位卡', '桌号牌', '实木'],
      category: 'banquet'
    },
    {
      id: 'b3',
      name: '餐具摆盘装饰垫',
      nameEn: 'Tableware Decoration Mat',
      price: 29,
      currency: 'CNY',
      priceEur: 4.15,
      image: '/images-compressed/shop-b3.jpg',
      description: '圆形小餐垫，材质为防水棉麻蓝印花布，纹样为"缠枝纹""卷草纹"，放置于餐盘底部，起装饰与防烫作用。',
      craftDetails: '防水棉麻 · 缠枝纹样 · 装饰防烫',
      priceStatus: '🍽️ 餐桌装饰',
      tags: ['餐垫', '防水', '装饰'],
      category: 'banquet'
    },
    {
      id: 'b4',
      name: '纹样陶瓷餐具系列',
      nameEn: 'Patterned Ceramic Tableware',
      price: 279,
      currency: 'CNY',
      priceEur: 40,
      image: '/images-compressed/shop-b4.jpg',
      description: '含餐盘、汤碗、茶杯等，表面采用釉下彩工艺印制"冰裂纹""缠枝莲"等蓝印花布经典纹样，色调为靛蓝与米白搭配。',
      craftDetails: '釉下彩工艺 · 经典纹样 · 靛蓝米白',
      priceStatus: '🍴 餐具套装',
      tags: ['陶瓷', '餐具', '釉下彩'],
      category: 'banquet'
    },
    {
      id: 'b5',
      name: '伴手礼礼盒',
      nameEn: 'Gift Box',
      price: 349,
      currency: 'CNY',
      priceEur: 50.1,
      image: '/images-compressed/shop-b5.jpg',
      description: '主体为蓝印花布包裹硬纸盒，盒面印"喜""福"纹样与祥云纹组合，内部搭配蓝印花布周边小产品（纹样手帕、香包、茶杯垫等）+当地特色美食。',
      craftDetails: '蓝印花布包裹 · 喜福纹样 · 特色美食',
      priceStatus: '🎁 伴手礼',
      tags: ['礼盒', '伴手礼', '特色'],
      category: 'banquet'
    },

    // 空间装饰系列
    {
      id: 'd1',
      name: '餐桌用品套装',
      nameEn: 'Dining Set',
      price: 268,
      currency: 'CNY',
      priceEur: 39.99,
      image: '/images-compressed/shop-d1.jpg',
      description: '青花与蓝印花布意境呼应，瓷质餐具釉色清润，盘身浅绘山水纹理。器型简约趁手，盛餐时既衬食物色泽，又藏着中式美学的含蓄韵致。',
      craftDetails: '青花瓷质 · 山水纹理 · 中式美学',
      priceStatus: '🍽️ 餐桌雅致',
      tags: ['餐具', '青花', '山水'],
      category: 'homedecor'
    },
    {
      id: 'd2',
      name: '沙发靠垫',
      nameEn: 'Sofa Cushion',
      price: 98,
      currency: 'CNY',
      priceEur: 14.99,
      image: '/images-compressed/shop-d2.jpg',
      description: '以蓝印花布为料，白底晕染清雅荷纹，靛蓝底色衬出中式禅意。适配浅灰布艺沙发，触感柔糯透气，既添空间国风层次，又能舒缓倚靠时的腰背压力。',
      craftDetails: '蓝印花布 · 荷纹设计 · 柔糯透气',
      priceStatus: '🛋️ 舒适禅意',
      tags: ['靠垫', '荷纹', '禅意'],
      category: 'homedecor'
    },
    {
      id: 'd3',
      name: '床品三件套',
      nameEn: 'Bedding Set',
      price: 428,
      currency: 'CNY',
      priceEur: 64.99,
      image: '/images-compressed/shop-d3.jpg',
      description: '青蓝调蓝印花布床品，浅纹竹枝舒展于素净面料上，质感亲肤垂顺。搭配木质床具，铺展后满是清雅国风氛围，睡感柔软透气。',
      craftDetails: '青蓝调 · 竹枝纹样 · 亲肤垂顺',
      priceStatus: '🛏️ 清雅寝居',
      tags: ['床品', '竹枝', '亲肤'],
      category: 'homedecor'
    },
    {
      id: 'd4',
      name: '窗帘',
      nameEn: 'Curtain',
      price: 298,
      currency: 'CNY',
      priceEur: 44.99,
      image: '/images-compressed/shop-d4.jpg',
      description: '蓝染花绫质地的蓝印花布窗帘，清雅花纹晕染其上，透光时光影朦胧如江南烟雨。挂于木格窗前，既柔化强光又保隐私，风吹帘动时，古韵与温柔裹满空间。',
      craftDetails: '蓝染花绫 · 清雅花纹 · 江南烟雨',
      priceStatus: '🪟 诗意软装',
      tags: ['窗帘', '蓝染', '江南'],
      category: 'homedecor'
    },
    {
      id: 'd5',
      name: '蓝印花布收纳筐',
      nameEn: 'Storage Basket',
      price: 35,
      currency: 'CNY',
      priceEur: 8.99,
      image: '/images-compressed/shop-d5.jpg',
      description: '以传统国风蓝白花卉纹为设计，采用透气耐磨的棉麻面料，大容量可收纳衣物、杂物，搭配编织手提绳方便移动，既是整理利器，也能作为国风家居装饰。',
      craftDetails: '棉麻面料 · 花卉纹样 · 大容量',
      priceStatus: '🧺 实用收纳',
      tags: ['收纳', '棉麻', '国风'],
      category: 'homedecor'
    },
    {
      id: 'd6',
      name: '蓝印花布木式台灯',
      nameEn: 'Wooden Table Lamp',
      price: 189,
      currency: 'CNY',
      priceEur: 29.99,
      image: '/images-compressed/shop-d6.jpg',
      description: '精选天然实木框架，搭配传统蓝白缠枝纹印花布艺灯罩，复古国风韵味十足。暖光透过透气面料柔和散射，不刺眼更护目，适配卧室、书房或茶室场景。',
      craftDetails: '天然实木 · 缠枝纹灯罩 · 暖光护目',
      priceStatus: '💡 国风照明',
      tags: ['台灯', '实木', '缠枝纹'],
      category: 'homedecor'
    },
    {
      id: 'd7',
      name: '蓝印花布屏风隔断',
      nameEn: 'Folding Screen',
      price: 399,
      currency: 'CNY',
      priceEur: 59.99,
      image: '/images-compressed/shop-d7.jpg',
      description: '采用实木榫卯骨架+双层蓝印花布面板，印花选取经典莲纹/云纹，蓝白相映尽显东方雅致。可折叠设计方便收纳，既能划分空间、遮挡隐私，又能为客厅、茶室增添国风氛围。',
      craftDetails: '实木榫卯 · 莲纹云纹 · 可折叠',
      priceStatus: '🪞 东方雅致',
      tags: ['屏风', '榫卯', '莲纹'],
      category: 'homedecor'
    },
    {
      id: 'd8',
      name: '蓝印花布笔筒',
      nameEn: 'Pen Holder',
      price: 45,
      currency: 'CNY',
      priceEur: 9.99,
      image: '/images-compressed/shop-d8.jpg',
      description: '以实木为底座，包裹传统蓝白缠枝莲纹印花布艺，国风清雅韵味扑面而来。筒身尺寸适配日常笔、便签等桌面小物，摆于书桌、茶桌既能规整文具，又能成为中式软装的精巧点缀。',
      craftDetails: '实木底座 · 缠枝莲纹 · 桌面收纳',
      priceStatus: '✏️ 文房雅器',
      tags: ['笔筒', '实木', '文房'],
      category: 'homedecor'
    },
    {
      id: 'd9',
      name: '鼠标垫',
      nameEn: 'Mouse Pad',
      price: 45,
      currency: 'CNY',
      priceEur: 9.99,
      image: '/images-compressed/shop-d9.jpg',
      description: '选用防滑橡胶底+棉麻蓝印花布面，触感亲肤耐磨，印花选取传统团花缠枝纹，蓝白清雅尽显国风韵味。尺寸适配常规鼠标操作，办公、游戏场景均适用。',
      craftDetails: '防滑橡胶底 · 团花纹样 · 亲肤耐磨',
      priceStatus: '🖱️ 桌面雅致',
      tags: ['鼠标垫', '团花', '办公'],
      category: 'homedecor'
    },
    {
      id: 'd10',
      name: '蓝印花布壁纸',
      nameEn: 'Wallpaper',
      price: 99,
      currency: 'CNY',
      priceEur: 16.99,
      image: '/images-compressed/shop-d10.jpg',
      description: '萃取传统蓝印花布经典纹样（缠枝莲、云纹），采用环保无纺布基材+防水耐磨印花层，蓝白清雅自带东方禅意。质感温润不反光，易铺贴易打理，适配客厅背景墙、卧室、茶室等空间。',
      craftDetails: '环保无纺布 · 防水耐磨 · 经典纹样',
      priceStatus: '🎨 空间氛围',
      tags: ['壁纸', '环保', '禅意'],
      category: 'homedecor'
    },

    // 旅拍系列
    {
      id: 't1',
      name: '成人汉服古风套装',
      nameEn: 'Adult Hanfu Set',
      price: 398,
      currency: 'CNY',
      priceEur: 56.99,
      image: '/images-compressed/shop-t1.jpg',
      description: '女款交领襦裙/齐胸襦裙，上衣选用浅靛蓝印花布（小团花、缠枝纹），下裙为纯色深靛蓝或渐变蓝，搭配同纹样披帛；男款直裾/圆领袍，主体为藏青蓝印花布（云纹、回纹），袖口、领口做白色纹样镶边，简洁大气。',
      craftDetails: '浅靛蓝印花布 · 传统汉服工艺 · 蓝白配色',
      priceStatus: '👘 古风旅拍',
      tags: ['汉服', '古风', '旅拍'],
      category: 'travel'
    },
    {
      id: 't2',
      name: '亲子旅拍套装',
      nameEn: 'Parent-Child Travel Set',
      price: 598,
      currency: 'CNY',
      priceEur: 85.99,
      image: '/images-compressed/shop-t2.jpg',
      description: '成人款与儿童款纹样、色调统一，成人款为简约款，儿童款增加可爱元素（如裙摆花边、帽子配饰）。例如：亲子蓝印花布汉服套装、亲子蓝白印花衬衫套装。',
      craftDetails: '亲子统一纹样 · 儿童可爱元素 · 温馨设计',
      priceStatus: '👨‍👩‍👧 亲子旅拍',
      tags: ['亲子', '汉服', '旅拍'],
      category: 'travel'
    },
    {
      id: 't3',
      name: '蓝印花布披肩斗篷',
      nameEn: 'Shawl & Cloak Set',
      price: 268,
      currency: 'CNY',
      priceEur: 38.99,
      image: '/images-compressed/shop-t3.jpg',
      description: '蓝印花布披肩（轻薄款，适配春秋旅拍）、斗篷（厚款，适配秋冬旅拍，纹样为大朵花或云纹）、马甲（短款，可内搭纯色衣物，增加层次感）。',
      craftDetails: '轻薄披肩 · 厚款斗篷 · 四季适配',
      priceStatus: '🧣 配饰服饰',
      tags: ['披肩', '斗篷', '配饰'],
      category: 'travel'
    },
    {
      id: 't4',
      name: '户外旅拍功能服饰',
      nameEn: 'Outdoor Functional Wear',
      price: 458,
      currency: 'CNY',
      priceEur: 65.99,
      image: '/images-compressed/shop-t4.jpg',
      description: '防水透气的蓝印花布冲锋衣（表面印简约几何纹样，内胆可拆卸）、速干印花布短袖（纹样为清新水波纹，适配夏季户外旅拍）、印花布工装裤（侧边口袋贴印花布贴片，兼具实用性与装饰性）。',
      craftDetails: '防水透气 · 速干面料 · 功能实用',
      priceStatus: '🏕️ 户外功能',
      tags: ['冲锋衣', '户外', '功能'],
      category: 'travel'
    },
    {
      id: 't5',
      name: '古风头饰套装',
      nameEn: 'Traditional Headwear Set',
      price: 128,
      currency: 'CNY',
      priceEur: 18.99,
      image: '/images-compressed/shop-t5.jpg',
      description: '古风款：蓝印花布发带（纹样：回纹、缠枝纹）、发簪（簪头镶嵌蓝印花布纹样贴片）、斗笠（帽檐边缘包裹蓝印花布，帽身印简约纹样）。',
      craftDetails: '发带发簪 · 斗笠配饰 · 古风韵味',
      priceStatus: '👒 古风头饰',
      tags: ['发带', '发簪', '古风'],
      category: 'travel'
    },
    {
      id: 't6',
      name: '日常帽饰套装',
      nameEn: 'Daily Hat Set',
      price: 98,
      currency: 'CNY',
      priceEur: 14.99,
      image: '/images-compressed/shop-t6.jpg',
      description: '蓝印花布棒球帽、渔夫帽（帽身印小碎花或几何纹样）、遮阳帽（宽檐设计，帽檐内侧贴蓝印花布贴片，外侧纯色，兼顾实用与美观）。',
      craftDetails: '棒球帽渔夫帽 · 遮阳设计 · 日常百搭',
      priceStatus: '🧢 日常帽饰',
      tags: ['棒球帽', '渔夫帽', '遮阳'],
      category: 'travel'
    },
    {
      id: 't7',
      name: '手部配饰套装',
      nameEn: 'Hand Accessories Set',
      price: 88,
      currency: 'CNY',
      priceEur: 12.99,
      image: '/images-compressed/shop-t7.jpg',
      description: '蓝印花布手链（布艺编织，搭配木质或银色小配饰）、手包（小巧便携，纹样为精致小团花，可放置手机、口红等随身物品）、手套（春秋款，薄棉材质，印简约蓝白纹样）。',
      craftDetails: '手链手包 · 布艺编织 · 精致小巧',
      priceStatus: '🤲 手部配饰',
      tags: ['手链', '手包', '配饰'],
      category: 'travel'
    },
    {
      id: 't8',
      name: '油纸伞团扇套装',
      nameEn: 'Oil Paper Umbrella & Fan Set',
      price: 168,
      currency: 'CNY',
      priceEur: 24.99,
      image: '/images-compressed/shop-t8.jpg',
      description: '蓝印花布油纸伞（伞面印大朵缠枝莲、牡丹纹，适配古风旅拍）、团扇（扇面为蓝印花布，纹样精美，可用于摆拍互动）。',
      craftDetails: '油纸伞 · 团扇 · 古风道具',
      priceStatus: '☂️ 拍摄道具',
      tags: ['油纸伞', '团扇', '道具'],
      category: 'travel'
    },
    {
      id: 't9',
      name: '田园手提篮',
      nameEn: 'Pastoral Basket',
      price: 78,
      currency: 'CNY',
      priceEur: 11.99,
      image: '/images-compressed/shop-t9.jpg',
      description: '手提篮（蓝印花布包裹藤编篮，用于田园风旅拍，可放置鲜花、水果等道具）。',
      craftDetails: '藤编篮 · 蓝印花布包裹 · 田园风格',
      priceStatus: '🧺 田园道具',
      tags: ['手提篮', '藤编', '田园'],
      category: 'travel'
    },
    {
      id: 't10',
      name: '旅拍场景帐篷',
      nameEn: 'Travel Photography Tent',
      price: 398,
      currency: 'CNY',
      priceEur: 56.99,
      image: '/images-compressed/shop-t10.jpg',
      description: '小型便携帐篷，帐篷外帐采用蓝印花布材质，纹样为清新云纹或水波纹，内帐为纯色透气棉布，适配户外露营、田园、古镇等旅拍场景，既是拍摄道具也是休息场所。',
      craftDetails: '便携帐篷 · 蓝印花布外帐 · 多场景适配',
      priceStatus: '⛺ 场景帐篷',
      tags: ['帐篷', '露营', '场景'],
      category: 'travel'
    },
    {
      id: 't11',
      name: '野餐垫装饰布',
      nameEn: 'Picnic Mat & Decoration',
      price: 128,
      currency: 'CNY',
      priceEur: 18.99,
      image: '/images-compressed/shop-t11.jpg',
      description: '蓝印花布野餐垫（防水材质，大尺寸，纹样为清新小碎花或几何纹，适配户外旅拍野餐场景）、帐篷装饰布（用于户外露营旅拍，悬挂于帐篷内侧或外侧，增加氛围感）。',
      craftDetails: '防水野餐垫 · 装饰布 · 氛围营造',
      priceStatus: '🏕️ 场景氛围',
      tags: ['野餐垫', '装饰布', '氛围'],
      category: 'travel'
    },
    {
      id: 't12',
      name: '便携收纳套装',
      nameEn: 'Portable Storage Set',
      price: 108,
      currency: 'CNY',
      priceEur: 15.99,
      image: '/images-compressed/shop-t12.jpg',
      description: '蓝印花布收纳袋（可折叠，用于收纳衣物、拍摄道具）、化妆包（分层设计，印小碎花纹样）、证件卡包（简约款，印回纹，方便存放身份证、门票）。',
      craftDetails: '收纳袋 · 化妆包 · 证件卡包',
      priceStatus: '👜 便携收纳',
      tags: ['收纳袋', '化妆包', '便携'],
      category: 'travel'
    },
    {
      id: 't13',
      name: '拍摄纪念册',
      nameEn: 'Photography Album',
      price: 88,
      currency: 'CNY',
      priceEur: 12.99,
      image: '/images-compressed/shop-t13.jpg',
      description: '封面为蓝印花布材质，印"旅拍纪念"字样与祥云纹，内页可定制照片插页。',
      craftDetails: '蓝印花布封面 · 祥云纹 · 定制插页',
      priceStatus: '📖 纪念册',
      tags: ['纪念册', '相册', '定制'],
      category: 'travel'
    },
    {
      id: 't14',
      name: '纹样明信片套装',
      nameEn: 'Pattern Postcard Set',
      price: 38,
      currency: 'CNY',
      priceEur: 5.99,
      image: '/images-compressed/shop-t14.jpg',
      description: '一套10张，每张印不同蓝印花布经典纹样，背面可书写寄语，适配旅拍邮寄纪念。',
      craftDetails: '10张套装 · 经典纹样 · 书写寄语',
      priceStatus: '💌 明信片',
      tags: ['明信片', '纹样', '纪念'],
      category: 'travel'
    },
    {
      id: 't15',
      name: '冰箱贴钥匙扣套装',
      nameEn: 'Magnet & Keychain Set',
      price: 48,
      currency: 'CNY',
      priceEur: 6.99,
      image: '/images-compressed/shop-t15.jpg',
      description: '主体为木质或金属材质，表面贴蓝印花布纹样贴片，小巧精致，方便携带。',
      craftDetails: '木质金属 · 纹样贴片 · 小巧精致',
      priceStatus: '🧲 纪念小物',
      tags: ['冰箱贴', '钥匙扣', '纪念'],
      category: 'travel'
    },
    {
      id: 't16',
      name: '旅拍记录套装',
      nameEn: 'Travel Record Set',
      price: 128,
      currency: 'CNY',
      priceEur: 18.99,
      image: '/images-compressed/shop-t16.jpg',
      description: '包含蓝印花布封面笔记本（内页印浅淡纹样）、印花布笔套（包裹木质笔杆）、纹样贴纸（多种蓝印花布纹样可选，用于装饰笔记本或照片），方便旅拍过程中记录心情、粘贴门票等纪念物。',
      craftDetails: '笔记本 · 笔套 · 纹样贴纸',
      priceStatus: '📝 记录套装',
      tags: ['笔记本', '贴纸', '记录'],
      category: 'travel'
    },
  ];

  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(p => p.category === selectedCategory);

  const handleViewDetail = (product: Product) => {
    setSelectedProduct(product);
    // 后续可以导航到详情页或打开详情模态框
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center gap-2 sm:gap-4">
          <button
            onClick={() => navigate('/')}
            className="p-2 hover:bg-slate-100 active:bg-slate-200 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">购物中心</h1>
            <p className="text-xs sm:text-sm text-slate-500 hidden sm:block">Shop Center</p>
          </div>
        </div>
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Mobile Filter Button */}
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="lg:hidden p-2 hover:bg-slate-100 active:bg-slate-200 rounded-lg transition-colors flex items-center gap-1"
          >
            <Filter size={18} />
            <span className="text-sm hidden sm:inline">筛选</span>
          </button>
          {/* View Mode Toggle */}
          <div className="flex items-center gap-1 sm:gap-2 bg-slate-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded transition-colors ${
                viewMode === 'grid' 
                  ? 'bg-white text-blue-900 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <Grid3x3 size={18} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded transition-colors ${
                viewMode === 'list' 
                  ? 'bg-white text-blue-900 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <List size={18} />
            </button>
          </div>
          <button
            onClick={() => navigate('/')}
            className="hidden sm:block px-4 py-2 text-slate-600 hover:text-slate-900 font-medium"
          >
            返回首页
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Mobile Sidebar Overlay */}
        {isSidebarOpen && (
          <div 
            className="lg:hidden fixed inset-0 bg-black/50 z-30"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Left Sidebar - Categories */}
        <div className={`
          fixed lg:relative inset-y-0 left-0 z-40 lg:z-auto
          w-72 sm:w-64 bg-white border-r border-slate-200 overflow-y-auto
          transform transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
          {/* Mobile Close Button */}
          <div className="lg:hidden flex items-center justify-between p-4 border-b border-slate-200">
            <h2 className="text-lg font-bold text-slate-900">商品分类</h2>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="p-2 hover:bg-slate-100 rounded-lg"
            >
              <X size={20} />
            </button>
          </div>
          <div className="p-4">
            <h2 className="hidden lg:block text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">
              商品分类
            </h2>
            <nav className="space-y-1">
              {categories.map((category) => (
                <div key={category.id}>
                  <button
                    onClick={() => {
                      setSelectedCategory(category.id);
                      setIsSidebarOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${
                      selectedCategory === category.id
                        ? 'bg-blue-50 text-blue-900 font-semibold'
                        : 'text-slate-700 hover:bg-slate-50 active:bg-slate-100'
                    }`}
                  >
                    <div className="text-left">
                      <div className="font-medium">{category.name}</div>
                      <div className="text-xs text-slate-500">{category.nameEn}</div>
                    </div>
                    {category.subcategories && (
                      <ChevronRight 
                        size={16} 
                        className={selectedCategory === category.id ? 'text-blue-900' : 'text-slate-400'}
                      />
                    )}
                  </button>
                  
                  {/* Subcategories - 可选展开 */}
                  {category.subcategories && selectedCategory === category.id && (
                    <div className="ml-4 mt-1 space-y-1">
                      {category.subcategories.map((sub, idx) => (
                        <button
                          key={idx}
                          className="w-full text-left px-4 py-2 text-sm text-slate-600 hover:text-blue-900 hover:bg-blue-50 active:bg-blue-100 rounded-lg transition-colors"
                        >
                          {sub}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>
          </div>
        </div>

        {/* Right Content - Products Grid */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 sm:p-6">
            {/* Breadcrumb & Filter Bar */}
            <div className="mb-4 sm:mb-6 flex items-center justify-between flex-wrap gap-2">
              <div className="text-sm text-slate-600">
                <span>首页</span>
                <span className="mx-2">/</span>
                <span className="text-slate-900 font-medium">
                  {categories.find(c => c.id === selectedCategory)?.name || '全部商品'}
                </span>
              </div>
              <div className="text-sm text-slate-500">
                共 {filteredProducts.length} 件商品
              </div>
            </div>

            {/* Products Grid */}
            <div className={
              viewMode === 'grid'
                ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6'
                : 'space-y-3'
            }>
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onViewDetail={handleViewDetail}
                  viewMode={viewMode}
                />
              ))}
            </div>

            {/* Empty State */}
            {filteredProducts.length === 0 && (
              <div className="text-center py-16 sm:py-20">
                <p className="text-slate-400 text-lg">该分类暂无商品</p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <Footer />

      {/* Product Detail Modal */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          relatedProducts={products.filter(p => p.category === selectedProduct.category && p.id !== selectedProduct.id)}
          onViewRelated={(product) => setSelectedProduct(product)}
        />
      )}
    </div>
  );
};

export default ShopPage;
