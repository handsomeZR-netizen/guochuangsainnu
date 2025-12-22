import { GoogleGenAI } from "@google/genai";

// Ensure API key is available
const API_KEY = process.env.API_KEY || '';

const ai = new GoogleGenAI({ apiKey: API_KEY });

/**
 * Generates an "Ink Style" description and potentially an image representation
 * based on user input.
 */
export const generateInkArt = async (prompt: string): Promise<{ text: string; imageBase64?: string }> => {
  if (!API_KEY) {
    return { text: "API Key is missing. Please configure the environment." };
  }

  try {
    // Modified prompt for Blue/White ink style (青花/水墨)
    const enhancedPrompt = `Create a traditional Chinese ink wash painting (Sumi-e) style image based on this concept: "${prompt}". 
    Style: Minimalist, distinct "Blue and White Porcelain" (青花瓷) color palette (Deep Cobalt Blue and White). 
    High artistic value, negative space (liubai).`;
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          { text: enhancedPrompt }
        ]
      }
    });

    let generatedText = "水墨画生成成功。"; // Default Chinese text
    let generatedImage: string | undefined = undefined;

    // Check parts for image or text
    if (response.candidates && response.candidates[0].content.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          generatedImage = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
        } else if (part.text) {
          generatedText = part.text;
        }
      }
    }

    if (!generatedImage) {
        return { text: "墨汁已干（生成失败，可能是配额不足或模型正忙），请稍后再试。" };
    }

    return { text: "您的专属水墨青花画作已生成。", imageBase64: generatedImage };

  } catch (error) {
    console.error("Gemini GenAI Error:", error);
    return { text: "系统繁忙，请检查网络或API配置。" };
  }
};

/**
 * AI Recommendation for product pairing
 */
export const getAiRecommendation = async (userQuery: string): Promise<string> => {
  if (!API_KEY) return "系统离线，请检查 API Key。";

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `你是一位精通东方美学和室内设计的资深策展人。
      用户正在询问："${userQuery}"。
      请推荐 1-2 种适合的中国传统工艺品（如瓷器、苏绣、书法、砚台等）。
      请用中文回答，语气优雅、专业，带有文学色彩，类似高端画廊的介绍。字数控制在 100 字以内。`,
    });
    
    return response.text || "我们的策展人暂时无法回应，请稍后再试。";
  } catch (error) {
    console.error("Gemini Recommendation Error:", error);
    return "暂时无法获取推荐建议。";
  }
};