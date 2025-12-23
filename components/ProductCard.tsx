import React from 'react';
import { Eye, ShoppingCart } from 'lucide-react';

export interface Product {
  id: string;
  name: string;
  nameEn: string;
  price: number;
  currency: string;
  priceEur?: number;
  image: string;
  description: string;
  craftDetails: string;
  priceStatus?: string;
  tags: string[];
  category: string;
}

interface ProductCardProps {
  product: Product;
  onViewDetail: (product: Product) => void;
  onAddToCart?: (product: Product) => void;
  viewMode?: 'grid' | 'list';
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onViewDetail, onAddToCart, viewMode = 'grid' }) => {
  // 列表视图
  if (viewMode === 'list') {
    return (
      <div 
        className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden cursor-pointer group"
        onClick={() => onViewDetail(product)}
      >
        <div className="flex flex-col sm:flex-row">
          {/* Product Image */}
          <div className="relative w-full sm:w-48 h-48 sm:h-40 flex-shrink-0 overflow-hidden bg-slate-100">
            <img
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              src={product.image}
              loading="lazy"
            />
            {product.priceStatus && (
              <div className="absolute top-2 left-2 bg-blue-900/90 text-white px-2 py-1 rounded text-xs font-medium">
                {product.priceStatus}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="flex-1 p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between gap-4 mb-2">
                <div>
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-800 transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-xs text-slate-500 italic">{product.nameEn}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-lg font-bold text-blue-900">¥{product.price}</p>
                  {product.priceEur && (
                    <p className="text-xs text-slate-400">€{product.priceEur}</p>
                  )}
                </div>
              </div>
              <p className="text-sm text-slate-600 line-clamp-2 mb-3">{product.description}</p>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex gap-1 flex-wrap">
                {product.tags.slice(0, 3).map((tag, idx) => (
                  <span
                    key={idx}
                    className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onViewDetail(product);
                }}
                className="text-sm text-blue-700 hover:text-blue-900 font-medium flex items-center gap-1"
              >
                查看详情
                <Eye size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 网格视图（默认）
  return (
    <div 
      className="group cursor-pointer"
      onClick={() => onViewDetail(product)}
    >
      <div className="relative bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-500 overflow-hidden">
        {/* Product Image */}
        <div className="relative aspect-[4/5] overflow-hidden bg-slate-100">
          <img
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            src={product.image}
            loading="lazy"
          />
          
          {/* Price Status Badge */}
          {product.priceStatus && (
            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm">
              <span className="text-slate-600">{product.priceStatus}</span>
            </div>
          )}

          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-slate-900/80 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-center items-center text-white p-6">
            <h3 className="text-xl font-serif mb-3 text-center">{product.name}</h3>
            <p className="text-slate-300 text-sm leading-relaxed mb-4 text-center line-clamp-3">
              {product.description}
            </p>
            
            {/* Craft Details */}
            <div className="mb-4">
              <h4 className="text-xs font-bold uppercase tracking-widest text-blue-400 mb-1 text-center">
                工艺细节
              </h4>
              <p className="text-xs text-center text-slate-200">
                {product.craftDetails}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onViewDetail(product);
                }}
                className="border border-slate-500 hover:border-white hover:bg-white/10 p-2.5 rounded-full transition-all"
                aria-label="查看详情"
              >
                <Eye size={18} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onViewDetail(product);
                }}
                className="bg-blue-700 hover:bg-blue-600 text-white px-5 py-2.5 rounded-full text-sm font-bold tracking-wider flex items-center gap-2 transition-colors"
              >
                <ShoppingCart size={14} />
                查看详情
              </button>
            </div>
          </div>
        </div>

        {/* Product Info */}
        <div className="p-4">
          <h3 className="text-base font-bold text-slate-900 font-serif mb-1 group-hover:text-blue-800 transition-colors line-clamp-1">
            {product.name}
          </h3>
          <p className="text-xs text-slate-500 italic mb-2">{product.nameEn}</p>
          
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <p className="text-lg font-bold text-blue-900">
                <span className="text-xs font-normal text-slate-500 mr-0.5">¥</span>
                {product.price}
              </p>
              {product.priceEur && (
                <p className="text-xs text-slate-500">€{product.priceEur}</p>
              )}
            </div>
            <div className="flex gap-1 flex-wrap">
              {product.tags.slice(0, 2).map((tag, idx) => (
                <span
                  key={idx}
                  className="text-xs bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
