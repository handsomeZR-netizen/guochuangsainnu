import React, { useEffect } from 'react';
import { Product } from '../types';
import { X, ShieldCheck, Truck, ArrowRight, Share2, Heart } from 'lucide-react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';

interface ProductDetailProps {
  product: Product;
  onClose: () => void;
}

const mockAssessmentData = [
  { subject: '稀缺性', A: 120, fullMark: 150 },
  { subject: '年份', A: 98, fullMark: 150 },
  { subject: '工艺', A: 130, fullMark: 150 },
  { subject: '热度', A: 110, fullMark: 150 },
  { subject: '品相', A: 125, fullMark: 150 },
];

const ProductDetail: React.FC<ProductDetailProps> = ({ product, onClose }) => {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 md:p-8 animate-fade-in">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/80 backdrop-blur-md transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="relative bg-white w-full max-w-6xl max-h-[90vh] h-full overflow-y-auto rounded-sm shadow-2xl flex flex-col md:flex-row overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 bg-white/20 hover:bg-white/40 p-2 rounded-full backdrop-blur-sm transition-colors text-slate-800"
        >
          <X size={24} />
        </button>

        {/* Left: Immersive Image Area */}
        <div className="w-full md:w-1/2 bg-slate-100 relative group overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover mix-blend-multiply transition-transform duration-1000 group-hover:scale-105 filter sepia-[.1] hue-rotate-[180deg]"
          />
          {/* Texture Overlay */}
          <div
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/rice-paper.png")' }}
          ></div>
          <div className="absolute bottom-0 left-0 w-full p-8 bg-gradient-to-t from-slate-900/80 to-transparent text-white">
            <div className="flex gap-2 mb-2">
              {product.tags.map(tag => (
                <span key={tag} className="text-xs uppercase tracking-widest border border-white/30 px-2 py-1">
                  {tag}
                </span>
              ))}
            </div>
            <h2 className="text-3xl font-serif">{product.name}</h2>
            <p className="opacity-80 italic font-serif">{product.nameEn}</p>
          </div>
        </div>

        {/* Right: Info Area */}
        <div className="w-full md:w-1/2 p-8 md:p-12 overflow-y-auto bg-white flex flex-col">
          {/* Header Info */}
          <div className="flex justify-between items-start border-b border-slate-100 pb-6 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 mb-2 font-serif">工艺传承</h1>
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span>有货 (全球配送)</span>
                <span className="mx-2">|</span>
                <span>SKU: IF-{product.id.padStart(4, '0')}</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-blue-900 font-serif">
                {product.currency} {product.price.toLocaleString()}
              </div>
              <div className="text-xs text-slate-400 mt-1">含税费与保险</div>
            </div>
          </div>

          {/* AI Analysis Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="bg-slate-50 p-4 rounded border border-slate-100">
              <h4 className="text-xs font-bold text-blue-800 uppercase tracking-widest mb-4 flex items-center gap-2">
                <ShieldCheck size={14} /> AI 价值评估
              </h4>
              <div className="h-40 -ml-4">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="70%" data={mockAssessmentData}>
                    <PolarGrid stroke="#e2e8f0" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 10 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 150]} tick={false} axisLine={false} />
                    <Radar
                      name="Value"
                      dataKey="A"
                      stroke="#1e3a8a"
                      strokeWidth={2}
                      fill="#1e3a8a"
                      fillOpacity={0.15}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="flex flex-col justify-center">
              <h4 className="text-sm font-bold text-slate-900 mb-2">数据洞察</h4>
              <p className="text-sm text-slate-600 leading-relaxed mb-3">
                根据 InkFlow 数据库，该品类在过去 6 个月内升值了 <strong>12.5%</strong>。
              </p>
              <div className="text-xs text-slate-400 p-3 bg-slate-50 border border-slate-100 italic">
                "工艺难度极高，尤其是青花发色控制完美，属于收藏级精品。"
              </div>
            </div>
          </div>

          {/* Story & Description */}
          <div className="mb-8">
            <h3 className="text-lg font-bold text-slate-900 mb-3 font-serif">藏品故事</h3>
            <p className="text-slate-600 leading-relaxed mb-4 font-serif">{product.description}</p>
            <div className="bg-blue-50/50 p-4 border-l-2 border-blue-800">
              <h4 className="text-sm font-bold text-blue-900 mb-1">工艺细节</h4>
              <p className="text-sm text-slate-700">{product.craftsmanship}</p>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-auto">
            <div className="flex gap-4 mb-6">
              <button className="flex-1 bg-blue-900 hover:bg-blue-800 text-white py-4 font-bold tracking-widest flex items-center justify-center gap-2 transition-colors">
                立即收藏 <ArrowRight size={18} />
              </button>
              <button className="px-6 border border-slate-200 hover:border-blue-900 hover:text-blue-900 transition-colors flex items-center justify-center">
                <Heart size={20} />
              </button>
              <button className="px-6 border border-slate-200 hover:border-blue-900 hover:text-blue-900 transition-colors flex items-center justify-center">
                <Share2 size={20} />
              </button>
            </div>
            <div className="flex items-center justify-center gap-6 text-xs text-slate-400 uppercase tracking-wider">
              <span className="flex items-center gap-1">
                <ShieldCheck size={14} /> 官方真伪鉴定
              </span>
              <span className="flex items-center gap-1">
                <Truck size={14} /> 全球艺术品物流
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
