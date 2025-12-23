const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// 创建压缩图片目录
const sourceDir = './public/images';
const compressedDir = './public/images-compressed';

// 确保压缩目录存在
if (!fs.existsSync(compressedDir)) {
  fs.mkdirSync(compressedDir, { recursive: true });
}

// 压缩配置
const compressionOptions = {
  jpeg: {
    quality: 75,
    progressive: true
  },
  webp: {
    quality: 80
  },
  png: {
    compressionLevel: 8
  }
};

async function compressImage(inputPath, outputPath) {
  try {
    const ext = path.extname(inputPath).toLowerCase();
    let pipeline = sharp(inputPath);
    
    // 调整尺寸 - 最大宽度800px，保持比例
    pipeline = pipeline.resize(800, null, {
      withoutEnlargement: true,
      fit: 'inside'
    });
    
    // 根据文件类型应用压缩
    if (ext === '.jpg' || ext === '.jpeg') {
      pipeline = pipeline.jpeg(compressionOptions.jpeg);
    } else if (ext === '.png') {
      pipeline = pipeline.png(compressionOptions.png);
    } else if (ext === '.webp') {
      pipeline = pipeline.webp(compressionOptions.webp);
    }
    
    await pipeline.toFile(outputPath);
    
    // 获取文件大小信息
    const originalSize = fs.statSync(inputPath).size;
    const compressedSize = fs.statSync(outputPath).size;
    const reduction = ((originalSize - compressedSize) / originalSize * 100).toFixed(1);
    
    console.log(`✅ ${path.basename(inputPath)}: ${(originalSize/1024).toFixed(1)}KB → ${(compressedSize/1024).toFixed(1)}KB (减少${reduction}%)`);
    
    return { originalSize, compressedSize, reduction };
  } catch (error) {
    console.error(`❌ 压缩失败 ${inputPath}:`, error.message);
    return null;
  }
}

async function compressAllImages() {
  console.log('🚀 开始压缩图片...\n');
  
  try {
    const files = fs.readdirSync(sourceDir);
    const imageFiles = files.filter(file => 
      /\.(jpg|jpeg|png|webp)$/i.test(file)
    );
    
    if (imageFiles.length === 0) {
      console.log('❌ 未找到图片文件');
      return;
    }
    
    let totalOriginal = 0;
    let totalCompressed = 0;
    let successCount = 0;
    
    for (const file of imageFiles) {
      const inputPath = path.join(sourceDir, file);
      const outputPath = path.join(compressedDir, file);
      
      const result = await compressImage(inputPath, outputPath);
      if (result) {
        totalOriginal += result.originalSize;
        totalCompressed += result.compressedSize;
        successCount++;
      }
    }
    
    const totalReduction = ((totalOriginal - totalCompressed) / totalOriginal * 100).toFixed(1);
    
    console.log('\n📊 压缩统计:');
    console.log(`成功压缩: ${successCount}/${imageFiles.length} 个文件`);
    console.log(`总大小: ${(totalOriginal/1024/1024).toFixed(2)}MB → ${(totalCompressed/1024/1024).toFixed(2)}MB`);
    console.log(`总减少: ${totalReduction}%`);
    console.log(`\n✨ 压缩完成！压缩后的图片保存在: ${compressedDir}`);
    
  } catch (error) {
    console.error('❌ 压缩过程出错:', error);
  }
}

// 运行压缩
compressAllImages();