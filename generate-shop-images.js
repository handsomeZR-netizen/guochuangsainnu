const https = require('https');
const fs = require('fs');
require('dotenv').config();

const API_KEY = process.env.VITE_ARK_API_KEY;

// 所有产品的提示词 - 强调真实感
const products = [
  // 巧手非遗体验系列
  {
    id: 'h1',
    name: '蓝染奇趣盒',
    prompt: '南通蓝印花布传统蓝染手工艺套装礼盒，精美包装盒，内含深靛蓝色染料小瓶、纯白棉布、绑扎工具、蓝白纹样模板，深蓝色与白色对比鲜明，传统靛蓝色调，产品整齐摆放展示，温馨亲子手作氛围，柔和自然光线，纯白色背景，产品摄影，超高清细节，真实质感，商业摄影，8K分辨率，强调蓝白配色'
  },
  {
    id: 'h2',
    name: '趣味拼豆创意盒',
    prompt: '儿童拼豆手工创意套装，透明收纳盒装，内含深蓝色和白色拼豆珠为主、南通蓝印花布纹样模板卡片、镊子、熨烫纸，缠枝莲云纹图案设计，靛蓝色调，蓝白配色，国风元素，产品平铺展示，柔和自然光，纯白色背景，产品摄影，超高清细节，真实质感，商业摄影，8K分辨率'
  },
  {
    id: 'h3',
    name: '3D立体拼图',
    prompt: '江南水乡乌篷船3D立体拼图，木质材料，深靛蓝色与纯白色配色，南通蓝印花布纹样装饰，中国风建筑模型，精密拼装零件整齐排列，包装盒展示，传统蓝白色调，柔和灯光，纯白色背景，产品摄影，超高清细节，真实质感，商业摄影，8K分辨率'
  },
  {
    id: 'h4',
    name: '小小织布匠·扎染体验套装',
    prompt: '儿童迷你织布机套装，木质织布机框架，配套深蓝色纯棉纱线、深靛蓝染料瓶、绑扎绳，南通蓝印花布传统手工艺教学套装，蓝白色调，温馨手作氛围，自然光线，纯白色背景，产品摄影，超高清细节，真实质感，商业摄影，8K分辨率'
  },
  {
    id: 'h5',
    name: '手编团扇包',
    prompt: '手工编织团扇材料包，竹制团扇骨架、编织线材、南通蓝印花布贴片（深靛蓝色与白色纹样）、针线工具，中国传统团扇造型，蓝白配色，精致手工艺品，产品平铺展示，柔和自然光，纯白色背景，产品摄影，超高清细节，真实质感，商业摄影，8K分辨率'
  },

  // 宴席用品系列
  {
    id: 'b1',
    name: '主题桌旗',
    prompt: '南通蓝印花布桌旗，纯棉材质，深靛蓝色底色，白色缠枝莲宝相花吉祥纹样，蓝白对比鲜明，流苏边缘装饰，优雅铺展在实木餐桌上，传统蓝白色调，宴席装饰氛围，柔和灯光，真实场景，产品摄影，超高清细节，真实质感，商业摄影，8K分辨率'
  },
  {
    id: 'b2',
    name: '席位卡与桌号牌',
    prompt: '精致实木席位卡桌号牌，嵌入南通蓝印花布贴片，深靛蓝色底色，白色小团花回纹图案，蓝白配色，中式宴席装饰，优雅摆放展示，柔和灯光，纯白色背景，产品摄影，超高清细节，真实质感，商业摄影，8K分辨率'
  },
  {
    id: 'b3',
    name: '餐具摆盘装饰垫',
    prompt: '圆形南通蓝印花布餐垫，防水棉麻材质，深靛蓝色底色，白色缠枝纹卷草纹图案，蓝白对比，精致餐盘摆放其上，中式餐桌装饰，温馨用餐氛围，自然光线，产品摄影，超高清细节，真实质感，商业摄影，8K分辨率'
  },
  {
    id: 'b4',
    name: '纹样陶瓷餐具系列',
    prompt: '中国传统蓝白陶瓷餐具套装，餐盘汤碗茶杯，釉下彩工艺，深靛蓝色冰裂纹缠枝莲图案，纯白底色，蓝白配色，精致摆放展示，中式餐桌氛围，柔和灯光，纯白色背景，产品摄影，超高清细节，真实质感，商业摄影，8K分辨率'
  },
  {
    id: 'b5',
    name: '伴手礼礼盒',
    prompt: '精美南通蓝印花布包裹礼盒，深靛蓝色底色，白色喜福纹样祥云图案，蓝白配色，内含手帕香包茶杯垫等小物件，中式宴席伴手礼，优雅包装展示，柔和灯光，纯白色背景，产品摄影，超高清细节，真实质感，商业摄影，8K分辨率'
  },

  // 空间装饰系列
  {
    id: 'd1',
    name: '餐桌用品套装',
    prompt: '中国青花瓷餐具套装，纯白瓷底色，深靛蓝色浅绘山水纹理，餐盘茶壶茶杯，釉色清润，器型简约优雅，蓝白配色，中式美学，精致摆放展示，柔和灯光，纯白色背景，产品摄影，超高清细节，真实质感，商业摄影，8K分辨率'
  },
  {
    id: 'd2',
    name: '沙发靠垫',
    prompt: '南通蓝印花布沙发靠垫，纯白底色深靛蓝色荷花纹样，或深靛蓝底色白色纹样，中式禅意设计，方形抱枕，柔软质感，摆放在浅灰色布艺沙发上，蓝白配色，温馨家居氛围，自然光线，产品摄影，超高清细节，真实质感，商业摄影，8K分辨率'
  },
  {
    id: 'd3',
    name: '床品三件套',
    prompt: '南通蓝印花布床品套装，深靛蓝色与白色配色，浅色竹枝纹样，纯棉材质，床单被套枕套，铺展在木质床具上，蓝白色调，清雅国风卧室氛围，柔和自然光，温馨舒适，产品摄影，超高清细节，真实质感，商业摄影，8K分辨率'
  },
  {
    id: 'd4',
    name: '窗帘',
    prompt: '南通蓝印花布窗帘，深靛蓝色底色，白色清雅花纹图案，蓝白配色，垂挂在木格窗前，透光朦胧效果，江南烟雨意境，中式家居氛围，柔和自然光，产品摄影，超高清细节，真实质感，商业摄影，8K分辨率'
  },
  {
    id: 'd5',
    name: '蓝印花布收纳筐',
    prompt: '棉麻南通蓝印花布收纳筐，深靛蓝色与白色花卉纹样，蓝白配色，编织手提绳，方形大容量，内装衣物展示，国风家居装饰，实用收纳，自然光线，纯白色背景，产品摄影，超高清细节，真实质感，商业摄影，8K分辨率'
  },
  {
    id: 'd6',
    name: '蓝印花布木式台灯',
    prompt: '实木框架台灯，南通蓝印花布灯罩，深靛蓝色底色白色缠枝纹，蓝白配色，复古国风设计，暖光透出，摆放在书桌上，温馨照明氛围，中式家居装饰，柔和灯光，产品摄影，超高清细节，真实质感，商业摄影，8K分辨率'
  },
  {
    id: 'd7',
    name: '蓝印花布屏风隔断',
    prompt: '实木榫卯结构屏风，双层南通蓝印花布面板，深靛蓝色底色，白色莲纹云纹图案，蓝白配色，可折叠设计，东方雅致，摆放在中式客厅茶室，空间隔断装饰，柔和灯光，产品摄影，超高清细节，真实质感，商业摄影，8K分辨率'
  },
  {
    id: 'd8',
    name: '蓝印花布笔筒',
    prompt: '实木底座笔筒，包裹南通蓝印花布，深靛蓝色底色白色缠枝莲纹，蓝白配色，圆筒形状，内装毛笔钢笔，摆放在书桌上，中式文房雅器，国风清雅，柔和灯光，纯白色背景，产品摄影，超高清细节，真实质感，商业摄影，8K分辨率'
  },
  {
    id: 'd9',
    name: '鼠标垫',
    prompt: '棉麻南通蓝印花布鼠标垫，防滑橡胶底，深靛蓝色底色白色团花缠枝纹图案，蓝白配色，长方形桌面配件，摆放在办公桌上，现代办公与传统美学结合，自然光线，产品摄影，超高清细节，真实质感，商业摄影，8K分辨率'
  },
  {
    id: 'd10',
    name: '蓝印花布壁纸',
    prompt: '环保无纺布壁纸，南通蓝印花布缠枝莲云纹图案，深靛蓝色与白色配色，蓝白清雅，东方禅意，铺贴在墙面上展示，中式家居背景墙，温润质感，柔和灯光，室内场景，产品摄影，超高清细节，真实质感，商业摄影，8K分辨率'
  }
];

// 调用API生成图片
async function generateImage(product) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({
      model: 'doubao-seedream-4-5-251128',
      prompt: product.prompt,
      sequential_image_generation: 'disabled',
      response_format: 'url',
      size: '2K',
      stream: false,
      watermark: true
    });

    const options = {
      hostname: 'ark.cn-beijing.volces.com',
      port: 443,
      path: '/api/v3/images/generations',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    console.log(`\n正在为 "${product.name}" 生成图片...`);

    const req = https.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          if (response.data && response.data.length > 0) {
            const imageUrl = response.data[0].url;
            console.log(`✓ ${product.name} 图片生成成功！`);
            resolve({
              id: product.id,
              name: product.name,
              imageUrl: imageUrl
            });
          } else {
            console.error(`✗ ${product.name} 生成失败:`, data);
            reject(new Error(`生成失败: ${data}`));
          }
        } catch (error) {
          console.error(`✗ ${product.name} 解析响应失败:`, error);
          reject(error);
        }
      });
    });

    req.on('error', (error) => {
      console.error(`✗ ${product.name} 请求失败:`, error);
      reject(error);
    });

    req.write(postData);
    req.end();
  });
}

// 主函数
async function main() {
  console.log('开始生成商城产品图片...\n');
  console.log('='.repeat(60));
  console.log(`共需生成 ${products.length} 张图片`);
  console.log('='.repeat(60));

  const results = [];

  // 逐个生成图片（避免并发限制）
  for (let i = 0; i < products.length; i++) {
    const product = products[i];
    console.log(`\n[${i + 1}/${products.length}] 处理中...`);
    
    try {
      const result = await generateImage(product);
      results.push(result);
      
      // 等待3秒再生成下一张（避免API限流）
      if (i < products.length - 1) {
        console.log('等待3秒后继续...');
        await new Promise(resolve => setTimeout(resolve, 3000));
      }
    } catch (error) {
      console.error(`生成 ${product.name} 时出错:`, error.message);
      results.push({
        id: product.id,
        name: product.name,
        imageUrl: null,
        error: error.message
      });
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('\n生成完成！结果汇总：\n');

  // 输出结果
  let successCount = 0;
  let failCount = 0;

  results.forEach((result, index) => {
    console.log(`${index + 1}. [${result.id}] ${result.name}`);
    if (result.imageUrl) {
      console.log(`   ✓ 成功`);
      successCount++;
    } else {
      console.log(`   ✗ 失败: ${result.error || '未知错误'}`);
      failCount++;
    }
  });

  console.log('\n' + '='.repeat(60));
  console.log(`\n统计: 成功 ${successCount} 张，失败 ${failCount} 张`);
  console.log('='.repeat(60));

  // 保存结果到文件
  const outputFile = 'shop-images.json';
  fs.writeFileSync(outputFile, JSON.stringify(results, null, 2), 'utf8');
  console.log(`\n结果已保存到: ${outputFile}`);

  console.log('\n提示: 运行 node update-shop-images.js 来自动更新 ShopPage.tsx 中的图片URL');
}

main().catch(console.error);
