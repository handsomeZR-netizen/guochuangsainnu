/**
 * Doubao Service
 * 使用Doubao-Seedream模型进行图像生成
 */

// 错误类定义
export class DoubaoError extends Error {
  constructor(
    public code: 'CONTENT_FILTER' | 'INVALID_PROMPT' | 'QUOTA_EXCEEDED' | 'GENERATION_FAILED',
    message: string
  ) {
    super(message);
    this.name = 'DoubaoError';
  }
}

// 图像生成选项接口
export interface ImageGenerationOptions {
  size?: '1K' | '2K' | '4K';
  style?: 'traditional' | 'modern';
  referenceImage?: string;
}

export class DoubaoService {
  private apiKey: string;
  private baseURL: string = 'https://ark.cn-beijing.volces.com/api/v3';

  constructor(apiKey?: string) {
    // Vite 环境变量需要使用 import.meta.env.VITE_* 格式
    this.apiKey = apiKey || (typeof import.meta !== 'undefined' ? import.meta.env?.VITE_ARK_API_KEY : '') || '';
    if (!this.apiKey) {
      console.warn('Doubao API key not configured. Please set VITE_ARK_API_KEY in .env file.');
    }
  }

  /**
   * 生成蓝印花布纹样效果图
   * @param patternName 纹样名称
   * @param options 生成选项
   * @returns 图像URL
   */
  async generatePatternImage(
    patternName: string,
    options: ImageGenerationOptions = {}
  ): Promise<string> {
    if (!this.apiKey) {
      throw new DoubaoError('INVALID_PROMPT', 'API密钥未配置');
    }

    const prompt = this.buildPrompt(patternName, options);

    try {
      const response = await fetch(`${this.baseURL}/images/generations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: 'doubao-seedream-4-5-251128',
          prompt: prompt,
          size: options.size || '2K',
          response_format: 'url',
          watermark: true,
          sequential_image_generation: 'disabled',
          stream: false
        })
      });

      if (!response.ok) {
        if (response.status === 400) {
          throw new DoubaoError('INVALID_PROMPT', 'Prompt格式错误');
        } else if (response.status === 429) {
          throw new DoubaoError('QUOTA_EXCEEDED', '今日生成次数已达上限');
        } else if (response.status === 451) {
          throw new DoubaoError('CONTENT_FILTER', '内容不符合生成规范');
        }
        throw new DoubaoError('GENERATION_FAILED', `HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (!data.data || !data.data[0] || !data.data[0].url) {
        throw new DoubaoError('GENERATION_FAILED', '图像生成失败，响应格式错误');
      }

      return data.data[0].url;
    } catch (error) {
      if (error instanceof DoubaoError) {
        throw error;
      }
      console.error('Doubao API Error:', error);
      throw new DoubaoError('GENERATION_FAILED', '图像生成服务异常');
    }
  }

  /**
   * 构建专业的Prompt
   * @param patternName 纹样名称
   * @param options 生成选项
   * @returns 完整的Prompt字符串
   */
  buildPrompt(
    patternName: string,
    options: ImageGenerationOptions = {}
  ): string {
    const baseElements = [
      '南通蓝印花布 (Nantong Blue Calico)',
      '刮浆印染纹理 (Scraping Paste Dyeing Texture)',
      '植物靛蓝 Natural Indigo',
      '冰裂纹 (Ice Crack Pattern)',
      '手工质感 (Handmade Texture)',
      '宣纸底纹 (Rice Paper Background)'
    ];

    const patternDescription = `传统吉祥纹样：${patternName}`;

    const styleModifiers = [
      '高精度细节',
      '柔和光影',
      '东方美学',
      '留白艺术',
      options.style === 'modern' ? '现代简约' : '传统工艺'
    ];

    return [
      ...baseElements,
      patternDescription,
      ...styleModifiers
    ].join(', ');
  }

  /**
   * 预览染色效果
   * @param userSketchUrl 用户草图URL
   * @param patternName 纹样名称
   * @returns 染色效果图URL
   */
  async previewDyeingEffect(
    userSketchUrl: string,
    patternName: string
  ): Promise<string> {
    // 注意：当前API可能不支持图生图功能
    // 这里使用文本描述来模拟效果
    const prompt = `
      将用户草图转换为南通蓝印花布风格，
      应用${patternName}纹样，
      保持靛蓝色调和刮浆印染质感，
      参考图像风格：${userSketchUrl}
    `;

    // 使用增强的prompt生成图像
    const enhancedOptions: ImageGenerationOptions = {
      style: 'traditional',
      referenceImage: userSketchUrl
    };

    return this.generatePatternImage(patternName, enhancedOptions);
  }
}

// 导出单例实例
export const doubaoService = new DoubaoService();
