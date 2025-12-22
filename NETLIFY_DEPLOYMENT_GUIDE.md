# Netlify 部署完整指南

## 🚨 重要：环境变量配置

你遇到的 `ERR_CONNECTION_CLOSED` 错误是因为 **API Key 没有配置到 Netlify**。

### 必须配置的环境变量

在 Netlify 部署之前，必须添加以下环境变量：

1. 登录 Netlify Dashboard
2. 进入你的站点设置
3. 导航到：**Site settings > Environment variables**
4. 点击 **Add a variable**
5. 添加：
   - **Key**: `VITE_ARK_API_KEY`
   - **Value**: `你的火山引擎API Key`（从 .env 文件复制）
   - **Scopes**: 选择所有环境（Production, Deploy Previews, Branch deploys）

⚠️ **注意**：添加环境变量后需要重新部署才能生效！

## 📋 部署步骤

### 方法1：通过 Netlify UI 部署（推荐）

#### 步骤1：连接 GitHub 仓库

1. 访问 https://app.netlify.com/
2. 点击 **Add new site > Import an existing project**
3. 选择 **GitHub**
4. 授权 Netlify 访问你的 GitHub
5. 选择仓库：`handsomeZR-netizen/guochuangsainnu`

#### 步骤2：配置构建设置

Netlify 会自动检测到 `netlify.toml`，但请确认：

- **Branch to deploy**: `main`
- **Build command**: `npm run build`
- **Publish directory**: `dist`
- **Node version**: 18

#### 步骤3：添加环境变量 ⚠️ 重要！

在部署之前，必须先配置环境变量：

1. 在站点设置页面，点击 **Site settings**
2. 左侧菜单选择 **Environment variables**
3. 点击 **Add a variable**
4. 添加：
   ```
   Key: VITE_ARK_API_KEY
   Value: dd4005ed-548b-45bb-93be-e38b072818e5
   ```
5. 选择所有环境（Production, Deploy Previews, Branch deploys）
6. 点击 **Create variable**

#### 步骤4：部署

1. 点击 **Deploy site**
2. 等待构建完成（约2-3分钟）
3. 访问生成的 URL（如：`https://your-site-name.netlify.app`）

### 方法2：通过 Netlify CLI 部署

```bash
# 安装 Netlify CLI
npm install -g netlify-cli

# 登录 Netlify
netlify login

# 初始化站点
netlify init

# 设置环境变量
netlify env:set VITE_ARK_API_KEY "dd4005ed-548b-45bb-93be-e38b072818e5"

# 部署
netlify deploy --prod
```

## 🔧 解决当前问题

### 问题1：API 调用失败

**错误信息**：
```
Failed to load resource: net::ERR_CONNECTION_CLOSED
```

**原因**：环境变量 `VITE_ARK_API_KEY` 未配置

**解决方案**：
1. 在 Netlify 添加环境变量（见上方步骤3）
2. 重新部署站点：
   - 进入 **Deploys** 标签
   - 点击 **Trigger deploy > Clear cache and deploy site**

### 问题2：图表宽度/高度为0

**错误信息**：
```
The width(0) and height(0) of chart should be greater than 0
```

**原因**：Recharts 在初始渲染时容器尺寸未就绪

**解决方案**：已在代码中处理，这是警告信息，不影响功能

### 问题3：React DevTools 提示

**信息**：
```
Download the React DevTools for a better development experience
```

**说明**：这只是开发提示，不影响生产环境

## ✅ 验证部署

部署成功后，检查以下功能：

### 1. 基础功能
- [ ] 页面正常加载
- [ ] 导航栏工作正常
- [ ] 语言切换功能
- [ ] 滚动动画流畅

### 2. AI 功能（需要 API Key）
- [ ] 纹样解读能正常生成
- [ ] 效果图生成能正常工作
- [ ] 房间分析能返回推荐
- [ ] 历史记录能正常保存

### 3. 数据可视化
- [ ] 图表正常显示
- [ ] 数据正确渲染
- [ ] 交互功能正常

### 4. 性能
- [ ] 首屏加载时间 < 3秒
- [ ] Lighthouse 分数 > 90

## 🔍 调试技巧

### 查看构建日志

1. 进入 Netlify Dashboard
2. 点击 **Deploys**
3. 选择最新的部署
4. 查看 **Deploy log**

### 查看环境变量

```bash
# 使用 Netlify CLI
netlify env:list
```

### 本地测试生产构建

```bash
# 构建生产版本
npm run build

# 预览生产版本
npm run preview

# 测试 API 调用
# 确保 .env 文件中有正确的 API Key
```

## 🚀 优化建议

### 1. 自定义域名

1. 在 Netlify Dashboard 点击 **Domain settings**
2. 点击 **Add custom domain**
3. 输入你的域名
4. 按照提示配置 DNS

### 2. 启用 HTTPS

Netlify 自动提供免费 SSL 证书，无需额外配置。

### 3. 配置 CDN

Netlify 自动使用全球 CDN，无需额外配置。

### 4. 性能优化

在 `netlify.toml` 中已配置：
- 静态资源缓存
- 安全头部
- SPA 路由支持

### 5. 监控和分析

启用 Netlify Analytics：
1. 进入 **Analytics** 标签
2. 点击 **Enable Analytics**

## 📊 构建配置详解

### netlify.toml 配置说明

```toml
[build]
  command = "npm run build"    # 构建命令
  publish = "dist"             # 输出目录
  
[build.environment]
  NODE_VERSION = "18"          # Node.js 版本

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200                 # SPA 路由支持

[[headers]]
  for = "/assets/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"  # 静态资源缓存1年
```

## 🔐 安全建议

### 1. 保护 API Key

- ✅ 使用环境变量
- ✅ 不要提交到 Git
- ✅ 定期轮换密钥
- ❌ 不要在客户端代码中硬编码

### 2. 配置安全头部

已在 `netlify.toml` 中配置：
- X-Frame-Options
- X-XSS-Protection
- X-Content-Type-Options
- Referrer-Policy

### 3. CORS 配置

如果遇到 CORS 问题，在 `netlify.toml` 添加：

```toml
[[headers]]
  for = "/*"
  [headers.values]
    Access-Control-Allow-Origin = "*"
```

## 🐛 常见问题

### Q1: 部署成功但页面空白

**A**: 检查浏览器控制台错误，通常是路径问题。确保 `vite.config.ts` 中的 `base` 配置正确。

### Q2: API 调用在本地工作但部署后失败

**A**: 确认环境变量已正确配置到 Netlify，并重新部署。

### Q3: 构建失败

**A**: 检查构建日志，常见原因：
- Node 版本不匹配
- 依赖安装失败
- TypeScript 类型错误

### Q4: 图片或资源加载失败

**A**: 确保资源路径正确，使用相对路径或 `import` 导入。

## 📞 获取帮助

- Netlify 文档: https://docs.netlify.com/
- Netlify 社区: https://answers.netlify.com/
- Vite 文档: https://vitejs.dev/

## ✨ 部署后的 URL

部署成功后，你会得到一个类似这样的 URL：
```
https://guochuangsainnu.netlify.app
```

或者自定义域名：
```
https://moyunzhihui.com
```

---

## 🎯 快速检查清单

部署前确认：
- [ ] 代码已推送到 GitHub
- [ ] `netlify.toml` 文件已创建
- [ ] `.env` 文件在 `.gitignore` 中
- [ ] 环境变量已添加到 Netlify
- [ ] 构建命令正确（`npm run build`）
- [ ] 输出目录正确（`dist`）

部署后验证：
- [ ] 网站能正常访问
- [ ] AI 功能能正常使用
- [ ] 图表正常显示
- [ ] 移动端体验良好
- [ ] 性能达标（Lighthouse > 90）

---

**记住**：每次修改环境变量后，都需要重新部署才能生效！
