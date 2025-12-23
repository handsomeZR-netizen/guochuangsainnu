import fs from 'fs';
import path from 'path';

/**
 * Vite插件：智能资源处理
 * 根据环境变量决定复制哪些图片资源
 */
export function smartAssetsPlugin() {
  return {
    name: 'smart-assets',
    generateBundle(options, bundle) {
      const useCompressed = process.env.VITE_USE_COMPRESSED_IMAGES === 'true';
      
      if (!useCompressed) {
        return; // 开发环境或未启用压缩时，使用默认行为
      }
      
      console.log('🎯 智能资源处理：使用压缩图片');
      
      // 移除原始图片资源
      Object.keys(bundle).forEach(fileName => {
        if (fileName.startsWith('images/') && /\.(jpg|jpeg|png|webp)$/i.test(fileName)) {
          delete bundle[fileName];
          console.log(`   移除原始图片: ${fileName}`);
        }
      });
      
      // 添加压缩图片资源
      const compressedDir = path.resolve('public/images-compressed');
      if (fs.existsSync(compressedDir)) {
        const files = fs.readdirSync(compressedDir);
        
        files.forEach(file => {
          if (/\.(jpg|jpeg|png|webp)$/i.test(file)) {
            const filePath = path.join(compressedDir, file);
            const content = fs.readFileSync(filePath);
            
            // 添加到bundle中，路径为images-compressed/
            bundle[`images-compressed/${file}`] = {
              type: 'asset',
              fileName: `images-compressed/${file}`,
              source: content
            };
            
            console.log(`   添加压缩图片: images-compressed/${file}`);
          }
        });
      }
    }
  };
}