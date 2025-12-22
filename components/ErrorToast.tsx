import React, { useEffect, useState } from 'react';
import { DeepSeekError } from '../services/deepseekService';
import { DoubaoError } from '../services/doubaoService';

export interface ErrorToastProps {
  error: Error | DeepSeekError | DoubaoError | null;
  onRetry?: () => void;
  onDismiss?: () => void;
  autoHideDuration?: number;
}

/**
 * 用户友好的错误提示组件
 */
export const ErrorToast: React.FC<ErrorToastProps> = ({
  error,
  onRetry,
  onDismiss,
  autoHideDuration = 5000
}) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (error) {
      setVisible(true);
      
      if (autoHideDuration > 0) {
        const timer = setTimeout(() => {
          setVisible(false);
          onDismiss?.();
        }, autoHideDuration);
        
        return () => clearTimeout(timer);
      }
    } else {
      setVisible(false);
    }
  }, [error, autoHideDuration, onDismiss]);

  if (!visible || !error) {
    return null;
  }

  const errorMessage = getErrorMessage(error);
  const showRetry = isRetryable(error);

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-md animate-slide-up">
      <div className="bg-red-50 border-l-4 border-red-500 rounded-lg shadow-lg p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg
              className="h-5 w-5 text-red-500"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3 flex-1">
            <p className="text-sm font-medium text-red-800">
              {errorMessage}
            </p>
          </div>
          <div className="ml-4 flex-shrink-0 flex space-x-2">
            {showRetry && onRetry && (
              <button
                onClick={() => {
                  setVisible(false);
                  onRetry();
                }}
                className="inline-flex text-sm font-medium text-red-600 hover:text-red-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                重试
              </button>
            )}
            <button
              onClick={() => {
                setVisible(false);
                onDismiss?.();
              }}
              className="inline-flex text-red-400 hover:text-red-500 focus:outline-none"
            >
              <span className="sr-only">关闭</span>
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * 获取用户友好的错误消息
 */
function getErrorMessage(error: Error | DeepSeekError | DoubaoError): string {
  if (error instanceof DeepSeekError) {
    switch (error.code) {
      case 'RATE_LIMIT':
        return '请求过于频繁，请稍后再试';
      case 'INVALID_KEY':
        return 'API密钥无效，请联系管理员';
      case 'TIMEOUT':
        return '请求超时，请重试';
      case 'SERVER_ERROR':
        return '服务暂时不可用，请稍后再试';
      default:
        return '未知错误，请联系技术支持';
    }
  }

  if (error instanceof DoubaoError) {
    switch (error.code) {
      case 'CONTENT_FILTER':
        return '内容不符合生成规范，请调整输入';
      case 'INVALID_PROMPT':
        return 'Prompt格式错误，请重新输入';
      case 'QUOTA_EXCEEDED':
        return '今日生成次数已达上限，请明天再试';
      case 'GENERATION_FAILED':
        return '图像生成失败，请重试或更换描述';
      default:
        return '图像生成服务异常';
    }
  }

  return error.message || '发生未知错误';
}

/**
 * 判断错误是否可重试
 */
function isRetryable(error: Error | DeepSeekError | DoubaoError): boolean {
  if (error instanceof DeepSeekError) {
    return error.retryable;
  }

  if (error instanceof DoubaoError) {
    return error.code !== 'INVALID_PROMPT' && error.code !== 'QUOTA_EXCEEDED';
  }

  return true;
}
