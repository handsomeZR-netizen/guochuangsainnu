const fs = require('fs');

// 读取生成的图片数据
const imagesData = JSON.parse(fs.readFileSync('shop-images.json', 'utf8'));

// 读取ShopPage.tsx文件
let shopPageContent = fs.readFileSync('components/ShopPage.tsx', 'utf8');

console.log('开始更新 ShopPage.tsx 中的图片URL...\n');

let updateCount = 0;
let failCount = 0;

// 为每个产品更新图片URL
imagesData.forEach(item => {
  if (item.imageUrl) {
    // 查找对应的产品定义并替换image字段
    const regex = new RegExp(
      `(id:\\s*'${item.id}'[\\s\\S]*?image:\\s*')([^']*)(')`,
      'g'
    );
    
    const beforeUpdate = shopPageContent;
    shopPageContent = shopPageContent.replace(regex, `$1${item.imageUrl}$3`);
    
    if (beforeUpdate !== shopPageContent) {
      console.log(`✓ 已更新: [${item.id}] ${item.name}`);
      updateCount++;
    } else {
      console.log(`✗ 未找到: [${item.id}] ${item.name}`);
      failCount++;
    }
  } else {
    console.log(`⊘ 跳过（无URL）: [${item.id}] ${item.name}`);
    failCount++;
  }
});

// 写回文件
fs.writeFileSync('components/ShopPage.tsx', shopPageContent, 'utf8');

console.log('\n' + '='.repeat(60));
console.log(`\n更新完成！`);
console.log(`成功更新: ${updateCount} 个产品`);
console.log(`失败/跳过: ${failCount} 个产品`);
console.log('\n' + '='.repeat(60));
console.log('\nShopPage.tsx 已更新！');
