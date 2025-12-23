import React, { useState } from 'react';
import { X, ShoppingCart, Heart, Share2, Minus, Plus, Truck, Shield, RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react';
import { Product } from './ProductCard';

interface ProductDetailModalProps {
  product: Product;
  onClose: () => void;
  relatedProducts?: Product[];
  onViewRelated?: (product: Product) => void;
}

const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ 
  product, 
  onClose, 
  relatedProducts = [],
  onViewRelated 
}) => {
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeTab, setActiveTab] = useState<'description' | 'details' | 'shipping'>('description');
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleQuantityChange = (delta: number) => {
    setQuantity(prev => Math.max(1, Math.min(99, prev + delta)));
  };

  const handleAddToCart = () => {
    // 模拟添加到购物车
    alert(`已将 ${quantity} 件「${product.name}」加入购物车`);
  };

  const handleBuyNow = () => {
    // 模拟立即购买
    alert(`正在购买 ${quantity} 件「${product.name}」，总价 ¥${(product.price * quantity).toFixed(2)}`);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: product.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('链接已复制到剪贴板');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-white/90 hover:bg-white rounded-full shadow-lg transition-all hover:scale-110"
        >
          <X size={20} className="text-slate-600" />
        </button>

        {/* Scrollable Content */}
        <div className="overflow-y-auto flex-1">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            {/* Left: Product Image */}
            <div className="relative bg-gradient-to-br from-slate-100 to-slate-200 p-8 lg:p-12 flex items-center justify-center min-h-[300px] lg:min-h-[500px]">
              {/* Loading Skeleton */}
              {!imageLoaded && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
                </div>
              )}
              <img
                src={product.image}
                alt={product.name}
                className={`max-w-full max-h-[400px] object-contain rounded-lg shadow-xl transition-opacity duration-500 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                onLoad={() => setImageLoaded(true)}
              />
              
              {/* Badge */}
              {product.priceStatus && (
                <div className="absolute top-6 left-6 bg-blue-900 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                  {product.priceStatus}
                </div>
              )}
            </div>

            {/* Right: Product Info */}
            <div className="p-6 lg:p-8 flex flex-col">
              {/* Header */}
              <div className="mb-6">
                <p className="text-sm text-blue-600 font-medium mb-2 uppercase tracking-wider">
                  {product.category === 'handcraft' ? '巧手非遗体验' : 
                   product.category === 'banquet' ? '宴席用品' : '空间装饰'}
                </p>
                <h2 className="text-2xl lg:text-3xl font-bold text-slate-900 font-serif mb-2">
                  {product.name}
                </h2>
                <p className="text-slate-500 italic">{product.nameEn}</p>
              </div>

              {/* Price */}
              <div className="mb-6 pb-6 border-b border-slate-200">
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl lg:text-4xl font-bold text-blue-900">
                    ¥{product.price}
                  </span>
                  {product.priceEur && (
                    <span className="text-lg text-slate-400">
                      ≈ €{product.priceEur}
                    </span>
                  )}
                </div>
                <p className="text-sm text-green-600 mt-2 flex items-center gap-1">
                  <span className="inline-block w-2 h-2 bg-green-500 rounded-full"></span>
                  有货 · 预计3-5天发货
                </p>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-6">
                {product.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Tabs */}
              <div className="mb-6">
                <div className="flex border-b border-slate-200">
                  {[
                    { id: 'description', label: '商品描述' },
                    { id: 'details', label: '工艺细节' },
                    { id: 'shipping', label: '配送说明' },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`px-4 py-3 text-sm font-medium transition-colors relative ${
                        activeTab === tab.id
                          ? 'text-blue-900'
                          : 'text-slate-500 hover:text-slate-700'
                      }`}
                    >
                      {tab.label}
                      {activeTab === tab.id && (
                        <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-900" />
                      )}
                    </button>
                  ))}
                </div>
                <div className="py-4 text-slate-600 text-sm leading-relaxed min-h-[100px]">
                  {activeTab === 'description' && product.description}
                  {activeTab === 'details' && (
                    <div>
                      <p className="font-medium text-slate-900 mb-2">工艺特点</p>
                      <p>{product.craftDetails}</p>
                    </div>
                  )}
                  {activeTab === 'shipping' && (
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Truck size={18} className="text-blue-600" />
                        <span>全国包邮，偏远地区除外</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Shield size={18} className="text-blue-600" />
                        <span>正品保障，假一赔十</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <RotateCcw size={18} className="text-blue-600" />
                        <span>7天无理由退换</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Quantity Selector */}
              <div className="flex items-center gap-4 mb-6">
                <span className="text-sm text-slate-600">数量</span>
                <div className="flex items-center border border-slate-300 rounded-lg overflow-hidden">
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    className="p-2 hover:bg-slate-100 transition-colors disabled:opacity-50"
                    disabled={quantity <= 1}
                  >
                    <Minus size={16} />
                  </button>
                  <span className="w-12 text-center font-medium">{quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(1)}
                    className="p-2 hover:bg-slate-100 transition-colors disabled:opacity-50"
                    disabled={quantity >= 99}
                  >
                    <Plus size={16} />
                  </button>
                </div>
                <span className="text-sm text-slate-400">库存充足</span>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 mb-6">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 border-2 border-blue-900 text-blue-900 rounded-xl font-bold hover:bg-blue-50 transition-colors"
                >
                  <ShoppingCart size={20} />
                  加入购物车
                </button>
                <button
                  onClick={handleBuyNow}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-blue-900 text-white rounded-xl font-bold hover:bg-blue-800 transition-colors"
                >
                  立即购买
                </button>
              </div>

              {/* Secondary Actions */}
              <div className="flex items-center gap-4 pt-4 border-t border-slate-200">
                <button
                  onClick={() => setIsFavorite(!isFavorite)}
                  className={`flex items-center gap-2 text-sm transition-colors ${
                    isFavorite ? 'text-red-500' : 'text-slate-500 hover:text-red-500'
                  }`}
                >
                  <Heart size={18} fill={isFavorite ? 'currentColor' : 'none'} />
                  {isFavorite ? '已收藏' : '收藏'}
                </button>
                <button
                  onClick={handleShare}
                  className="flex items-center gap-2 text-sm text-slate-500 hover:text-blue-600 transition-colors"
                >
                  <Share2 size={18} />
                  分享
                </button>
              </div>
            </div>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div className="border-t border-slate-200 p-6 lg:p-8 bg-slate-50">
              <h3 className="text-lg font-bold text-slate-900 mb-4">相关推荐</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {relatedProducts.slice(0, 4).map((item) => (
                  <div
                    key={item.id}
                    onClick={() => onViewRelated?.(item)}
                    className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer group"
                  >
                    <div className="aspect-square bg-slate-100 overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-3">
                      <p className="text-sm font-medium text-slate-900 truncate">{item.name}</p>
                      <p className="text-sm text-blue-900 font-bold">¥{item.price}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetailModal;
