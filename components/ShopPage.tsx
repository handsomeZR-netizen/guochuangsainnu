import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Grid3x3, List, ArrowLeft, Filter, X } from 'lucide-react';
import Footer from './Footer';
import ProductCard, { Product } from './ProductCard';

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

  // 示例分类数据 - 后续可以替换
  const categories: Category[] = [
    { id: 'all', name: '全部商品', nameEn: 'All Products' },
    { id: 'accessories', name: '配饰', nameEn: 'Accessories', subcategories: ['围巾', '手帕', '包袋'] },
    { id: 'home', name: '家居', nameEn: 'Home Decor', subcategories: ['抱枕', '桌布', '挂画'] },
    { id: 'clothing', name: '服饰', nameEn: 'Clothing', subcategories: ['上衣', '裙装', '外套'] },
    { id: 'gifts', name: '礼品', nameEn: 'Gifts', subcategories: ['摆件', '文创', '套装'] },
  ];

  // 示例产品数据 - 后续可以替换为实际数据
  const products: Product[] = [
    {
      id: '1',
      name: '缠枝莲纹青花瓷瓶',
      nameEn: 'Blue & White Porcelain Vase',
      price: 1250,
      currency: 'USD',
      image: '/images/product-1.jpg',
      description: '运用传统青花瓷工艺，历经1400度高温烧制。缠枝莲纹寓意生生不息，瓶身线条流畅优美。',
      craftDetails: '100% 高岭土 · 景德镇非遗传承人手绘 · 1400°C高温烧制',
      priceStatus: '📈 热销',
      tags: ['瓷器', '家居'],
      category: 'home'
    },
    {
      id: '2',
      name: '双面绣团扇·兰花',
      nameEn: 'Double-sided Su Embroidery',
      price: 380,
      currency: 'USD',
      image: '/images/product-2.jpg',
      description: '运用"平金夹绣"技法，历时200小时手工绣制。双面异色，针法活泼，兰花栩栩如生，仿佛散发着幽香。扇柄采用名贵紫光檀，手感温润。',
      craftDetails: '100% 桑蚕丝 · 镇湖苏绣非遗传承人手作 · 紫光檀',
      priceStatus: '📊 价格平稳',
      tags: ['织绣', '配饰'],
      category: 'accessories'
    },
    {
      id: '3',
      name: '老坑歙砚·山水',
      nameEn: 'She Ink Stone',
      price: 890,
      currency: 'USD',
      image: '/images/product-3.jpg',
      description: '选用安徽歙县老坑石材，石质细腻，发墨快而不损毫。雕刻山水纹饰，意境深远。',
      craftDetails: '老坑歙石 · 国家级工艺美术大师雕刻 · 配紫檀木盒',
      priceStatus: '💎 珍藏',
      tags: ['文房', '礼品'],
      category: 'gifts'
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
                : 'space-y-4'
            }>
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onViewDetail={handleViewDetail}
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
    </div>
  );
};

export default ShopPage;
