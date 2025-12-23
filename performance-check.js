const fs = require('fs');
const path = require('path');

console.log('📊 性能检查报告\n');

// 检查图片优化效果
function checkImageOptimization() {
  const originalDir = './public/images';
  const compressedDir = './public/images-compressed';
  
  if (!fs.existsSync(originalDir) || !fs.existsSync(compressedDir)) {
    console.log('❌ 图片目录不完整');
    return;
  }
  
  const originalFiles = fs.readdirSync(originalDir).filter(f => /\.(jpg|jpeg|png|webp)$/i.test(f));
  const compressedFiles = fs.readdirSync(compressedDir).filter(f => /\.(jpg|jpeg|png|webp)$/i.test(f));
  
  let totalOriginal = 0;
  let totalCompressed = 0;
  
  originalFiles.forEach(file => {
    const originalPath = path.join(originalDir, file);
    const compressedPath = path.join(compressedDir, file);
    
    if (fs.existsSync(originalPath)) {
      totalOriginal += fs.statSync(originalPath).size;
    }
    if (fs.existsSync(compressedPath)) {
      totalCompressed += fs.statSync(compressedPath).size;
    }
  });
  
  const reduction = totalOriginal > 0 ? ((totalOriginal - totalCompressed) / totalOriginal * 100).toFixed(1) : 0;
  
  console.log('🖼️  图片优化:');
  console.log(`   文件数量: ${originalFiles.length} → ${compressedFiles.length}`);
  console.log(`   总大小: ${(totalOriginal/1024/1024).toFixed(2)}MB → ${(totalCompressed/1024/1024).toFixed(2)}MB`);
  console.log(`   减少: ${reduction}%`);
  
  if (reduction > 80) {
    console.log('   ✅ 优化效果优秀');
  } else if (reduction > 50) {
    console.log('   ⚠️  优化效果一般，建议重新压缩');
  } else {
    console.log('   ❌ 优化效果不佳，请检查压缩配置');
  }
}

// 检查构建输出
function checkBuildOutput() {
  const distDir = './dist';
  
  if (!fs.existsSync(distDir)) {
    console.log('\n📦 构建输出: ❌ 未找到dist目录，请先运行构建');
    return;
  }
  
  const files = getAllFiles(distDir);
  const jsFiles = files.filter(f => f.endsWith('.js'));
  const cssFiles = files.filter(f => f.endsWith('.css'));
  const imageFiles = files.filter(f => /\.(jpg|jpeg|png|webp|svg)$/i.test(f));
  
  let totalSize = 0;
  files.forEach(file => {
    totalSize += fs.statSync(file).size;
  });
  
  console.log('\n📦 构建输出:');
  console.log(`   总文件: ${files.length} 个`);
  console.log(`   JS文件: ${jsFiles.length} 个`);
  console.log(`   CSS文件: ${cssFiles.length} 个`);
  console.log(`   图片文件: ${imageFiles.length} 个`);
  console.log(`   总大小: ${(totalSize/1024/1024).toFixed(2)}MB`);
  
  // 检查大文件
  const largeFiles = files.filter(file => {
    const size = fs.statSync(file).size;
    return size > 1024 * 1024; // 大于1MB
  });
  
  if (largeFiles.length > 0) {
    console.log('\n⚠️  大文件警告:');
    largeFiles.forEach(file => {
      const size = fs.statSync(file).size;
      console.log(`   ${path.relative(distDir, file)}: ${(size/1024/1024).toFixed(2)}MB`);
    });
  }
}

// 检查环境配置
function checkEnvironmentConfig() {
  console.log('\n🔧 环境配置:');
  
  const envPath = './.env';
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    
    if (envContent.includes('VITE_USE_COMPRESSED_IMAGES=true')) {
      console.log('   ✅ 压缩图片已启用');
    } else {
      console.log('   ⚠️  压缩图片未启用，建议设置 VITE_USE_COMPRESSED_IMAGES=true');
    }
    
    if (envContent.includes('VITE_ARK_API_KEY=')) {
      console.log('   ✅ API密钥已配置');
    } else {
      console.log('   ❌ API密钥未配置');
    }
  } else {
    console.log('   ❌ .env文件不存在');
  }
}

// 检查关键文件
function checkCriticalFiles() {
  console.log('\n📋 关键文件检查:');
  
  const criticalFiles = [
    { path: './package.json', name: 'Package配置' },
    { path: './vite.config.ts', name: 'Vite配置' },
    { path: './netlify.toml', name: 'Netlify配置' },
    { path: './compress-images.js', name: '图片压缩脚本' },
    { path: './optimize-for-deployment.js', name: '部署优化脚本' },
    { path: './utils/imageUtils.ts', name: '图片工具' }
  ];
  
  criticalFiles.forEach(({ path: filePath, name }) => {
    if (fs.existsSync(filePath)) {
      console.log(`   ✅ ${name}`);
    } else {
      console.log(`   ❌ ${name} - 文件缺失`);
    }
  });
}

// 性能建议
function performanceRecommendations() {
  console.log('\n💡 性能优化建议:');
  
  const recommendations = [
    '定期运行 "npm run compress-images" 压缩新图片',
    '部署前使用 "npm run deploy" 进行完整检查',
    '监控构建输出大小，避免单个文件超过1MB',
    '使用 "npm run preview" 本地测试生产版本',
    '考虑启用CDN加速静态资源加载'
  ];
  
  recommendations.forEach((rec, index) => {
    console.log(`   ${index + 1}. ${rec}`);
  });
}

// 工具函数：递归获取所有文件
function getAllFiles(dir) {
  let files = [];
  const items = fs.readdirSync(dir);
  
  items.forEach(item => {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      files = files.concat(getAllFiles(fullPath));
    } else {
      files.push(fullPath);
    }
  });
  
  return files;
}

// 执行所有检查
checkImageOptimization();
checkBuildOutput();
checkEnvironmentConfig();
checkCriticalFiles();
performanceRecommendations();

console.log('\n✨ 性能检查完成！');