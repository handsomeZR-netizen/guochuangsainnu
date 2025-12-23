import React, { useState } from 'react';
import { SectionId, Product } from '../types';
import { Search, Eye, ShoppingCart } from 'lucide-react';
import ProductDetail from './ProductDetail';

const products: Product[] = [
  {
    id: '1',
    name: '缠枝莲纹青花瓷瓶',
    nameEn: 'Blue & White Porcelain Vase',
    price: 1250,
    currency: 'USD',
    image: '/images-compressed/product-1.jpg',
    description: '此瓶造型端庄秀美，胎质洁白细腻。通体绘缠枝莲纹，线条流畅有力，青花发色浓艳，具有典型的明代官窑风格。瓶颈修长，腹部圆润，寓意"平平安安"。',
    craftsmanship: '1300°C 高温还原焰烧制 · 手工拉坯 · 苏麻离青料',
    trend: 'up',
    tags: ['瓷器', '经典', '明代风格']
  },
  {
    id: '2',
    name: '双面绣团扇·兰花',
    nameEn: 'Double-sided Su Embroidery',
    price: 380,
    currency: 'USD',
    image: '/images-compressed/product-2.jpg',
    description: '运用"平金夹绣"技法，历时200小时手工绣制。双面异色，针法活泼，兰花栩栩如生，仿佛散发着幽香。扇柄采用名贵紫光檀，手感温润。',
    craftsmanship: '100% 桑蚕丝 · 镇湖苏绣非遗传承人手作 · 紫光檀',
    trend: 'stable',
    tags: ['织绣', '家居', '配饰']
  },
  {
    id: '3',
    name: '老坑歙砚·山水',
    nameEn: 'She Ink Stone',
    price: 890,
    currency: 'USD',
    image: '/images-compressed/product-3.jpg',
    description: '采自安徽深山老坑，石质坚润，发墨如油，贮水不干。雕刻师依石势而作，雕刻出一幅烟雨江南的山水画卷，极具文人雅趣与收藏价值。',
    craftsmanship: '手工精雕 · 天然老坑原石 · 徽派雕刻',
    trend: 'up',
    tags: ['文房', '工具', '收藏']
  }
];

const ProductShowcase: React.FC = () => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  return (
    <section id={SectionId.PRODUCTS} className="py-16 sm:py-24 bg-slate-100" style={{ zIndex: 'auto' }}>
      <div className="container mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 sm:mb-16 gap-4 sm:gap-6">
          <div>
            <span className="text-blue-700 font-bold tracking-widest text-xs uppercase mb-2 sm:mb-3 block">
              Product Showcase
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl text-slate-900 font-bold font-serif">产品展示</h2>
          </div>
          <div className="w-full md:w-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="搜索非遗工艺..."
                className="bg-white border border-slate-300 rounded-lg py-3 px-4 pr-12 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 w-full md:w-72 text-slate-800 placeholder-slate-400 transition-all text-base"
              />
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-10">
          {products.map((product) => (
            <div
              key={product.id}
              className="group cursor-pointer"
              onClick={() => setSelectedProduct(product)}
            >
              {/* Card Container */}
              <div className="relative bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-500 overflow-hidden">
                {/* Image Area */}
                <div className="relative aspect-[4/5] overflow-hidden bg-slate-200">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover mix-blend-multiply opacity-90 filter sepia-[.2] hue-rotate-[180deg] transition-transform duration-700 group-hover:scale-110"
                  />
                  {/* Trend Badge */}
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm">
                    {product.trend === 'up' && <span className="text-blue-700">🔥 热度上升</span>}
                    {product.trend === 'stable' && <span className="text-slate-600">📊 价格平稳</span>}
                  </div>
                  
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-slate-900/80 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-center items-center text-white p-8">
                    <h3 className="text-2xl font-serif mb-4 text-center">{product.name}</h3>
                    <p className="text-slate-300 text-sm leading-relaxed mb-6 text-center line-clamp-3">
                      {product.description}
                    </p>
                    <div className="mb-6">
                      <h4 className="text-xs font-bold uppercase tracking-widest text-blue-400 mb-2 text-center">
                        工艺细节
                      </h4>
                      <p className="text-sm text-center text-slate-200">{product.craftsmanship}</p>
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedProduct(product);
                        }}
                        className="border border-slate-500 hover:border-white hover:bg-white/10 p-3 rounded-full transition-all"
                        aria-label="查看详情"
                      >
                        <Eye size={20} />
                      </button>
                      <button 
                        className="bg-blue-700 hover:bg-blue-600 text-white px-6 py-3 rounded-full text-sm font-bold tracking-wider flex items-center gap-2 transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <ShoppingCart size={16} /> 查看详情
                      </button>
                    </div>
                  </div>
                </div>

                {/* Info Area */}
                <div className="p-4 sm:p-6">
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900 font-serif mb-1 group-hover:text-blue-800 transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 italic mb-2 sm:mb-3">{product.nameEn}</p>
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <p className="text-xl sm:text-2xl font-bold text-blue-900">
                      <span className="text-xs sm:text-sm font-normal text-slate-500 mr-1">{product.currency}</span>
                      {product.price.toLocaleString()}
                    </p>
                    <div className="flex gap-1">
                      {product.tags.slice(0, 2).map(tag => (
                        <span key={tag} className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Detail Modal */}
      {selectedProduct && (
        <ProductDetail product={selectedProduct} onClose={() => setSelectedProduct(null)} />
      )}
    </section>
  );
};

export default ProductShowcase;
