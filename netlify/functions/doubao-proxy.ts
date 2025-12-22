import type { Context } from '@netlify/functions';

export default async (req: Request, context: Context) => {
  // 处理 CORS 预检请求
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Max-Age': '86400'
      }
    });
  }

  // 只允许 POST 请求
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }

  try {
    const body = await req.json();
    const apiKey = Netlify.env.get('VITE_ARK_API_KEY');

    // 详细的环境变量检查和日志
    if (!apiKey) {
      console.error('❌ VITE_ARK_API_KEY not found in environment variables');
      console.log('Available env keys:', Object.keys(Netlify.env.toObject()));
      return new Response(JSON.stringify({ 
        error: 'API key not configured',
        hint: 'Please set VITE_ARK_API_KEY in Netlify environment variables'
      }), {
        status: 500,
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }

    console.log('✅ API Key found, calling Doubao API...');
    console.log('Request body:', JSON.stringify(body, null, 2));

    // 调用火山引擎 Doubao API
    const response = await fetch('https://ark.cn-beijing.volces.com/api/v3/images/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify(body)
    });

    console.log('Doubao API response status:', response.status);

    const data = await response.json();
    
    // 如果火山引擎返回错误，记录详细信息
    if (!response.ok) {
      console.error('❌ Doubao API error:', {
        status: response.status,
        data: data
      });
    }

    return new Response(JSON.stringify(data), {
      status: response.status,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  } catch (error) {
    console.error('❌ Doubao Proxy Error:', error);
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    
    return new Response(JSON.stringify({ 
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error',
      type: error instanceof Error ? error.constructor.name : typeof error
    }), {
      status: 500,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
};
