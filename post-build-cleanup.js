const fs = require('fs');
const path = require('path');

console.log('🧹 构建后清理...\n');

// 读取.env文件来获取配置
let useCompressed = false;
const envPath = './.env';

if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  useCompressed = envContent.includes('VITE_USE_COMPRESSED_IMAGES=true');
}

console.log(`🔧 压缩图片配置: ${useCompressed ? '启用' : '禁用'}`);

if (!useCompressed) {
  console.log('⏭️  未启用压缩图片，跳过清理');
  process.exit(0);
}

const distDir = './dist';
const originalImagesDir = path.join(distDir, 'images');
const compressedImagesDir = path.join(distDir, 'images-compressed');

// 检查目录是否存在
if (!fs.existsSync(distDir)) {
  console.log('❌ dist目录不存在');
  process.exit(1);
}

if (!fs.existsSync(compressedImagesDir)) {
  console.log('❌ 压缩图片目录不存在');
  process.exit(1);
}

// 删除原始图片目录
let deletedCount = 0;
let deletedSize = 0;

if (fs.existsSync(originalImagesDir)) {
  console.log('🗑️  删除原始图片目录...');
  
  const files = fs.readdirSync(originalImagesDir);
  
  files.forEach(file => {
    const filePath = path.join(originalImagesDir, file);
    const stat = fs.statSync(filePath);
    deletedSize += stat.size;
    deletedCount++;
    fs.unlinkSync(filePath);
    console.log(`   删除: ${file} (${(stat.size/1024).toFixed(1)}KB)`);
  });
  
  // 删除空目录
  fs.rmdirSync(originalImagesDir);
  
  console.log(`\n📊 清理统计:`);
  console.log(`   删除文件: ${deletedCount} 个`);
  console.log(`   节省空间: ${(deletedSize/1024/1024).toFixed(2)}MB`);
} else {
  console.log('ℹ️  原始图片目录不存在，无需清理');
}

// 检查压缩图片
const compressedFiles = fs.readdirSync(compressedImagesDir);
const compressedCount = compressedFiles.filter(f => /\.(jpg|jpeg|png|webp)$/i.test(f)).length;

console.log(`\n✅ 保留压缩图片: ${compressedCount} 个文件`);

// 生成最终报告
const finalReport = {
  timestamp: new Date().toISOString(),
  cleanup: {
    enabled: true,
    deletedOriginalImages: deletedCount,
    compressedImagesCount: compressedCount,
    spaceSaved: `${(deletedSize/1024/1024).toFixed(2)}MB`
  }
};

fs.writeFileSync(path.join(distDir, 'build-report.json'), JSON.stringify(finalReport, null, 2));

console.log('\n🎉 构建后清理完成！');
console.log('📄 构建报告已生成: dist/build-report.json');