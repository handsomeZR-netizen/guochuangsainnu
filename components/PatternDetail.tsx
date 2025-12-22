/**
 * 纹样详情组件
 * 展示纹样基础信息，并集成DeepSeek动态生成详细文化解读
 */

import React, { useState, useEffect, memo } from 'react';
import { Pattern } from '../types';
import { deepseekService } from '../services/deepseekService';
import { Sparkles, Loader2, BookOpen, Calendar, Tag } from 'lucide-react';

interface PatternDetailProps {
  pattern: Pattern;
  targetAudience?: 'adult' | 'child';
  onClose?: () => void;
}

const PatternDetail: React.FC<PatternDetailProps> = ({ 
  pattern, 
  targetAudience = 'adult',
  onClose 
}) => {
  const [culturalExplanation, setCulturalExplanation] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');

  // 加载详细文化解读
  useEffect(() => {
    const loadExplanation = async () => {
      // 如果已有缓存的解读，直接使用
      if (pattern.culturalMeaning && pattern.historicalOrigin) {
        setCulturalExplanation(
          `${pattern.culturalMeaning}\n\n${pattern.historicalOrigin}`
        );
        return;
      }

      // 否则调用DeepSeek生成
      setIsLoading(true);
      setError('');
      
      try {
        const explanation = await deepseekService.generatePatternExplanation(
          pattern.name,
          targetAudience
        );
        setCulturalExplanation(explanation);
      } catch (err) {
        console.error('Failed to generate pattern explanation:', err);
        setError('无法加载详细解读，请稍后重试');
      } finally {
        setIsLoading(false);
      }
    };

    loadExplanation();
  }, [pattern.name, pattern.culturalMeaning, pattern.historicalOrigin, targetAudience]);

  return (
    <div className="bg-white rounded-lg shadow-xl overflow-hidden max-w-4xl mx-auto">
      {/* 头部图片 */}
      <div className="relative h-80 bg-gradient-to-br from-blue-100 to-indigo-100">
        <img
          src={pattern.image}
          alt={pattern.name}
          className="w-full h-full object-cover mix-blend-multiply opacity-90 filter sepia-[.2] hue-rotate-[180deg]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        
        {/* 标题覆盖层 */}
        <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 bg-blue-600/80 backdrop-blur-sm rounded-full text-sm">
              {pattern.category}
            </span>
            <span className="px-3 py-1 bg-indigo-600/80 backdrop-blur-sm rounded-full text-sm">
              {pattern.basicInfo.era}
            </span>
          </div>
          <h2 className="text-4xl font-bold font-serif mb-2">{pattern.name}</h2>
          <p className="text-lg italic opacity-90">{pattern.nameEn}</p>
        </div>

        {/* 关闭按钮 */}
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-full flex items-center justify-center text-white transition-colors"
            aria-label="关闭"
          >
            ✕
          </button>
        )}
      </div>

      {/* 内容区域 */}
      <div className="p-8 space-y-6">
        {/* 基础信息 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* 象征意义 */}
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="text-blue-600" size={20} />
              <h3 className="font-bold text-slate-900">象征意义</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {pattern.basicInfo.symbolism.map((symbol, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-white text-blue-800 rounded-full text-sm"
                >
                  {symbol}
                </span>
              ))}
            </div>
          </div>

          {/* 适用场合 */}
          <div className="bg-indigo-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="text-indigo-600" size={20} />
              <h3 className="font-bold text-slate-900">适用场合</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {pattern.basicInfo.occasion.map((occasion, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-white text-indigo-800 rounded-full text-sm"
                >
                  {occasion}
                </span>
              ))}
            </div>
          </div>

          {/* 标签 */}
          <div className="bg-slate-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <Tag className="text-slate-600" size={20} />
              <h3 className="font-bold text-slate-900">标签</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {pattern.tags.slice(0, 4).map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-white text-slate-700 rounded-full text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* AI生成的详细文化解读 */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="text-blue-700" size={24} />
            <h3 className="text-xl font-bold text-slate-900">
              {targetAudience === 'child' ? '儿童版故事' : '文化解读'}
            </h3>
            <Sparkles className="text-blue-600 ml-auto" size={20} />
            <span className="text-xs text-blue-600 font-bold">AI生成</span>
          </div>

          {isLoading && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="animate-spin text-blue-600" size={32} />
              <span className="ml-3 text-slate-600">正在生成详细解读...</span>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
              {error}
            </div>
          )}

          {!isLoading && !error && culturalExplanation && (
            <div className="prose prose-slate max-w-none">
              <p className="text-slate-700 leading-relaxed whitespace-pre-line">
                {culturalExplanation}
              </p>
            </div>
          )}
        </div>

        {/* 适用场景 */}
        <div>
          <h3 className="text-lg font-bold text-slate-900 mb-3">适用场景</h3>
          <div className="flex gap-3">
            {pattern.suitableFor.includes('parent-child') && (
              <span className="px-4 py-2 bg-blue-100 text-blue-800 rounded-lg text-sm font-bold">
                🎨 亲子手作
              </span>
            )}
            {pattern.suitableFor.includes('banquet') && (
              <span className="px-4 py-2 bg-indigo-100 text-indigo-800 rounded-lg text-sm font-bold">
                💒 婚宴定制
              </span>
            )}
            {pattern.suitableFor.includes('space') && (
              <span className="px-4 py-2 bg-slate-100 text-slate-800 rounded-lg text-sm font-bold">
                🏠 家居软装
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(PatternDetail);
