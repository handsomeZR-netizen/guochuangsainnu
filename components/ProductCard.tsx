import React from 'react';
import { Eye, ShoppingCart } from 'lucide-react';

export interface Product {
  id: string;
  name: string;
  nameEn: string;
  price: number;
  currency: string;
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
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onViewDetail, onAddToCart }) => {
  return (
    <div className="group cursor-pointer">
      <div className="relative bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-500 overflow-hidden">
        {/* Product Image */}
        <div className="relative aspect-[4/5] overflow-hidden bg-slate-200">
          <img
            alt={product.name}
            className="w-full h-full object-cover mix-blend-multiply opacity-90 filter sepia-[.2] hue-rotate-[180deg] transition-transform duration-700 group-hover:scale-110"
            src={product.image}
          />
          
          {/* Price Status Badge */}
          {product.priceStatus && (
            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm">
              <span className="text-slate-600">{product.priceStatus}</span>
            </div>
          )}

          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-slate-900/80 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-center items-center text-white p-8">
            <h3 className="text-2xl font-serif mb-4 text-center">{product.name}</h3>
            <p className="text-slate-300 text-sm leading-relaxed mb-6 text-center line-clamp-3">
              {product.description}
            </p>
            
            {/* Craft Details */}
            <div className="mb-6">
              <h4 className="text-xs font-bold uppercase tracking-widest text-blue-400 mb-2 text-center">
                工艺细节
              </h4>
              <p className="text-sm text-center text-slate-200">
                {product.craftDetails}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onViewDetail(product);
                }}
                className="border border-slate-500 hover:border-white hover:bg-white/10 p-3 rounded-full transition-all"
                aria-label="查看详情"
              >
                <Eye size={20} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onViewDetail(product);
                }}
                className="bg-blue-700 hover:bg-blue-600 text-white px-6 py-3 rounded-full text-sm font-bold tracking-wider flex items-center gap-2 transition-colors"
              >
                <ShoppingCart size={16} />
                查看详情
              </button>
            </div>
          </div>
        </div>

        {/* Product Info */}
        <div className="p-4 sm:p-6">
          <h3 className="text-lg sm:text-xl font-bold text-slate-900 font-serif mb-1 group-hover:text-blue-800 transition-colors">
            {product.name}
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 italic mb-2 sm:mb-3">{product.nameEn}</p>
          
          <div className="flex items-center justify-between flex-wrap gap-2">
            <p className="text-xl sm:text-2xl font-bold text-blue-900">
              <span className="text-xs sm:text-sm font-normal text-slate-500 mr-1">{product.currency}</span>
              {product.price}
            </p>
            <div className="flex gap-1 flex-wrap">
              {product.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded"
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
