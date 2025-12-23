#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');

console.log('🚀 开始一键部署流程...\n');

// 检查是否在正确的目录
if (!fs.existsSync('./package.json')) {
  console.error('❌ 请在项目根目录运行此脚本');
  process.exit(1);
}

const steps = [
  {
    name: '检查依赖',
    command: 'npm list --depth=0',
    description: '验证所有依赖包已正确安装'
  },
  {
    name: '运行测试',
    command: 'npm test',
    description: '确保代码质量'
  },
  {
    name: '优化资源',
    command: 'npm run optimize',
    description: '压缩图片并优化配置'
  },
  {
    name: '构建项目',
    command: 'npm run build',
    description: '生成生产版本'
  }
];

let currentStep = 0;

function runStep(step) {
  currentStep++;
  console.log(`\n📋 步骤 ${currentStep}/${steps.length}: ${step.name}`);
  console.log(`📝 ${step.description}`);
  console.log(`⚡ 执行: ${step.command}\n`);
  
  try {
    execSync(step.command, { 
      stdio: 'inherit',
      cwd: process.cwd()
    });
    console.log(`✅ ${step.name} 完成`);
  } catch (error) {
    console.error(`❌ ${step.name} 失败:`, error.message);
    
    // 提供故障排除建议
    if (step.name === '检查依赖') {
      console.log('\n💡 建议: 运行 "npm install" 安装依赖');
    } else if (step.name === '运行测试') {
      console.log('\n💡 建议: 检查测试文件或跳过测试 (使用 --skip-tests 参数)');
    } else if (step.name === '优化资源') {
      console.log('\n💡 建议: 检查图片文件是否存在，或手动运行 "npm run compress-images"');
    } else if (step.name === '构建项目') {
      console.log('\n💡 建议: 检查代码语法错误或依赖问题');
    }
    
    process.exit(1);
  }
}

// 检查命令行参数
const args = process.argv.slice(2);
const skipTests = args.includes('--skip-tests');
const skipOptimize = args.includes('--skip-optimize');

// 执行部署步骤
try {
  // 步骤1: 检查依赖
  runStep(steps[0]);
  
  // 步骤2: 运行测试 (可跳过)
  if (!skipTests) {
    runStep(steps[1]);
  } else {
    console.log('\n⏭️  跳过测试步骤');
  }
  
  // 步骤3: 优化资源 (可跳过)
  if (!skipOptimize) {
    runStep(steps[2]);
  } else {
    console.log('\n⏭️  跳过优化步骤');
  }
  
  // 步骤4: 构建项目
  runStep(steps[3]);
  
  // 部署成功
  console.log('\n🎉 部署准备完成！');
  console.log('\n📊 部署统计:');
  
  // 读取部署清单
  if (fs.existsSync('./deployment-manifest.json')) {
    const manifest = JSON.parse(fs.readFileSync('./deployment-manifest.json', 'utf8'));
    console.log(`📸 图片优化: ${manifest.imageOptimization.fileCount} 个文件`);
    console.log(`💾 大小减少: ${manifest.imageOptimization.reduction}`);
    console.log(`🕒 优化时间: ${new Date(manifest.timestamp).toLocaleString()}`);
  }
  
  // 检查构建输出
  if (fs.existsSync('./dist')) {
    const distFiles = fs.readdirSync('./dist');
    console.log(`📦 构建文件: ${distFiles.length} 个文件`);
  }
  
  console.log('\n🚀 下一步:');
  console.log('1. 将 dist 目录部署到 Netlify');
  console.log('2. 或运行 "netlify deploy --prod" (如果已配置 Netlify CLI)');
  console.log('3. 或推送到 GitHub 触发自动部署');
  
} catch (error) {
  console.error('\n❌ 部署流程失败:', error.message);
  process.exit(1);
}

console.log('\n✨ 部署脚本执行完成！');