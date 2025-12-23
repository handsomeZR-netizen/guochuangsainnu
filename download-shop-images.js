const https = require('https');
const fs = require('fs');
const path = require('path');

// 读取生成的图片数据
const imagesData = JSON.parse(fs.readFileSync('shop-images.json', 'utf8'));

// 确保public/images目录存在
const imagesDir = path.join('public', 'images');
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

// 下载单个图片
function downloadImage(url, filename) {
  return new Promise((resolve, reject) => {
    console.log(`正在下载: ${filename}...`);
    
    const file = fs.createWriteStream(path.join(imagesDir, filename));
    
    https.get(url, (response) => {
      response.pipe(file);
      
      file.on('finish', () => {
        file.close();
        console.log(`✓ 下载完成: ${filename}`);
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(path.join(imagesDir, filename), () => {});
      console.error(`✗ 下载失败: ${filename}`, err.message);
      reject(err);
    });
  });
}

// 主函数
async function main() {
  console.log('开始下载商城产品图片...\n');
  console.log('='.repeat(60));
  
  let successCount = 0;
  let failCount = 0;
  
  for (const item of imagesData) {
    if (item.imageUrl) {
      const filename = `shop-${item.id}.jpg`;
      try {
        await downloadImage(item.imageUrl, filename);
        successCount++;
        // 等待1秒再下载下一张
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        console.error(`下载 ${item.name} 失败:`, error.message);
        failCount++;
      }
    }
  }
  
  console.log('\n' + '='.repeat(60));
  console.log(`\n下载完成！`);
  console.log(`成功: ${successCount} 张`);
  console.log(`失败: ${failCount} 张`);
  console.log('\n' + '='.repeat(60));
  console.log('\n图片已保存到: public/images/');
  console.log('\n提示: 运行 node update-shop-images-local.js 来更新为本地路径');
}

main().catch(console.error);
