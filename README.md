# 墨韵智汇：南通蓝印花布全球活化方案

<div align="center">

![南通蓝印花布](https://img.shields.io/badge/文化传承-南通蓝印花布-1e3a8a?style=for-the-badge)
![AI驱动](https://img.shields.io/badge/AI驱动-DeepSeek%20%2B%20Doubao-3b82f6?style=for-the-badge)
![React](https://img.shields.io/badge/React-19.2.3-61dafb?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8.2-3178c6?style=for-the-badge&logo=typescript)

**集文化传承、智能定制、数据可视化于一体的沉浸式电商平台**

[在线演示](#) | [功能特性](#功能特性) | [快速开始](#快速开始) | [技术栈](#技术栈)

</div>

---

## 📖 项目简介

墨韵智汇是一个创新的文化传承与商业化平台，专注于南通蓝印花布的全球推广与活化。通过融合传统工艺与现代AI技术，我们为用户提供：

- 🎨 **AI智能定制**：DeepSeek-V3文化解读 + Doubao-Seedream视觉生成
- 📊 **数据可视化**：实时展示销售数据、用户分布、文化影响力
- 🌍 **全球化体验**：多语言支持（中文/英文），智能语言检测
- 🎭 **沉浸式交互**：Three.js 3D背景、水墨跟随效果、流畅动画

## ✨ 功能特性

### 🤖 AI双模型工坊

#### 1. 纹样解读（DeepSeek-V3）
- ✅ **流式输出**：实时显示文化解读内容
- ✅ **双版本**：成人版（深度解析）+ 儿童版（趣味故事）
- ✅ **HTML渲染**：支持富文本格式，标题、列表、强调
- ✅ **历史记录**：自动保存，支持恢复、删除

#### 2. 效果图生成（Doubao-Seedream）
- ✅ **双风格**：传统工艺 + 现代简约
- ✅ **草图上传**：支持用户自定义设计
- ✅ **高清输出**：2K/4K分辨率
- ✅ **历史记录**：保存生成记录，快速回溯

#### 3. 房间分析（双模型协同）
- ✅ **智能推荐**：基于房间描述推荐3种搭配方案
- ✅ **流式分析**：实时显示分析过程
- ✅ **效果预览**：自动生成首选方案效果图
- ✅ **3D预览**：选择方案后可查看3D效果（规划中）

### 📊 数据可视化仪表盘

- **销售趋势**：月度销售额折线图
- **产品分布**：品类占比饼图
- **用户地域**：全球用户分布地图
- **文化影响力**：博物馆合作、教育项目、媒体报道

### 🛍️ 产品展示

- **3D卡片翻转**：鼠标悬停查看详情
- **多场景应用**：家居装饰、服饰配饰、文创礼品
- **QR码生成**：快速分享产品链接
- **详情页面**：完整的产品信息展示

### 🌐 国际化支持

- **智能语言检测**：自动识别用户浏览器语言
- **语言建议**：首次访问时友好提示
- **无缝切换**：中英文一键切换
- **完整翻译**：所有界面元素全面本地化

## 🚀 快速开始

### 环境要求

- Node.js >= 18.0.0
- npm >= 9.0.0 或 pnpm >= 8.0.0

### 安装步骤

```bash
# 克隆项目
git clone https://github.com/your-username/nantong-blue-calico.git
cd nantong-blue-calico

# 安装依赖
npm install
# 或使用 pnpm
pnpm install

# 配置环境变量
cp .env.example .env
# 编辑 .env 文件，添加你的 API Key
```

### 环境变量配置

创建 `.env` 文件并添加以下配置：

```env
# 火山引擎 API Key（用于 DeepSeek 和 Doubao）
VITE_ARK_API_KEY=your_api_key_here
```

### 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:5173 查看应用

### 构建生产版本

```bash
npm run build
npm run preview
```

### 运行测试

```bash
# 运行所有测试
npm test

# 监听模式
npm run test:watch

# UI 模式
npm run test:ui
```

## 🛠️ 技术栈

### 前端框架
- **React 19.2.3** - 最新的React特性
- **TypeScript 5.8.2** - 类型安全
- **Vite 6.2.0** - 极速构建工具

### UI & 样式
- **Tailwind CSS 4.1.18** - 原子化CSS框架
- **Lucide React** - 精美图标库
- **Three.js 0.160.0** - 3D图形渲染

### AI 服务
- **DeepSeek-V3** - 文化解读与逻辑推理
- **Doubao-Seedream** - 图像生成
- **火山引擎 API** - 统一的AI服务接口

### 数据可视化
- **Recharts 3.6.0** - React图表库
- **QRCode.react** - 二维码生成

### 国际化
- **i18next** - 国际化框架
- **react-i18next** - React集成
- **i18next-browser-languagedetector** - 自动语言检测

### 测试
- **Vitest** - 快速的单元测试框架
- **Testing Library** - React组件测试
- **Fast-check** - 属性测试

## 📁 项目结构

```
nantong-blue-calico/
├── components/              # React组件
│   ├── AIGenerator.tsx     # AI生成器主组件
│   ├── DataDashboard.tsx   # 数据仪表盘
│   ├── ProductShowcase.tsx # 产品展示
│   ├── Hero.tsx            # 首页Hero区域
│   ├── Navbar.tsx          # 导航栏
│   ├── Footer.tsx          # 页脚
│   ├── ThreeBackground.tsx # Three.js背景
│   └── ...                 # 其他组件
├── services/               # 服务层
│   ├── deepseekService.ts  # DeepSeek API服务
│   ├── doubaoService.ts    # Doubao API服务
│   └── ...                 # 其他服务
├── data/                   # 静态数据
│   └── patterns.json       # 纹样数据
├── public/                 # 静态资源
│   └── locales/           # 国际化翻译文件
│       ├── zh/
│       └── en/
├── styles.css             # 全局样式
├── i18n.ts               # 国际化配置
├── types.ts              # TypeScript类型定义
└── App.tsx               # 应用入口
```

## 🎨 核心功能实现

### 1. 流式输出

```typescript
// DeepSeek流式API调用
const response = await fetch(url, {
  method: 'POST',
  body: JSON.stringify({ stream: true }),
});

const reader = response.body?.getReader();
const decoder = new TextDecoder();

while (true) {
  const { done, value } = await reader.read();
  if (done) break;
  
  const chunk = decoder.decode(value);
  onChunk(chunk, false); // 实时回调
}
```

### 2. 历史记录持久化

```typescript
// 使用 localStorage 保存历史记录
const STORAGE_KEYS = {
  PATTERN_HISTORY: 'ai_pattern_history',
  IMAGE_HISTORY: 'ai_image_history',
  ROOM_HISTORY: 'ai_room_history'
};

// 最多保留10条记录
const MAX_HISTORY_ITEMS = 10;
```

### 3. HTML安全渲染

```tsx
<div 
  className="prose prose-slate"
  dangerouslySetInnerHTML={{ __html: sanitizedContent }}
/>
```

### 4. 性能优化

- ✅ 懒加载重型组件（React.lazy）
- ✅ 组件记忆化（React.memo）
- ✅ Canvas替代DOM（水墨效果）
- ✅ 节流防抖（滚动、鼠标事件）

## 🌍 国际化

支持的语言：
- 🇨🇳 简体中文（默认）
- 🇺🇸 English

添加新语言：

1. 在 `public/locales/` 创建新语言文件夹
2. 复制 `zh/translation.json` 并翻译
3. 在 `i18n.ts` 中注册新语言

## 🧪 测试

```bash
# 运行所有测试
npm test

# 测试覆盖率
npm test -- --coverage

# 特定文件测试
npm test AIGenerator.test.tsx
```

测试覆盖的组件：
- ✅ AIGenerator
- ✅ DataDashboard
- ✅ ProductShowcase
- ✅ ErrorToast
- ✅ Globe3D
- ✅ DeepSeek Service
- ✅ Doubao Service

## 📝 API文档

### DeepSeek API

```typescript
// 纹样解读（流式）
await deepseekService.generatePatternExplanationStream(
  patternName: string,
  targetAudience: 'adult' | 'child',
  onChunk: (chunk: string, done: boolean) => void
);

// 房间分析（流式）
await deepseekService.analyzeRoomAndRecommendStream(
  roomDescription: string,
  onChunk: (chunk: string, done: boolean) => void
);
```

### Doubao API

```typescript
// 图像生成
await doubaoService.generatePatternImage(
  patternName: string,
  options: {
    size?: '1K' | '2K' | '4K',
    style?: 'traditional' | 'modern',
    referenceImage?: string
  }
);
```

## 🤝 贡献指南

欢迎贡献！请遵循以下步骤：

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

### 代码规范

- 使用 TypeScript 严格模式
- 遵循 ESLint 规则
- 编写单元测试
- 添加必要的注释

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 👥 团队

- **项目负责人** - 文化传承与技术创新
- **AI工程师** - DeepSeek & Doubao 集成
- **前端工程师** - React & Three.js 开发
- **UI/UX设计师** - 视觉设计与交互体验

## 📞 联系我们

- 📧 Email: contact@moyunzhihui.com
- 🌐 Website: https://moyunzhihui.com
- 💬 微信公众号: 墨韵智汇

## 🙏 致谢

- 南通蓝印花布博物馆 - 提供文化资料与专业指导
- 火山引擎 - 提供AI服务支持
- 开源社区 - 提供优秀的工具和库

---

<div align="center">

**用科技传承文化，让传统焕发新生** 🎨

Made with ❤️ by 墨韵智汇团队

</div>
