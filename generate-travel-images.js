const https = require('https');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const API_KEY = process.env.VITE_ARK_API_KEY;

// 旅拍系列产品的提示词
const products = [
  // 旅拍服饰系列
  {
    id: 't1',
    name: '成人汉服古风套装',
    prompt: '南通蓝印花布汉服套装，女款交领襦裙，上衣浅靛蓝印花布（小团花缠枝纹），下裙深靛蓝渐变色，搭配同纹样披帛；男款直裾圆领袍，藏青蓝印花布（云纹回纹），袖口领口白色纹样镶边，蓝白配色，古风旅拍服饰，模特展示，户外古镇背景，柔和自然光，产品摄影，超高清细节，真实质感，商业摄影，8K分辨率'
  },
  {
    id: 't2',
    name: '亲子旅拍套装',
    prompt: '南通蓝印花布亲子汉服套装，成人款与儿童款纹样色调统一，深靛蓝与白色配色，成人款简约大气，儿童款增加可爱花边帽子配饰，蓝白印花衬衫套装，亲子旅拍服饰，温馨家庭氛围，户外田园背景，柔和自然光，产品摄影，超高清细节，真实质感，商业摄影，8K分辨率'
  },
  {
    id: 't3',
    name: '蓝印花布披肩斗篷',
    prompt: '南通蓝印花布披肩斗篷套装，轻薄款披肩适配春秋，厚款斗篷适配秋冬，深靛蓝底色白色大朵花云纹图案，蓝白配色，短款马甲可内搭纯色衣物，旅拍配饰服饰，精致展示，纯白色背景，柔和灯光，产品摄影，超高清细节，真实质感，商业摄影，8K分辨率'
  },
  {
    id: 't4',
    name: '户外旅拍功能服饰',
    prompt: '南通蓝印花布户外功能服饰套装，防水透气冲锋衣（简约几何纹样内胆可拆卸），速干印花短袖（清新水波纹），印花布工装裤（侧边口袋贴印花布贴片），深靛蓝与白色配色，户外旅拍实用服饰，产品平铺展示，纯白色背景，柔和灯光，产品摄影，超高清细节，真实质感，商业摄影，8K分辨率'
  },
  // 头部配饰
  {
    id: 't5',
    name: '古风头饰套装',
    prompt: '南通蓝印花布古风头饰套装，发带（回纹缠枝纹）、发簪（簪头镶嵌蓝印花布纹样贴片）、斗笠（帽檐边缘包裹蓝印花布），深靛蓝与白色配色，古风旅拍配饰，精致摆放展示，纯白色背景，柔和灯光，产品摄影，超高清细节，真实质感，商业摄影，8K分辨率'
  },
  {
    id: 't6',
    name: '日常帽饰套装',
    prompt: '南通蓝印花布日常帽饰套装，棒球帽渔夫帽（帽身印小碎花几何纹样），宽檐遮阳帽（帽檐内侧贴蓝印花布贴片外侧纯色），深靛蓝与白色配色，旅拍日常配饰，精致摆放展示，纯白色背景，柔和灯光，产品摄影，超高清细节，真实质感，商业摄影，8K分辨率'
  },
  // 手部配饰
  {
    id: 't7',
    name: '手部配饰套装',
    prompt: '南通蓝印花布手部配饰套装，布艺编织手链（搭配木质银色小配饰）、精致小团花手包（可放置手机口红）、薄棉手套（简约蓝白纹样），深靛蓝与白色配色，旅拍手部配饰，精致摆放展示，纯白色背景，柔和灯光，产品摄影，超高清细节，真实质感，商业摄影，8K分辨率'
  },
  // 拍摄道具配饰
  {
    id: 't8',
    name: '油纸伞团扇套装',
    prompt: '南通蓝印花布拍摄道具套装，油纸伞（伞面印大朵缠枝莲牡丹纹），团扇（扇面为蓝印花布精美纹样），深靛蓝与白色配色，古风旅拍道具，精致摆放展示，纯白色背景，柔和灯光，产品摄影，超高清细节，真实质感，商业摄影，8K分辨率'
  },
  {
    id: 't9',
    name: '田园手提篮',
    prompt: '南通蓝印花布包裹藤编手提篮，深靛蓝与白色花卉纹样，田园风旅拍道具，内放鲜花水果展示，户外田园背景，柔和自然光，产品摄影，超高清细节，真实质感，商业摄影，8K分辨率'
  },
  // 场景氛围道具
  {
    id: 't10',
    name: '旅拍场景帐篷',
    prompt: '南通蓝印花布小型便携帐篷，外帐采用蓝印花布材质（清新云纹水波纹），内帐纯色透气棉布，深靛蓝与白色配色，户外露营田园古镇旅拍场景，帐篷展开展示，户外草地背景，柔和自然光，产品摄影，超高清细节，真实质感，商业摄影，8K分辨率'
  },
  {
    id: 't11',
    name: '野餐垫装饰布',
    prompt: '南通蓝印花布野餐垫套装，防水材质大尺寸野餐垫（清新小碎花几何纹），帐篷装饰布（悬挂增加氛围感），深靛蓝与白色配色，户外旅拍野餐场景道具，铺展展示，户外草地背景，柔和自然光，产品摄影，超高清细节，真实质感，商业摄影，8K分辨率'
  },
  // 便携收纳类
  {
    id: 't12',
    name: '便携收纳套装',
    prompt: '南通蓝印花布便携收纳套装，可折叠收纳袋（收纳衣物拍摄道具）、分层化妆包（小碎花纹样）、简约证件卡包（回纹），深靛蓝与白色配色，旅拍便携收纳，精致摆放展示，纯白色背景，柔和灯光，产品摄影，超高清细节，真实质感，商业摄影，8K分辨率'
  },
  // 纪念周边类
  {
    id: 't13',
    name: '拍摄纪念册',
    prompt: '南通蓝印花布封面拍摄纪念册，封面印"旅拍纪念"字样与祥云纹，内页可定制照片插页，深靛蓝与白色配色，旅拍纪念品，精致展示，纯白色背景，柔和灯光，产品摄影，超高清细节，真实质感，商业摄影，8K分辨率'
  },
  {
    id: 't14',
    name: '纹样明信片套装',
    prompt: '南通蓝印花布纹样明信片套装，一套10张，每张印不同蓝印花布经典纹样，背面可书写寄语，深靛蓝与白色配色，旅拍邮寄纪念品，扇形摆放展示，纯白色背景，柔和灯光，产品摄影，超高清细节，真实质感，商业摄影，8K分辨率'
  },
  {
    id: 't15',
    name: '冰箱贴钥匙扣套装',
    prompt: '南通蓝印花布冰箱贴钥匙扣套装，木质金属材质主体，表面贴蓝印花布纹样贴片，小巧精致，深靛蓝与白色配色，旅拍纪念品，精致摆放展示，纯白色背景，柔和灯光，产品摄影，超高清细节，真实质感，商业摄影，8K分辨率'
  },
  // 旅拍专属记录套装
  {
    id: 't16',
    name: '旅拍记录套装',
    prompt: '南通蓝印花布旅拍专属记录套装，蓝印花布封面笔记本（内页印浅淡纹样）、印花布笔套（包裹木质笔杆）、多种纹样贴纸，深靛蓝与白色配色，旅拍记录纪念品，精致摆放展示，纯白色背景，柔和灯光，产品摄影，超高清细节，真实质感，商业摄影，8K分辨率'
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

// 下载图片到本地
async function downloadImage(url, filename) {
  return new Promise((resolve, reject) => {
    const outputDir = './public/images';
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    const outputPath = path.join(outputDir, filename);
    const file = fs.createWriteStream(outputPath);
    
    https.get(url, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        // 处理重定向
        https.get(response.headers.location, (redirectResponse) => {
          redirectResponse.pipe(file);
          file.on('finish', () => {
            file.close();
            console.log(`  ✓ 下载完成: ${filename}`);
            resolve(outputPath);
          });
        }).on('error', reject);
      } else {
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          console.log(`  ✓ 下载完成: ${filename}`);
          resolve(outputPath);
        });
      }
    }).on('error', (error) => {
      fs.unlink(outputPath, () => {});
      reject(error);
    });
  });
}

// 压缩图片
async function compressImage(inputPath, outputPath) {
  const sharp = require('sharp');
  
  try {
    await sharp(inputPath)
      .resize(800, null, {
        withoutEnlargement: true,
        fit: 'inside'
      })
      .jpeg({ quality: 75, progressive: true })
      .toFile(outputPath);
    
    const originalSize = fs.statSync(inputPath).size;
    const compressedSize = fs.statSync(outputPath).size;
    const reduction = ((originalSize - compressedSize) / originalSize * 100).toFixed(1);
    
    console.log(`  ✓ 压缩完成: ${(originalSize/1024).toFixed(1)}KB → ${(compressedSize/1024).toFixed(1)}KB (减少${reduction}%)`);
    return true;
  } catch (error) {
    console.error(`  ✗ 压缩失败:`, error.message);
    return false;
  }
}

// 主函数
async function main() {
  console.log('开始生成旅拍系列产品图片...\n');
  console.log('='.repeat(60));
  console.log(`共需生成 ${products.length} 张图片`);
  console.log('='.repeat(60));

  const results = [];
  const compressedDir = './public/images-compressed';
  
  if (!fs.existsSync(compressedDir)) {
    fs.mkdirSync(compressedDir, { recursive: true });
  }

  // 逐个生成图片
  for (let i = 0; i < products.length; i++) {
    const product = products[i];
    console.log(`\n[${i + 1}/${products.length}] 处理中...`);
    
    try {
      // 生成图片
      const result = await generateImage(product);
      results.push(result);
      
      // 下载图片到本地
      const filename = `shop-${product.id}.jpg`;
      const localPath = await downloadImage(result.imageUrl, filename);
      
      // 压缩图片
      const compressedPath = path.join(compressedDir, filename);
      await compressImage(localPath, compressedPath);
      
      result.localPath = `/images-compressed/${filename}`;
      
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
  const outputFile = 'travel-images.json';
  fs.writeFileSync(outputFile, JSON.stringify(results, null, 2), 'utf8');
  console.log(`\n结果已保存到: ${outputFile}`);
}

main().catch(console.error);
