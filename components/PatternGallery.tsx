/**
 * 纹样画廊组件
 * 展示所有纹样，并提供儿童版和成人版切换
 */

import React, { useState, memo } from 'react';
import { patterns, getPatternsByCategory, getPatternsByScenario } from '../data/patternDatabase';
import { Pattern } from '../types';
import PatternDetail from './PatternDetail';
import ChildrenEducation from './ChildrenEducation';
import { Grid, List, Filter, X } from 'lucide-react';

type ViewMode = 'grid' | 'list';
type AudienceMode = 'adult' | 'child';

const PatternGallery: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [audienceMode, setAudienceMode] = useState<AudienceMode>('adult');
  const [selectedPattern, setSelectedPattern] = useState<Pattern | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<Pattern['category'] | 'all'>('all');
  const [scenarioFilter, setScenarioFilter] = useState<'all' | 'parent-child' | 'banquet' | 'space'>('all');

  // 过滤纹样
  const filteredPatterns = React.useMemo(() => {
    let result = [...patterns];

    if (categoryFilter !== 'all') {
      result = getPatternsByCategory(categoryFilter);
    }

    if (scenarioFilter !== 'all') {
      result = result.filter(p => p.suitableFor.includes(scenarioFilter));
    }

    return result;
  }, [categoryFilter, scenarioFilter]);

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="container mx-auto px-6">
        {/* 标题 */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 font-serif mb-4">
            南通蓝印花布纹样图鉴
          </h1>
          <p className="text-slate-600 max-w-2xl mx-auto">
            探索传统纹样的文化内涵，了解每个图案背后的故事
          </p>
        </div>

        {/* 控制栏 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* 视图模式切换 */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-slate-700">视图：</span>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'}`}
              >
                <Grid size={20} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'}`}
              >
                <List size={20} />
              </button>
            </div>

            {/* 受众模式切换 */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-slate-700">模式：</span>
              <button
                onClick={() => setAudienceMode('adult')}
                className={`px-4 py-2 rounded font-bold text-sm ${audienceMode === 'adult' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'}`}
              >
                成人版
              </button>
              <button
                onClick={() => setAudienceMode('child')}
                className={`px-4 py-2 rounded font-bold text-sm ${audienceMode === 'child' ? 'bg-yellow-400 text-white' : 'bg-slate-100 text-slate-600'}`}
              >
                儿童版
              </button>
            </div>

            {/* 过滤器 */}
            <div className="flex items-center gap-2">
              <Filter size={20} className="text-slate-600" />
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value as any)}
                className="px-3 py-2 border border-slate-300 rounded text-sm"
              >
                <option value="all">所有类别</option>
                <option value="吉祥纹样">吉祥纹样</option>
                <option value="自然纹样">自然纹样</option>
                <option value="几何纹样">几何纹样</option>
              </select>

              <select
                value={scenarioFilter}
                onChange={(e) => setScenarioFilter(e.target.value as any)}
                className="px-3 py-2 border border-slate-300 rounded text-sm"
              >
                <option value="all">所有场景</option>
                <option value="parent-child">亲子手作</option>
                <option value="banquet">婚宴定制</option>
                <option value="space">家居软装</option>
              </select>
            </div>
          </div>
        </div>

        {/* 纹样网格/列表 */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredPatterns.map((pattern) => (
              <PatternCard
                key={pattern.id}
                pattern={pattern}
                onClick={() => setSelectedPattern(pattern)}
              />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredPatterns.map((pattern) => (
              <PatternListItem
                key={pattern.id}
                pattern={pattern}
                onClick={() => setSelectedPattern(pattern)}
              />
            ))}
          </div>
        )}

        {/* 详情模态框 */}
        {selectedPattern && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6 overflow-y-auto">
            <div className="relative max-w-6xl w-full my-8">
              <button
                onClick={() => setSelectedPattern(null)}
                className="absolute top-4 right-4 z-10 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-slate-100 transition-colors"
              >
                <X size={20} />
              </button>

              {audienceMode === 'adult' ? (
                <PatternDetail
                  pattern={selectedPattern}
                  targetAudience="adult"
                />
              ) : (
                <ChildrenEducation pattern={selectedPattern} />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * 纹样卡片组件
 */
interface PatternCardProps {
  pattern: Pattern;
  onClick: () => void;
}

const PatternCard = memo<PatternCardProps>(({ pattern, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-xl transition-shadow"
    >
      <div className="relative h-48 bg-gradient-to-br from-blue-100 to-indigo-100">
        <img
          src={pattern.thumbnail}
          alt={pattern.name}
          className="w-full h-full object-cover mix-blend-multiply opacity-90 filter sepia-[.2] hue-rotate-[180deg]"
        />
        <div className="absolute top-3 right-3 bg-blue-900/80 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs">
          {pattern.category}
        </div>
      </div>

      <div className="p-4">
        <h3 className="text-lg font-bold text-slate-900 font-serif mb-1">
          {pattern.name}
        </h3>
        <p className="text-xs text-slate-500 italic mb-3">{pattern.nameEn}</p>

        <div className="flex flex-wrap gap-1 mb-3">
          {pattern.basicInfo.symbolism.slice(0, 3).map((symbol, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs"
            >
              {symbol}
            </span>
          ))}
        </div>

        <div className="flex gap-2">
          {pattern.suitableFor.includes('parent-child') && (
            <span className="text-xs">🎨</span>
          )}
          {pattern.suitableFor.includes('banquet') && (
            <span className="text-xs">💒</span>
          )}
          {pattern.suitableFor.includes('space') && (
            <span className="text-xs">🏠</span>
          )}
        </div>
      </div>
    </div>
  );
});

/**
 * 纹样列表项组件
 */
interface PatternListItemProps {
  pattern: Pattern;
  onClick: () => void;
}

const PatternListItem = memo<PatternListItemProps>(({ pattern, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-xl transition-shadow"
    >
      <div className="flex gap-6">
        <div className="relative w-32 h-32 flex-shrink-0 rounded-lg overflow-hidden bg-gradient-to-br from-blue-100 to-indigo-100">
          <img
            src={pattern.thumbnail}
            alt={pattern.name}
            className="w-full h-full object-cover mix-blend-multiply opacity-90 filter sepia-[.2] hue-rotate-[180deg]"
          />
        </div>

        <div className="flex-1">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="text-xl font-bold text-slate-900 font-serif mb-1">
                {pattern.name}
              </h3>
              <p className="text-sm text-slate-500 italic">{pattern.nameEn}</p>
            </div>
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-bold">
              {pattern.category}
            </span>
          </div>

          <div className="flex flex-wrap gap-2 mb-3">
            {pattern.basicInfo.symbolism.map((symbol, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm"
              >
                {symbol}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-4 text-sm text-slate-600">
            <span>时代：{pattern.basicInfo.era}</span>
            <span>•</span>
            <span>适用场景：
              {pattern.suitableFor.includes('parent-child') && ' 亲子'}
              {pattern.suitableFor.includes('banquet') && ' 婚宴'}
              {pattern.suitableFor.includes('space') && ' 家居'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
});

export default memo(PatternGallery);
