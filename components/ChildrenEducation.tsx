/**
 * 儿童版科普内容组件
 * 为亲子场景产品提供适合儿童理解的纹样故事和非遗知识
 */

import React, { useState, useEffect, memo } from 'react';
import { Pattern, ScenarioProduct } from '../types';
import { deepseekService } from '../services/deepseekService';
import { Sparkles, Loader2, BookOpen, Star } from 'lucide-react';

interface ChildrenEducationProps {
  pattern?: Pattern;
  product?: ScenarioProduct;
  className?: string;
}

const ChildrenEducation: React.FC<ChildrenEducationProps> = ({
  pattern,
  product,
  className = ''
}) => {
  const [childStory, setChildStory] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');

  // 获取纹样名称
  const patternName = pattern?.name || product?.pattern?.name || '';

  useEffect(() => {
    if (!patternName) return;

    const loadChildStory = async () => {
      setIsLoading(true);
      setError('');

      try {
        // 使用DeepSeek生成儿童版解读
        const story = await deepseekService.generatePatternExplanation(
          patternName,
          'child'
        );
        setChildStory(story);
      } catch (err) {
        console.error('Failed to generate child story:', err);
        setError('无法加载儿童版故事，请稍后重试');
      } finally {
        setIsLoading(false);
      }
    };

    loadChildStory();
  }, [patternName]);

  if (!patternName) {
    return null;
  }

  return (
    <div className={`bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg p-6 ${className}`}>
      {/* 标题 */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center">
          <Star className="text-white" size={20} />
        </div>
        <div>
          <h3 className="text-xl font-bold text-slate-900 font-serif">
            儿童版故事
          </h3>
          <p className="text-sm text-slate-600">
            用简单有趣的语言，讲述纹样背后的故事
          </p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Sparkles className="text-yellow-600" size={20} />
          <span className="text-xs text-yellow-600 font-bold">AI生成</span>
        </div>
      </div>

      {/* 纹样信息 */}
      <div className="bg-white rounded-lg p-4 mb-4">
        <div className="flex items-center gap-3">
          {pattern?.thumbnail && (
            <img
              src={pattern.thumbnail}
              alt={patternName}
              className="w-16 h-16 rounded-lg object-cover"
            />
          )}
          <div>
            <h4 className="text-lg font-bold text-slate-900">{patternName}</h4>
            {pattern?.nameEn && (
              <p className="text-sm text-slate-500 italic">{pattern.nameEn}</p>
            )}
          </div>
        </div>
      </div>

      {/* 加载状态 */}
      {isLoading && (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="animate-spin text-yellow-600" size={32} />
          <span className="ml-3 text-slate-600">正在生成儿童版故事...</span>
        </div>
      )}

      {/* 错误状态 */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          {error}
        </div>
      )}

      {/* 故事内容 */}
      {!isLoading && !error && childStory && (
        <div className="bg-white rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="text-yellow-600" size={20} />
            <h4 className="font-bold text-slate-900">故事时间</h4>
          </div>
          <div className="prose prose-slate max-w-none">
            <p className="text-slate-700 leading-relaxed text-lg whitespace-pre-line">
              {childStory}
            </p>
          </div>
        </div>
      )}

      {/* 互动提示 */}
      {!isLoading && !error && childStory && (
        <div className="mt-4 bg-yellow-100 border-2 border-yellow-300 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <span className="text-2xl">💡</span>
            <div>
              <h5 className="font-bold text-yellow-900 mb-1">小朋友，你知道吗？</h5>
              <p className="text-sm text-yellow-800 leading-relaxed">
                这个纹样是南通的老艺人们用手工刮浆印染的方法做出来的。
                他们先在布上刮上特殊的浆糊，然后放进蓝色的染料里，
                最后把浆糊洗掉，就出现了美丽的白色纹样！
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 活动建议 */}
      {!isLoading && !error && childStory && (
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="bg-white rounded-lg p-4 border-2 border-blue-200">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">🎨</span>
              <h5 className="font-bold text-slate-900 text-sm">动手试试</h5>
            </div>
            <p className="text-xs text-slate-600">
              用蜡笔在纸上画出这个纹样，然后用水彩涂色，看看会有什么效果！
            </p>
          </div>

          <div className="bg-white rounded-lg p-4 border-2 border-green-200">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">📖</span>
              <h5 className="font-bold text-slate-900 text-sm">讲给爸爸妈妈听</h5>
            </div>
            <p className="text-xs text-slate-600">
              把这个纹样的故事讲给爸爸妈妈听，看看他们知不知道这些知识！
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default memo(ChildrenEducation);
