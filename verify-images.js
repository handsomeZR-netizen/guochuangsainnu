const fs = require('fs');
const path = require('path');

console.log('🔍 验证图片配置...\n');

// 1. 检查压缩图片目录
const compressedDir = './public/images-compressed';
if (fs.existsSync(compressedDir)) {
  const files = fs.readdirSync(compressedDir).filter(f => /\.(jpg|jpeg|png)$/i.test(f));
  console.log(`✅ 压缩图片目录存在: ${files.length} 个文件`);
  
  // 显示前5个文件
  console.log('   示例文件:');
  files.slice(0, 5).forEach(file => {
    const filePath = path.join(compressedDir, file);
    const size = fs.statSync(filePath).size;
    console.log(`   - ${file}: ${(size/1024).toFixed(1)}KB`);
  });
} else {
  console.log('❌ 压缩图片目录不存在');
}

// 2. 检查ShopPage.tsx中的图片路径
console.log('\n📄 检查ShopPage.tsx...');
const shopPagePath = './components/ShopPage.tsx';
if (fs.existsSync(shopPagePath)) {
  const content = fs.readFileSync(shopPagePath, 'utf8');
  
  // 统计图片路径
  const compressedImages = (content.match(/\/images-compressed\//g) || []).length;
  const originalImages = (content.match(/\/images\/shop-/g) || []).length;
  
  console.log(`   压缩图片路径: ${compressedImages} 个`);
  console.log(`   原始图片路径: ${originalImages} 个`);
  
  if (originalImages > 0) {
    console.log('   ⚠️  警告: 仍有原始图片路径');
  } else {
    console.log('   ✅ 所有图片都使用压缩版本');
  }
} else {
  console.log('   ❌ ShopPage.tsx 不存在');
}

// 3. 检查ProductShowcase.tsx
console.log('\n📄 检查ProductShowcase.tsx...');
const showcasePath = './components/ProductShowcase.tsx';
if (fs.existsSync(showcasePath)) {
  const content = fs.readFileSync(showcasePath, 'utf8');
  
  const compressedImages = (content.match(/\/images-compressed\//g) || []).length;
  const originalImages = (content.match(/\/images\/product-/g) || []).length;
  
  console.log(`   压缩图片路径: ${compressedImages} 个`);
  console.log(`   原始图片路径: ${originalImages} 个`);
  
  if (originalImages > 0) {
    console.log('   ⚠️  警告: 仍有原始图片路径');
  } else {
    console.log('   ✅ 所有图片都使用压缩版本');
  }
}

// 4. 生成测试URL列表
console.log('\n🌐 测试URL列表:');
console.log('   开发服务器: http://localhost:3001/shop');
console.log('   图片示例:');
console.log('   - http://localhost:3001/images-compressed/shop-h1.jpg');
console.log('   - http://localhost:3001/images-compressed/shop-b1.jpg');
console.log('   - http://localhost:3001/images-compressed/shop-d1.jpg');

console.log('\n💡 如果浏览器仍显示旧图片，请尝试:');
console.log('   1. 硬刷新: Ctrl + Shift + R (Windows) 或 Cmd + Shift + R (Mac)');
console.log('   2. 清除浏览器缓存');
console.log('   3. 打开开发者工具 → Network → 勾选 "Disable cache"');
console.log('   4. 重启开发服务器: npm run dev');

console.log('\n✨ 验证完成！');