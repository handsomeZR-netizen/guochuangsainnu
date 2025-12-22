/**
 * 文化百科页面组件
 * 展示产品或纹样的详细文化信息
 */

import React, { useState, useEffect, memo } from 'react';
import { Pattern, ScenarioProduct } from '../types';
import { getPatternById } from '../data/patternDatabase';
import { scenarios } from '../data/scenarioConfig';
import PatternDetail from './PatternDetail';
import { ArrowLeft, ExternalLink } from 'lucide-react';

interface EncyclopediaPageProps {
  type: 'product' | 'pattern' | 'scenario-product';
  id: string;
  scenarioId?: string;
  onBack?: () => void;
}

const EncyclopediaPage: React.FC<EncyclopediaPageProps> = ({
  type,
  id,
  scenarioId,
  onBack
}) => {
  const [pattern, setPattern] = useState<Pattern | null>(null);
  const [product, setProduct] = useState<ScenarioProduct | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    if (type === 'pattern') {
      // 加载纹样信息
      const foundPattern = getPatternById(id);
      setPattern(foundPattern || null);
      setLoading(false);
    } else if (type === 'scenario-product' && scenarioId) {
      // 加载场景产品信息
      const scenario = scenarios.find(s => s.id === scenarioId);
      const foundProduct = scenario?.products.find(p => p.id === id);
      setProduct(foundProduct || null);
      
      // 如果产品有关联纹样，也加载纹样信息
      if (foundProduct?.pattern) {
        const relatedPattern = getPatternById(foundProduct.pattern.name);
        setPattern(relatedPattern || null);
      }
      setLoading(false);
    } else if (type === 'product') {
      // 从所有场景中查找产品
      let foundProduct: ScenarioProduct | null = null;
      for (const scenario of scenarios) {
        const prod = scenario.products.find(p => p.id === id);
        if (prod) {
          foundProduct = prod;
          break;
        }
      }
      setProduct(foundProduct);
      setLoading(false);
    }
  }, [type, id, scenarioId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">加载中...</p>
        </div>
      </div>
    );
  }

  if (!pattern && !product) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-slate-600 mb-4">未找到相关内容</p>
          {onBack && (
            <button
              onClick={onBack}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold transition-colors"
            >
              返回
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="container mx-auto px-6">
        {/* 返回按钮 */}
        {onBack && (
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6 font-bold transition-colors"
          >
            <ArrowLeft size={20} />
            返回
          </button>
        )}

        {/* 产品信息 */}
        {product && (
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* 产品图片 */}
              <div className="relative h-96 rounded-lg overflow-hidden bg-slate-200">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover mix-blend-multiply opacity-90 filter sepia-[.2] hue-rotate-[180deg]"
                />
              </div>

              {/* 产品详情 */}
              <div>
                <h1 className="text-3xl font-bold text-slate-900 font-serif mb-2">
                  {product.name}
                </h1>
                <p className="text-lg text-slate-500 italic mb-6">{product.nameEn}</p>

                <p className="text-slate-700 leading-relaxed mb-6">
                  {product.description}
                </p>

                {/* 价格 */}
                <div className="mb-6">
                  <span className="text-3xl font-bold text-blue-900">
                    {product.currency} {product.price}
                  </span>
                </div>

                {/* 包含内容 */}
                {product.includes && product.includes.length > 0 && (
                  <div className="mb-6">
                    <h3 className="font-bold text-slate-900 mb-3">包含内容：</h3>
                    <ul className="space-y-2">
                      {product.includes.map((item, index) => (
                        <li key={index} className="flex items-start gap-2 text-slate-700">
                          <span className="text-blue-600 mt-1">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* 定制信息 */}
                {product.customization && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                    <h3 className="font-bold text-blue-900 mb-2">定制服务：</h3>
                    <p className="text-blue-800">{product.customization}</p>
                  </div>
                )}

                {/* 购买链接 */}
                <a
                  href="#products"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold transition-colors"
                >
                  <ExternalLink size={20} />
                  查看更多产品
                </a>
              </div>
            </div>
          </div>
        )}

        {/* 纹样详情 */}
        {pattern && (
          <PatternDetail pattern={pattern} targetAudience="adult" />
        )}
      </div>
    </div>
  );
};

export default memo(EncyclopediaPage);
