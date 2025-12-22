/**
 * 本地测试 Netlify Function
 * 运行: node test-netlify-function.js
 */

const API_KEY = process.env.VITE_ARK_API_KEY || 'dd4005ed-548b-45bb-93be-e38b072818e5';

async function testDeepSeekAPI() {
  console.log('🧪 测试直接调用火山引擎 DeepSeek API...\n');

  try {
    const response = await fetch('https://ark.cn-beijing.volces.com/api/v3/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: 'deepseek-v3-2-251201',
        messages: [
          { role: 'system', content: '你是一个测试助手' },
          { role: 'user', content: '说"测试成功"' }
        ],
        stream: false
      })
    });

    console.log('📊 响应状态:', response.status, response.statusText);
    console.log('📋 响应头:');
    response.headers.forEach((value, key) => {
      console.log(`  ${key}: ${value}`);
    });

    const data = await response.json();
    console.log('\n📦 响应体:', JSON.stringify(data, null, 2));

    if (response.ok) {
      console.log('\n✅ 测试成功！API 密钥有效，可以正常调用。');
      return true;
    } else {
      console.log('\n❌ 测试失败！');
      if (data.error) {
        console.log('错误信息:', data.error);
        if (data.error.code) console.log('错误代码:', data.error.code);
        if (data.error.message) console.log('错误详情:', data.error.message);
      }
      return false;
    }
  } catch (error) {
    console.error('\n❌ 请求失败:', error.message);
    return false;
  }
}

async function testStreamAPI() {
  console.log('\n\n🧪 测试流式响应...\n');

  try {
    const response = await fetch('https://ark.cn-beijing.volces.com/api/v3/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: 'deepseek-v3-2-251201',
        messages: [
          { role: 'system', content: '你是一个测试助手' },
          { role: 'user', content: '数到5' }
        ],
        stream: true
      })
    });

    console.log('📊 响应状态:', response.status, response.statusText);

    if (!response.ok) {
      const data = await response.json();
      console.log('❌ 流式请求失败:', data);
      return false;
    }

    console.log('📡 开始接收流式数据...\n');

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    let chunkCount = 0;

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || trimmed === 'data: [DONE]') continue;
        if (!trimmed.startsWith('data: ')) continue;

        try {
          const jsonStr = trimmed.slice(6);
          const data = JSON.parse(jsonStr);
          const content = data.choices?.[0]?.delta?.content || '';
          if (content) {
            process.stdout.write(content);
            chunkCount++;
          }
        } catch (e) {
          // 忽略解析错误
        }
      }
    }

    console.log(`\n\n✅ 流式测试成功！收到 ${chunkCount} 个数据块。`);
    return true;
  } catch (error) {
    console.error('\n❌ 流式请求失败:', error.message);
    return false;
  }
}

// 运行测试
(async () => {
  console.log('🚀 开始测试火山引擎 API\n');
  console.log('=' .repeat(60));

  if (!API_KEY || API_KEY === 'your-api-key-here') {
    console.log('❌ 请先设置 VITE_ARK_API_KEY 环境变量');
    console.log('   方法1: export VITE_ARK_API_KEY=your-key');
    console.log('   方法2: 直接修改脚本中的 API_KEY 变量');
    process.exit(1);
  }

  const test1 = await testDeepSeekAPI();
  const test2 = await testStreamAPI();

  console.log('\n' + '='.repeat(60));
  console.log('\n📊 测试总结:');
  console.log(`  非流式 API: ${test1 ? '✅ 通过' : '❌ 失败'}`);
  console.log(`  流式 API: ${test2 ? '✅ 通过' : '❌ 失败'}`);

  if (test1 && test2) {
    console.log('\n🎉 所有测试通过！可以部署到 Netlify。');
    console.log('\n📝 下一步:');
    console.log('  1. 在 Netlify Dashboard 设置环境变量 VITE_ARK_API_KEY');
    console.log('  2. git push 触发部署');
    console.log('  3. 查看 Netlify Function 日志确认运行状态');
  } else {
    console.log('\n⚠️  部分测试失败，请检查 API 密钥和网络连接。');
  }
})();
