/**
 * DeepSeek Service
 * 使用DeepSeek-V3模型进行文化解读、文案生成和逻辑推理
 * 支持流式输出
 */

// 错误类定义
export class DeepSeekError extends Error {
  constructor(
    public code: 'RATE_LIMIT' | 'INVALID_KEY' | 'TIMEOUT' | 'SERVER_ERROR',
    message: string,
    public retryable: boolean = false
  ) {
    super(message);
    this.name = 'DeepSeekError';
  }
}

// 推荐结果接口
export interface RecommendationResult {
  recommendations: Array<{
    patternName: string;
    layout: string;
    reason: string;
  }>;
}

// 产品接口
export interface Product {
  name: string;
  description?: string;
  scenario?: string;
}

// 流式回调类型
export type StreamCallback = (chunk: string, done: boolean) => void;

export class DeepSeekService {
  private apiKey: string;
  private baseURL: string = 'https://ark.cn-beijing.volces.com/api/v3';
  private maxRetries: number = 3;

  constructor(apiKey?: string) {
    this.apiKey = apiKey || (typeof import.meta !== 'undefined' ? import.meta.env?.VITE_ARK_API_KEY : '') || '';
    if (!this.apiKey) {
      console.warn('DeepSeek API key not configured. Please set VITE_ARK_API_KEY in .env file.');
    }
  }

  /**
   * 生成纹样文化解读（流式输出）
   */
  async generatePatternExplanationStream(
    patternName: string,
    targetAudience: 'adult' | 'child' = 'adult',
    onChunk: StreamCallback
  ): Promise<string> {
    const systemPrompt = targetAudience === 'child'
      ? '你是一位善于给儿童讲故事的非遗传承人，用简单生动的语言解释传统纹样。回答要简洁，控制在150字以内，使用HTML格式输出，包含<h3>标题、<p>段落、<strong>重点。'
      : '你是南通蓝印花布的文化专家，深入解读纹样的历史渊源和文化寓意。回答要简洁精炼，控制在200字以内，使用HTML格式输出，包含<h3>标题、<p>段落、<strong>重点、<ul><li>列表。';

    const userPrompt = `请简洁解释南通蓝印花布中"${patternName}"纹样的文化含义、历史背景和吉祥寓意。直接输出HTML内容，不要markdown代码块。`;

    return this.callAPIStream(systemPrompt, userPrompt, onChunk);
  }

  /**
   * 生成纹样文化解读（非流式，保留兼容性）
   */
  async generatePatternExplanation(
    patternName: string,
    targetAudience: 'adult' | 'child' = 'adult'
  ): Promise<string> {
    const systemPrompt = targetAudience === 'child'
      ? '你是一位善于给儿童讲故事的非遗传承人，用简单生动的语言解释传统纹样。回答要简洁，控制在150字以内，使用HTML格式输出，包含<h3>标题、<p>段落、<strong>重点。'
      : '你是南通蓝印花布的文化专家，深入解读纹样的历史渊源和文化寓意。回答要简洁精炼，控制在200字以内，使用HTML格式输出，包含<h3>标题、<p>段落、<strong>重点、<ul><li>列表。';

    const userPrompt = `请简洁解释南通蓝印花布中"${patternName}"纹样的文化含义、历史背景和吉祥寓意。直接输出HTML内容，不要markdown代码块。`;

    return this.callAPI(systemPrompt, userPrompt);
  }

  /**
   * 生成营销文案
   */
  async generateMarketingCopy(
    product: Product,
    market: 'domestic' | 'overseas'
  ): Promise<string> {
    const context = market === 'overseas'
      ? '目标客户是海外华人，强调乡愁和文化连接'
      : '目标客户是国内中产家庭，强调健康和教育价值';

    const prompt = `为以下产品生成营销文案：${product.name}。${context}`;

    return this.callAPI('你是专业的文化产品营销专家', prompt);
  }

  /**
   * 分析房间照片并推荐搭配（流式输出）
   */
  async analyzeRoomAndRecommendStream(
    roomDescription: string,
    onChunk: StreamCallback
  ): Promise<RecommendationResult> {
    const prompt = `
      用户房间描述：${roomDescription}
      
      请简洁分析并推荐3种适合的南通蓝印花布软装方案。
      每个方案的理由控制在50字以内，布局建议控制在30字以内。
      
      直接返回JSON格式，不要其他说明：
      {
        "recommendations": [
          {
            "patternName": "纹样名称",
            "layout": "布局建议（30字内）",
            "reason": "理由说明（50字内）"
          }
        ]
      }
    `;

    const response = await this.callAPIStream(
      '你是室内设计专家，擅长中式美学搭配。回答要简洁精炼。',
      prompt,
      onChunk
    );

    return this.parseRecommendation(response);
  }

  /**
   * 分析房间照片并推荐搭配（非流式）
   */
  async analyzeRoomAndRecommend(
    roomDescription: string
  ): Promise<RecommendationResult> {
    const prompt = `
      用户房间描述：${roomDescription}
      
      请简洁分析并推荐3种适合的南通蓝印花布软装方案。
      每个方案的理由控制在50字以内，布局建议控制在30字以内。
      
      直接返回JSON格式，不要其他说明：
      {
        "recommendations": [
          {
            "patternName": "纹样名称",
            "layout": "布局建议（30字内）",
            "reason": "理由说明（50字内）"
          }
        ]
      }
    `;

    const response = await this.callAPI(
      '你是室内设计专家，擅长中式美学搭配。回答要简洁精炼。',
      prompt
    );

    return this.parseRecommendation(response);
  }

  /**
   * 流式调用DeepSeek API
   */
  private async callAPIStream(
    systemContent: string,
    userContent: string,
    onChunk: StreamCallback
  ): Promise<string> {
    if (!this.apiKey) {
      throw new DeepSeekError('INVALID_KEY', 'API密钥未配置', false);
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 60000); // 60秒超时

      const response = await fetch(`${this.baseURL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: 'deepseek-v3-2-251201',
          messages: [
            { role: 'system', content: systemContent },
            { role: 'user', content: userContent }
          ],
          stream: true
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        if (response.status === 429) {
          throw new DeepSeekError('RATE_LIMIT', '请求过于频繁', true);
        } else if (response.status === 401 || response.status === 403) {
          throw new DeepSeekError('INVALID_KEY', 'API密钥无效', false);
        } else if (response.status >= 500) {
          throw new DeepSeekError('SERVER_ERROR', '服务器错误', true);
        }
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new DeepSeekError('SERVER_ERROR', '无法读取响应流', false);
      }

      const decoder = new TextDecoder();
      let fullContent = '';
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          const trimmedLine = line.trim();
          if (!trimmedLine || trimmedLine === 'data: [DONE]') continue;
          if (!trimmedLine.startsWith('data: ')) continue;

          try {
            const jsonStr = trimmedLine.slice(6);
            const data = JSON.parse(jsonStr);
            const content = data.choices?.[0]?.delta?.content || '';
            if (content) {
              fullContent += content;
              onChunk(content, false);
            }
          } catch (e) {
            // 忽略解析错误，继续处理
          }
        }
      }

      onChunk('', true);
      return fullContent;
    } catch (error) {
      if (error instanceof DeepSeekError) {
        throw error;
      }
      if (error instanceof Error && error.name === 'AbortError') {
        throw new DeepSeekError('TIMEOUT', '请求超时', true);
      }
      throw new DeepSeekError('SERVER_ERROR', '请求失败', false);
    }
  }

  /**
   * 非流式调用DeepSeek API
   */
  private async callAPI(
    systemContent: string,
    userContent: string
  ): Promise<string> {
    if (!this.apiKey) {
      throw new DeepSeekError('INVALID_KEY', 'API密钥未配置', false);
    }

    let lastError: Error | null = null;

    for (let attempt = 0; attempt < this.maxRetries; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000);

        const response = await fetch(`${this.baseURL}/chat/completions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.apiKey}`
          },
          body: JSON.stringify({
            model: 'deepseek-v3-2-251201',
            messages: [
              { role: 'system', content: systemContent },
              { role: 'user', content: userContent }
            ]
          }),
          signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          if (response.status === 429) {
            throw new DeepSeekError('RATE_LIMIT', '请求过于频繁', true);
          } else if (response.status === 401 || response.status === 403) {
            throw new DeepSeekError('INVALID_KEY', 'API密钥无效', false);
          } else if (response.status >= 500) {
            throw new DeepSeekError('SERVER_ERROR', '服务器错误', true);
          }
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        return data.choices?.[0]?.message?.content || '';
      } catch (error) {
        lastError = error as Error;

        if (error instanceof DeepSeekError) {
          if (!error.retryable) {
            throw error;
          }
        }

        if (error instanceof Error && error.name === 'AbortError') {
          lastError = new DeepSeekError('TIMEOUT', '请求超时', true);
        }

        if (attempt < this.maxRetries - 1) {
          await new Promise(resolve =>
            setTimeout(resolve, Math.pow(2, attempt) * 1000)
          );
        }
      }
    }

    throw lastError || new DeepSeekError('SERVER_ERROR', '请求失败', false);
  }

  /**
   * 解析推荐结果
   */
  private parseRecommendation(response: string): RecommendationResult {
    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        if (parsed.recommendations && Array.isArray(parsed.recommendations)) {
          return parsed;
        }
      }

      return {
        recommendations: [
          {
            patternName: '五福捧寿',
            layout: '建议作为主墙装饰',
            reason: response.substring(0, 100)
          }
        ]
      };
    } catch (error) {
      console.error('Failed to parse recommendation:', error);
      return {
        recommendations: [
          {
            patternName: '传统纹样',
            layout: '根据空间布局调整',
            reason: '推荐解析失败，请重试'
          }
        ]
      };
    }
  }
}

// 导出单例实例
export const deepseekService = new DeepSeekService();
