import React, { useState, useEffect, useRef } from 'react';
import { SectionId } from '../types';
import { deepseekService, DeepSeekError, RecommendationResult } from '../services/deepseekService';
import { doubaoService, DoubaoError } from '../services/doubaoService';
import { Sparkles, Image as ImageIcon, MessageSquare, Loader2, Upload, Home, History, Trash2, ChevronDown, ChevronUp } from 'lucide-react';

type AIMode = 'pattern-explanation' | 'image-generation' | 'room-analysis';

interface AIResult {
  text?: string;
  image?: string;
  recommendations?: Array<{
    patternName: string;
    layout: string;
    reason: string;
  }>;
}

interface SelectedRecommendation {
  index: number;
  patternName: string;
}

// 历史记录类型定义
interface PatternHistoryItem {
  id: string;
  timestamp: number;
  patternName: string;
  targetAudience: 'adult' | 'child';
  result: string;
}

interface ImageHistoryItem {
  id: string;
  timestamp: number;
  patternName: string;
  style: 'traditional' | 'modern';
  imageUrl: string;
}

interface RoomHistoryItem {
  id: string;
  timestamp: number;
  roomDescription: string;
  recommendations: RecommendationResult['recommendations'];
  previewImage?: string;
}

// localStorage keys
const STORAGE_KEYS = {
  PATTERN_HISTORY: 'ai_pattern_history',
  IMAGE_HISTORY: 'ai_image_history',
  ROOM_HISTORY: 'ai_room_history'
};

// 历史记录最大数量
const MAX_HISTORY_ITEMS = 10;

const AIGenerator: React.FC = () => {
  const [activeMode, setActiveMode] = useState<AIMode>('pattern-explanation');
  
  // Pattern Explanation State
  const [patternName, setPatternName] = useState('');
  const [targetAudience, setTargetAudience] = useState<'adult' | 'child'>('adult');
  
  // Image Generation State
  const [imagePatternName, setImagePatternName] = useState('');
  const [imageStyle, setImageStyle] = useState<'traditional' | 'modern'>('traditional');
  
  // Room Analysis State
  const [roomDescription, setRoomDescription] = useState('');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string>('');
  
  // Common State
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AIResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedRecommendation, setSelectedRecommendation] = useState<SelectedRecommendation | null>(null);
  const [show3DPreview, setShow3DPreview] = useState(false);
  
  // 流式输出状态
  const [streamingText, setStreamingText] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  
  // 历史记录状态
  const [patternHistory, setPatternHistory] = useState<PatternHistoryItem[]>([]);
  const [imageHistory, setImageHistory] = useState<ImageHistoryItem[]>([]);
  const [roomHistory, setRoomHistory] = useState<RoomHistoryItem[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  
  // 滚动引用
  const resultRef = useRef<HTMLDivElement>(null);

  // 加载历史记录
  useEffect(() => {
    try {
      const savedPatternHistory = localStorage.getItem(STORAGE_KEYS.PATTERN_HISTORY);
      const savedImageHistory = localStorage.getItem(STORAGE_KEYS.IMAGE_HISTORY);
      const savedRoomHistory = localStorage.getItem(STORAGE_KEYS.ROOM_HISTORY);
      
      if (savedPatternHistory) setPatternHistory(JSON.parse(savedPatternHistory));
      if (savedImageHistory) setImageHistory(JSON.parse(savedImageHistory));
      if (savedRoomHistory) setRoomHistory(JSON.parse(savedRoomHistory));
    } catch (e) {
      console.error('Failed to load history:', e);
    }
  }, []);

  // 保存历史记录到localStorage
  const savePatternHistory = (items: PatternHistoryItem[]) => {
    const trimmed = items.slice(0, MAX_HISTORY_ITEMS);
    setPatternHistory(trimmed);
    localStorage.setItem(STORAGE_KEYS.PATTERN_HISTORY, JSON.stringify(trimmed));
  };

  const saveImageHistory = (items: ImageHistoryItem[]) => {
    const trimmed = items.slice(0, MAX_HISTORY_ITEMS);
    setImageHistory(trimmed);
    localStorage.setItem(STORAGE_KEYS.IMAGE_HISTORY, JSON.stringify(trimmed));
  };

  const saveRoomHistory = (items: RoomHistoryItem[]) => {
    const trimmed = items.slice(0, MAX_HISTORY_ITEMS);
    setRoomHistory(trimmed);
    localStorage.setItem(STORAGE_KEYS.ROOM_HISTORY, JSON.stringify(trimmed));
  };

  // 添加历史记录
  const addPatternHistoryItem = (item: Omit<PatternHistoryItem, 'id' | 'timestamp'>) => {
    const newItem: PatternHistoryItem = {
      ...item,
      id: Date.now().toString(),
      timestamp: Date.now()
    };
    savePatternHistory([newItem, ...patternHistory]);
  };

  const addImageHistoryItem = (item: Omit<ImageHistoryItem, 'id' | 'timestamp'>) => {
    const newItem: ImageHistoryItem = {
      ...item,
      id: Date.now().toString(),
      timestamp: Date.now()
    };
    saveImageHistory([newItem, ...imageHistory]);
  };

  const addRoomHistoryItem = (item: Omit<RoomHistoryItem, 'id' | 'timestamp'>) => {
    const newItem: RoomHistoryItem = {
      ...item,
      id: Date.now().toString(),
      timestamp: Date.now()
    };
    saveRoomHistory([newItem, ...roomHistory]);
  };

  // 删除历史记录
  const deletePatternHistoryItem = (id: string) => {
    savePatternHistory(patternHistory.filter(item => item.id !== id));
  };

  const deleteImageHistoryItem = (id: string) => {
    saveImageHistory(imageHistory.filter(item => item.id !== id));
  };

  const deleteRoomHistoryItem = (id: string) => {
    saveRoomHistory(roomHistory.filter(item => item.id !== id));
  };

  // 清空历史记录
  const clearCurrentHistory = () => {
    switch (activeMode) {
      case 'pattern-explanation':
        savePatternHistory([]);
        break;
      case 'image-generation':
        saveImageHistory([]);
        break;
      case 'room-analysis':
        saveRoomHistory([]);
        break;
    }
  };

  // 从历史记录恢复
  const restorePatternHistory = (item: PatternHistoryItem) => {
    setPatternName(item.patternName);
    setTargetAudience(item.targetAudience);
    setResult({ text: item.result });
    setShowHistory(false);
  };

  const restoreImageHistory = (item: ImageHistoryItem) => {
    setImagePatternName(item.patternName);
    setImageStyle(item.style);
    setResult({ image: item.imageUrl });
    setShowHistory(false);
  };

  const restoreRoomHistory = (item: RoomHistoryItem) => {
    setRoomDescription(item.roomDescription);
    setResult({ 
      recommendations: item.recommendations,
      image: item.previewImage
    });
    setShowHistory(false);
  };

  // 自动滚动到底部
  useEffect(() => {
    if (isStreaming && resultRef.current) {
      resultRef.current.scrollTop = resultRef.current.scrollHeight;
    }
  }, [streamingText, isStreaming]);

  // Handle image upload
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('请上传图片文件');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError('图片大小不能超过10MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const imageData = e.target?.result as string;
      setUploadedImage(imageData);
      setUploadedFileName(file.name);
      setError(null);
    };
    reader.onerror = () => {
      setError('图片读取失败，请重试');
    };
    reader.readAsDataURL(file);
  };

  const clearUploadedImage = () => {
    setUploadedImage(null);
    setUploadedFileName('');
  };

  const handleSelectRecommendation = (index: number, patternName: string) => {
    setSelectedRecommendation({ index, patternName });
  };

  const handle3DPreview = () => {
    if (selectedRecommendation) {
      setShow3DPreview(true);
      alert(`3D预览功能：${selectedRecommendation.patternName}\n\n此功能将在完整版本中实现。`);
      setShow3DPreview(false);
    }
  };

  // Handle Pattern Explanation with streaming
  const handlePatternExplanation = async () => {
    if (!patternName.trim()) return;
    
    setIsLoading(true);
    setIsStreaming(true);
    setStreamingText('');
    setError(null);
    setResult(null);
    
    try {
      const fullText = await deepseekService.generatePatternExplanationStream(
        patternName,
        targetAudience,
        (chunk, done) => {
          if (!done) {
            setStreamingText(prev => prev + chunk);
          }
        }
      );
      
      setResult({ text: fullText });
      addPatternHistoryItem({
        patternName,
        targetAudience,
        result: fullText
      });
    } catch (err) {
      if (err instanceof DeepSeekError) {
        setError(handleDeepSeekError(err));
      } else {
        setError('生成失败，请重试');
      }
    } finally {
      setIsLoading(false);
      setIsStreaming(false);
    }
  };

  // Handle Image Generation
  const handleImageGeneration = async () => {
    if (!imagePatternName.trim()) return;
    
    setIsLoading(true);
    setError(null);
    setResult(null);
    
    try {
      const imageUrl = await doubaoService.generatePatternImage(
        imagePatternName,
        { style: imageStyle }
      );
      setResult({ image: imageUrl });
      addImageHistoryItem({
        patternName: imagePatternName,
        style: imageStyle,
        imageUrl
      });
    } catch (err) {
      if (err instanceof DoubaoError) {
        setError(handleDoubaoError(err));
      } else {
        setError('图像生成失败，请重试');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Room Analysis with streaming
  const handleRoomAnalysis = async () => {
    if (!roomDescription.trim()) return;
    
    setIsLoading(true);
    setIsStreaming(true);
    setStreamingText('');
    setError(null);
    setResult(null);
    
    try {
      const analysisResult = await deepseekService.analyzeRoomAndRecommendStream(
        roomDescription,
        (chunk, done) => {
          if (!done) {
            setStreamingText(prev => prev + chunk);
          }
        }
      );
      
      let imageUrl: string | undefined;
      if (analysisResult.recommendations.length > 0) {
        try {
          imageUrl = await doubaoService.generatePatternImage(
            analysisResult.recommendations[0].patternName,
            { style: 'modern' }
          );
        } catch (imgErr) {
          console.warn('Failed to generate preview image:', imgErr);
        }
      }
      
      setResult({
        recommendations: analysisResult.recommendations,
        image: imageUrl
      });
      
      addRoomHistoryItem({
        roomDescription,
        recommendations: analysisResult.recommendations,
        previewImage: imageUrl
      });
    } catch (err) {
      if (err instanceof DeepSeekError) {
        setError(handleDeepSeekError(err));
      } else {
        setError('房间分析失败，请重试');
      }
    } finally {
      setIsLoading(false);
      setIsStreaming(false);
    }
  };

  // Error handlers
  const handleDeepSeekError = (error: DeepSeekError): string => {
    switch (error.code) {
      case 'RATE_LIMIT': return '请求过于频繁，请稍后再试';
      case 'INVALID_KEY': return 'API密钥无效，请联系管理员';
      case 'TIMEOUT': return '请求超时，请重试';
      case 'SERVER_ERROR': return '服务暂时不可用，请稍后再试';
      default: return '未知错误，请联系技术支持';
    }
  };

  const handleDoubaoError = (error: DoubaoError): string => {
    switch (error.code) {
      case 'CONTENT_FILTER': return '内容不符合生成规范，请调整输入';
      case 'INVALID_PROMPT': return 'Prompt格式错误，请重新输入';
      case 'QUOTA_EXCEEDED': return '今日生成次数已达上限，请明天再试';
      case 'GENERATION_FAILED': return '图像生成失败，请重试或更换描述';
      default: return '图像生成服务异常';
    }
  };

  const handleRetry = () => {
    setError(null);
    setResult(null);
    switch (activeMode) {
      case 'pattern-explanation': handlePatternExplanation(); break;
      case 'image-generation': handleImageGeneration(); break;
      case 'room-analysis': handleRoomAnalysis(); break;
    }
  };

  // 获取当前模式的历史记录
  const getCurrentHistory = () => {
    switch (activeMode) {
      case 'pattern-explanation': return patternHistory;
      case 'image-generation': return imageHistory;
      case 'room-analysis': return roomHistory;
    }
  };

  // 格式化时间
  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleString('zh-CN', { 
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  // 渲染历史记录面板
  const renderHistoryPanel = () => {
    const history = getCurrentHistory();
    if (history.length === 0) {
      return (
        <div className="text-center text-slate-400 py-8">
          <History size={32} className="mx-auto mb-2 opacity-30" />
          <p>暂无历史记录</p>
        </div>
      );
    }

    return (
      <div className="space-y-2 max-h-[200px] overflow-y-auto">
        {activeMode === 'pattern-explanation' && patternHistory.map(item => (
          <div key={item.id} className="flex items-center justify-between p-3 bg-white border border-slate-200 hover:border-blue-400 transition-colors">
            <div className="flex-grow cursor-pointer" onClick={() => restorePatternHistory(item)}>
              <p className="font-medium text-slate-800">{item.patternName}</p>
              <p className="text-xs text-slate-500">{item.targetAudience === 'child' ? '儿童版' : '成人版'} · {formatTime(item.timestamp)}</p>
            </div>
            <button onClick={() => deletePatternHistoryItem(item.id)} className="p-2 text-slate-400 hover:text-red-500">
              <Trash2 size={16} />
            </button>
          </div>
        ))}
        {activeMode === 'image-generation' && imageHistory.map(item => (
          <div key={item.id} className="flex items-center justify-between p-3 bg-white border border-slate-200 hover:border-blue-400 transition-colors">
            <div className="flex items-center gap-3 flex-grow cursor-pointer" onClick={() => restoreImageHistory(item)}>
              <img src={item.imageUrl} alt={item.patternName} className="w-12 h-12 object-cover border border-slate-200" />
              <div>
                <p className="font-medium text-slate-800">{item.patternName}</p>
                <p className="text-xs text-slate-500">{item.style === 'modern' ? '现代简约' : '传统工艺'} · {formatTime(item.timestamp)}</p>
              </div>
            </div>
            <button onClick={() => deleteImageHistoryItem(item.id)} className="p-2 text-slate-400 hover:text-red-500">
              <Trash2 size={16} />
            </button>
          </div>
        ))}
        {activeMode === 'room-analysis' && roomHistory.map(item => (
          <div key={item.id} className="flex items-center justify-between p-3 bg-white border border-slate-200 hover:border-blue-400 transition-colors">
            <div className="flex-grow cursor-pointer" onClick={() => restoreRoomHistory(item)}>
              <p className="font-medium text-slate-800 truncate max-w-[200px]">{item.roomDescription}</p>
              <p className="text-xs text-slate-500">{item.recommendations.length}个推荐 · {formatTime(item.timestamp)}</p>
            </div>
            <button onClick={() => deleteRoomHistoryItem(item.id)} className="p-2 text-slate-400 hover:text-red-500">
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>
    );
  };

  return (
    <section id={SectionId.AIGC} className="py-16 sm:py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
        <div className="flex flex-col items-center text-center mb-10 sm:mb-16">
          <span className="text-blue-700 font-bold tracking-widest text-xs uppercase mb-2">AI 双模型工坊</span>
          <h2 className="text-3xl sm:text-4xl text-slate-900 font-bold mb-3 sm:mb-4 font-serif">灵感工坊 · 智能定制</h2>
          <p className="text-slate-600 max-w-2xl text-sm sm:text-base px-2">
            基于DeepSeek-V3文化解读与Doubao-Seedream视觉生成，为您提供专业的蓝印花布定制体验。
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-4 sm:gap-8 min-h-[600px] lg:h-[700px]">
          {/* Sidebar / Mode Selection */}
          <div className="w-full lg:w-1/4 flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0">
            <button 
              onClick={() => { setActiveMode('pattern-explanation'); setError(null); setResult(null); setStreamingText(''); }}
              className={`flex-shrink-0 lg:flex-shrink p-4 sm:p-6 text-left border transition-all duration-300 min-w-[140px] lg:min-w-0 ${
                activeMode === 'pattern-explanation' 
                  ? 'bg-blue-800 text-white border-blue-800' 
                  : 'bg-transparent text-slate-500 border-slate-200 hover:border-slate-400'
              }`}
            >
              <MessageSquare className="mb-2 sm:mb-4" size={20} />
              <h3 className="font-bold text-sm sm:text-lg mb-0.5 sm:mb-1 font-serif">纹样解读</h3>
              <p className="text-xs opacity-70 hidden sm:block">DeepSeek文化解析</p>
            </button>
            
            <button 
              onClick={() => { setActiveMode('image-generation'); setError(null); setResult(null); setStreamingText(''); }}
              className={`flex-shrink-0 lg:flex-shrink p-4 sm:p-6 text-left border transition-all duration-300 min-w-[140px] lg:min-w-0 ${
                activeMode === 'image-generation' 
                  ? 'bg-blue-800 text-white border-blue-800' 
                  : 'bg-transparent text-slate-500 border-slate-200 hover:border-slate-400'
              }`}
            >
              <ImageIcon className="mb-2 sm:mb-4" size={20} />
              <h3 className="font-bold text-sm sm:text-lg mb-0.5 sm:mb-1 font-serif">效果图生成</h3>
              <p className="text-xs opacity-70 hidden sm:block">Doubao视觉创作</p>
            </button>
            
            <button 
              onClick={() => { setActiveMode('room-analysis'); setError(null); setResult(null); setStreamingText(''); }}
              className={`flex-shrink-0 lg:flex-shrink p-4 sm:p-6 text-left border transition-all duration-300 min-w-[140px] lg:min-w-0 ${
                activeMode === 'room-analysis' 
                  ? 'bg-blue-800 text-white border-blue-800' 
                  : 'bg-transparent text-slate-500 border-slate-200 hover:border-slate-400'
              }`}
            >
              <Home className="mb-2 sm:mb-4" size={20} />
              <h3 className="font-bold text-sm sm:text-lg mb-0.5 sm:mb-1 font-serif">房间分析</h3>
              <p className="text-xs opacity-70 hidden sm:block">双模型智能推荐</p>
            </button>
          </div>

          {/* Content Area */}
          <div className="w-full lg:w-3/4 bg-slate-50 border border-slate-200 p-4 sm:p-8 relative flex flex-col overflow-hidden flex-1">
            {/* History Toggle Button */}
            <div className="absolute top-2 sm:top-4 right-2 sm:right-4 z-10">
              <button
                onClick={() => setShowHistory(!showHistory)}
                className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 bg-white border border-slate-200 hover:border-blue-400 text-slate-600 hover:text-blue-800 transition-colors text-xs sm:text-sm"
              >
                <History size={14} />
                <span className="hidden sm:inline">历史记录</span>
                {showHistory ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>
            </div>

            {/* History Panel */}
            {showHistory && (
              <div className="mb-4 p-4 bg-slate-100 border border-slate-200 flex-shrink-0">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-bold text-slate-700">历史记录</h4>
                  {getCurrentHistory().length > 0 && (
                    <button onClick={clearCurrentHistory} className="text-xs text-red-500 hover:text-red-700">
                      清空全部
                    </button>
                  )}
                </div>
                {renderHistoryPanel()}
              </div>
            )}
            
            {/* Pattern Explanation Mode */}
            {activeMode === 'pattern-explanation' && (
              <div className="flex-1 flex flex-col overflow-hidden">
                <div className="mb-4 flex-shrink-0">
                  <label className="block text-sm font-bold text-slate-700 mb-2">输入纹样名称</label>
                  <div className="flex gap-2 mb-4">
                    <input 
                      type="text" 
                      value={patternName}
                      onChange={(e) => setPatternName(e.target.value)}
                      placeholder="例如：五福捧寿、松鹤长春..." 
                      className="flex-grow bg-white border border-slate-300 p-3 focus:outline-none focus:border-blue-800 text-slate-800"
                      onKeyPress={(e) => e.key === 'Enter' && handlePatternExplanation()}
                    />
                    <button 
                      onClick={handlePatternExplanation}
                      disabled={isLoading || !patternName.trim()}
                      className="bg-blue-800 text-white px-6 py-3 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
                    >
                      {isLoading ? <Loader2 className="animate-spin" size={20} /> : <Sparkles size={20} />}
                    </button>
                  </div>
                  
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 text-sm text-slate-600">
                      <input type="radio" name="audience" value="adult" checked={targetAudience === 'adult'} onChange={(e) => setTargetAudience(e.target.value as 'adult')} className="text-blue-800" />
                      成人版
                    </label>
                    <label className="flex items-center gap-2 text-sm text-slate-600">
                      <input type="radio" name="audience" value="child" checked={targetAudience === 'child'} onChange={(e) => setTargetAudience(e.target.value as 'child')} className="text-blue-800" />
                      儿童版
                    </label>
                  </div>
                </div>

                <div ref={resultRef} className="flex-1 bg-white border border-slate-200 p-6 overflow-y-auto min-h-0">
                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 p-4 mb-4 flex items-center justify-between">
                      <span>{error}</span>
                      <button onClick={handleRetry} className="text-sm underline hover:text-red-900">重试</button>
                    </div>
                  )}
                  
                  {(result?.text || isStreaming) ? (
                    <div className="prose prose-slate max-w-none animate-fade-in">
                      <h4 className="text-blue-800 font-bold uppercase tracking-wider text-xs mb-4">
                        文化解读 · {targetAudience === 'child' ? '儿童版' : '成人版'}
                      </h4>
                      <div 
                        className="font-serif text-lg leading-relaxed text-slate-800"
                        dangerouslySetInnerHTML={{ 
                          __html: (isStreaming ? streamingText : result?.text || '') + 
                            (isStreaming ? '<span class="inline-block w-2 h-5 bg-blue-800 animate-pulse ml-1"></span>' : '')
                        }}
                      />
                    </div>
                  ) : !isLoading && (
                    <div className="h-full flex flex-col items-center justify-center text-slate-400">
                      <MessageSquare size={32} className="mb-4 opacity-20" />
                      <p>输入纹样名称，获取文化解读</p>
                    </div>
                  )}
                  
                  {isLoading && !isStreaming && (
                    <div className="h-full flex flex-col items-center justify-center">
                      <Loader2 className="animate-spin text-blue-800 mb-4" size={48} />
                      <p className="text-slate-600">DeepSeek正在生成文化解读...</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Image Generation Mode */}
            {activeMode === 'image-generation' && (
              <div className="flex-1 flex flex-col overflow-hidden">
                <div className="mb-4 flex-shrink-0">
                  <label className="block text-sm font-bold text-slate-700 mb-2">输入纹样名称</label>
                  <div className="flex gap-2 mb-4">
                    <input 
                      type="text" 
                      value={imagePatternName}
                      onChange={(e) => setImagePatternName(e.target.value)}
                      placeholder="例如：五福捧寿、松鹤长春..." 
                      className="flex-grow bg-white border border-slate-300 p-3 focus:outline-none focus:border-blue-800 text-slate-800"
                      onKeyPress={(e) => e.key === 'Enter' && handleImageGeneration()}
                    />
                    <button 
                      onClick={handleImageGeneration}
                      disabled={isLoading || !imagePatternName.trim()}
                      className="bg-blue-800 text-white px-6 py-3 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
                    >
                      {isLoading ? <Loader2 className="animate-spin" size={20} /> : <ImageIcon size={20} />}
                    </button>
                  </div>
                  
                  <div className="flex gap-4 mb-4">
                    <label className="flex items-center gap-2 text-sm text-slate-600">
                      <input type="radio" name="style" value="traditional" checked={imageStyle === 'traditional'} onChange={(e) => setImageStyle(e.target.value as 'traditional')} className="text-blue-800" />
                      传统工艺
                    </label>
                    <label className="flex items-center gap-2 text-sm text-slate-600">
                      <input type="radio" name="style" value="modern" checked={imageStyle === 'modern'} onChange={(e) => setImageStyle(e.target.value as 'modern')} className="text-blue-800" />
                      现代简约
                    </label>
                  </div>
                  
                  {/* Sketch Upload */}
                  <div className="border-t border-slate-200 pt-4">
                    <label className="block text-sm font-bold text-slate-700 mb-2">或上传设计草图（可选）</label>
                    <div className="flex gap-2 items-center">
                      <label className="flex-grow cursor-pointer">
                        <div className="bg-white border border-slate-300 p-3 hover:border-blue-800 transition-colors flex items-center gap-2">
                          <Upload size={20} className="text-slate-400" />
                          <span className="text-slate-600 text-sm">{uploadedFileName || '点击上传草图（支持JPG、PNG，最大10MB）'}</span>
                        </div>
                        <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                      </label>
                      {uploadedImage && (
                        <button onClick={clearUploadedImage} className="px-4 py-3 bg-slate-200 hover:bg-slate-300 text-slate-700 text-sm">清除</button>
                      )}
                    </div>
                    {uploadedImage && (
                      <div className="mt-4">
                        <img src={uploadedImage} alt="上传的草图" className="max-h-[150px] object-contain border-2 border-slate-200" />
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex-1 bg-white border border-slate-200 border-dashed flex items-center justify-center relative overflow-hidden min-h-0">
                  {error && (
                    <div className="absolute top-4 left-4 right-4 bg-red-50 border border-red-200 text-red-700 p-4 flex items-center justify-between z-10">
                      <span>{error}</span>
                      <button onClick={handleRetry} className="text-sm underline hover:text-red-900">重试</button>
                    </div>
                  )}
                  
                  {result?.image ? (
                    <div className="w-full h-full p-4 flex flex-col items-center justify-center animate-fade-in">
                      <img src={result.image} alt="生成的效果图" className="max-h-[400px] object-contain shadow-lg border-4 border-slate-100" />
                      <p className="mt-4 text-sm text-slate-600">纹样：{imagePatternName} · 风格：{imageStyle === 'traditional' ? '传统工艺' : '现代简约'}</p>
                    </div>
                  ) : !isLoading && (
                    <div className="text-center text-slate-400">
                      <div className="w-16 h-16 bg-slate-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                        <ImageIcon size={24} className="text-slate-300" />
                      </div>
                      <p>AI 效果图将在此呈现</p>
                    </div>
                  )}
                  
                  {isLoading && (
                    <div className="flex flex-col items-center justify-center">
                      <Loader2 className="animate-spin text-blue-800 mb-4" size={48} />
                      <p className="text-slate-600">Doubao正在生成效果图...</p>
                      <p className="text-xs text-slate-400 mt-2">这可能需要10-15秒</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Room Analysis Mode */}
            {activeMode === 'room-analysis' && (
              <div className="flex-1 flex flex-col overflow-hidden">
                <div className="mb-4 flex-shrink-0">
                  <label className="block text-sm font-bold text-slate-700 mb-2">描述您的房间</label>
                  <div className="flex gap-2 mb-4">
                    <textarea 
                      value={roomDescription}
                      onChange={(e) => setRoomDescription(e.target.value)}
                      placeholder="例如：我有一个灰色调的极简客厅，面积约30平米，采光良好..." 
                      className="flex-grow bg-white border border-slate-300 p-3 focus:outline-none focus:border-blue-800 text-slate-800 min-h-[100px] resize-none"
                    />
                  </div>
                  
                  {/* Room Photo Upload */}
                  <div className="border-t border-slate-200 pt-4 mb-4">
                    <label className="block text-sm font-bold text-slate-700 mb-2">或上传房间照片（可选）</label>
                    <div className="flex gap-2 items-center">
                      <label className="flex-grow cursor-pointer">
                        <div className="bg-white border border-slate-300 p-3 hover:border-blue-800 transition-colors flex items-center gap-2">
                          <Upload size={20} className="text-slate-400" />
                          <span className="text-slate-600 text-sm">{uploadedFileName || '点击上传房间照片（支持JPG、PNG，最大10MB）'}</span>
                        </div>
                        <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                      </label>
                      {uploadedImage && (
                        <button onClick={clearUploadedImage} className="px-4 py-3 bg-slate-200 hover:bg-slate-300 text-slate-700 text-sm">清除</button>
                      )}
                    </div>
                    {uploadedImage && (
                      <div className="mt-4">
                        <img src={uploadedImage} alt="上传的房间照片" className="max-h-[150px] object-contain border-2 border-slate-200" />
                      </div>
                    )}
                  </div>
                  
                  <button 
                    onClick={handleRoomAnalysis}
                    disabled={isLoading || !roomDescription.trim()}
                    className="w-full bg-blue-800 text-white px-6 py-3 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <><Loader2 className="animate-spin" size={20} /><span>分析中...</span></>
                    ) : (
                      <><Home size={20} /><span>开始分析</span></>
                    )}
                  </button>
                </div>

                <div ref={resultRef} className="flex-1 bg-white p-6 border border-slate-200 overflow-y-auto min-h-0">
                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 p-4 mb-4 flex items-center justify-between">
                      <span>{error}</span>
                      <button onClick={handleRetry} className="text-sm underline hover:text-red-900">重试</button>
                    </div>
                  )}
                  
                  {/* Streaming output for room analysis */}
                  {isStreaming && (
                    <div className="animate-fade-in mb-4">
                      <h4 className="text-blue-800 font-bold uppercase tracking-wider text-xs mb-4">AI 分析中...</h4>
                      <div className="font-serif text-sm leading-relaxed text-slate-600 whitespace-pre-wrap bg-slate-50 p-4 border border-slate-200">
                        {streamingText}
                        <span className="inline-block w-2 h-4 bg-blue-800 animate-pulse ml-1" />
                      </div>
                    </div>
                  )}
                  
                  {result?.recommendations ? (
                    <div className="animate-fade-in">
                      <h4 className="text-blue-800 font-bold uppercase tracking-wider text-xs mb-6">AI 推荐方案 ({result.recommendations.length}个)</h4>
                      
                      {result.image && (
                        <div className="mb-6">
                          <img src={result.image} alt="推荐效果预览" className="w-full max-h-[200px] object-cover border-2 border-slate-200" />
                          <p className="text-xs text-slate-500 mt-2">首选方案效果预览</p>
                        </div>
                      )}
                      
                      <div className="space-y-4">
                        {result.recommendations.map((rec, index) => (
                          <div 
                            key={index} 
                            className={`border-l-4 pl-4 py-3 cursor-pointer transition-all ${
                              selectedRecommendation?.index === index
                                ? 'border-blue-800 bg-blue-50'
                                : 'border-slate-300 hover:border-blue-400 hover:bg-slate-50'
                            }`}
                            onClick={() => handleSelectRecommendation(index, rec.patternName)}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-grow">
                                <h5 className="font-bold text-lg text-slate-900 mb-2">方案 {index + 1}：{rec.patternName}</h5>
                                <p className="text-sm text-slate-600 mb-2"><span className="font-semibold">布局建议：</span>{rec.layout}</p>
                                <p className="text-sm text-slate-700"><span className="font-semibold">推荐理由：</span>{rec.reason}</p>
                              </div>
                              {selectedRecommendation?.index === index && (
                                <div className="ml-4">
                                  <span className="inline-block bg-blue-800 text-white text-xs px-2 py-1 rounded">已选择</span>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      {selectedRecommendation && (
                        <div className="mt-6 pt-6 border-t border-slate-200">
                          <button
                            onClick={handle3DPreview}
                            disabled={show3DPreview}
                            className="w-full bg-blue-800 text-white px-6 py-3 hover:bg-blue-700 disabled:bg-slate-400 transition-colors flex items-center justify-center gap-2"
                          >
                            {show3DPreview ? (
                              <><Loader2 className="animate-spin" size={20} /><span>加载3D预览...</span></>
                            ) : (
                              <><Sparkles size={20} /><span>查看3D预览效果</span></>
                            )}
                          </button>
                          <p className="text-xs text-slate-500 text-center mt-2">预览 "{selectedRecommendation.patternName}" 在您空间中的效果</p>
                        </div>
                      )}
                    </div>
                  ) : !isLoading && !isStreaming && (
                    <div className="h-full flex flex-col items-center justify-center text-slate-400">
                      <Home size={32} className="mb-4 opacity-20" />
                      <p>描述您的空间，获取定制化推荐</p>
                    </div>
                  )}
                  
                  {isLoading && !isStreaming && (
                    <div className="h-full flex flex-col items-center justify-center">
                      <Loader2 className="animate-spin text-blue-800 mb-4" size={48} />
                      <p className="text-slate-600">AI正在分析您的空间...</p>
                      <p className="text-xs text-slate-400 mt-2">DeepSeek + Doubao 双模型协同工作</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AIGenerator;
