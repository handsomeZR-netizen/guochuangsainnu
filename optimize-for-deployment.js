const fs = require('fs');
const path = require('path');

console.log('🚀 开始部署优化...\n');

// 1. 检查压缩图片目录
const compressedDir = './public/images-compressed';
if (!fs.existsSync(compressedDir)) {
  console.log('❌ 压缩图片目录不存在，正在创建...');
  // 运行压缩脚本
  const { execSync } = require('child_process');
  try {
    execSync('node compress-images.js', { stdio: 'inherit' });
  } catch (error) {
    console.error('❌ 图片压缩失败:', error.message);
    process.exit(1);
  }
}

// 2. 检查环境变量配置
const envPath = './.env';
let envContent = '';
if (fs.existsSync(envPath)) {
  envContent = fs.readFileSync(envPath, 'utf8');
}

// 确保生产环境使用压缩图片
if (!envContent.includes('VITE_USE_COMPRESSED_IMAGES=true')) {
  if (envContent.includes('VITE_USE_COMPRESSED_IMAGES=')) {
    envContent = envContent.replace(/VITE_USE_COMPRESSED_IMAGES=.*/, 'VITE_USE_COMPRESSED_IMAGES=true');
  } else {
    envContent += '\n# 图片目录配置 - 生产环境使用压缩图片\nVITE_USE_COMPRESSED_IMAGES=true\n';
  }
  fs.writeFileSync(envPath, envContent);
  console.log('✅ 已配置使用压缩图片');
}

// 3. 生成部署报告
const originalDir = './public/images';
const compressedFiles = fs.readdirSync(compressedDir);
const originalFiles = fs.existsSync(originalDir) ? fs.readdirSync(originalDir) : [];

let totalOriginalSize = 0;
let totalCompressedSize = 0;

originalFiles.forEach(file => {
  if (/\.(jpg|jpeg|png|webp)$/i.test(file)) {
    const originalPath = path.join(originalDir, file);
    const compressedPath = path.join(compressedDir, file);
    
    if (fs.existsSync(originalPath)) {
      totalOriginalSize += fs.statSync(originalPath).size;
    }
    if (fs.existsSync(compressedPath)) {
      totalCompressedSize += fs.statSync(compressedPath).size;
    }
  }
});

const reduction = totalOriginalSize > 0 ? ((totalOriginalSize - totalCompressedSize) / totalOriginalSize * 100).toFixed(1) : 0;

console.log('\n📊 部署优化报告:');
console.log(`图片文件数量: ${compressedFiles.length}`);
console.log(`原始大小: ${(totalOriginalSize/1024/1024).toFixed(2)}MB`);
console.log(`压缩后大小: ${(totalCompressedSize/1024/1024).toFixed(2)}MB`);
console.log(`减少: ${reduction}%`);

// 4. 检查关键文件
const criticalFiles = [
  './index.html',
  './package.json',
  './vite.config.ts',
  './netlify.toml'
];

console.log('\n🔍 检查关键文件:');
criticalFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} - 文件缺失`);
  }
});

// 5. 生成部署清单
const deploymentManifest = {
  timestamp: new Date().toISOString(),
  imageOptimization: {
    enabled: true,
    originalSize: `${(totalOriginalSize/1024/1024).toFixed(2)}MB`,
    compressedSize: `${(totalCompressedSize/1024/1024).toFixed(2)}MB`,
    reduction: `${reduction}%`,
    fileCount: compressedFiles.length
  },
  environment: {
    useCompressedImages: true,
    nodeEnv: process.env.NODE_ENV || 'production'
  }
};

fs.writeFileSync('./deployment-manifest.json', JSON.stringify(deploymentManifest, null, 2));
console.log('\n✅ 部署清单已生成: deployment-manifest.json');

console.log('\n🎉 部署优化完成！');
console.log('💡 提示: 确保在Netlify构建设置中运行 "npm run optimize && npm run build"');