# CORS 问题修复指南

## 🔴 问题原因

你遇到的 `ERR_CONNECTION_CLOSED` 错误是因为：

### 1. CORS（跨域资源共享）限制
火山引擎的API不允许直接从浏览器调用，因为：
- 浏览器会发送 `Origin` 头部
- 火山引擎API服务器没有设置 `Access-Control-Allow-Origin` 响应头
- 浏览器阻止了跨域请求

### 2. 为什么本地开发可以工作？
- 本地开发时，你的前端和API在同一个域（localhost）
- 或者你使用了开发代理（Vite proxy）

### 3. 为什么部署后不工作？
- 部署后，前端在 `https://your-site.netlify.app`
- API在 `https://ark.cn-beijing.volces.com`
- 不同域名 = 跨域请求 = 被浏览器阻止

## ✅ 解决方案：Netlify Functions 代理

### 工作原理

```
浏览器 → Netlify Functions → 火山引擎API
        (同域请求)      (服务器请求，无CORS限制)
```

### 实现步骤

#### 1. 创建 Netlify Functions

已创建两个代理函数：
- `netlify/functions/deepseek-proxy.ts` - DeepSeek API代理
- `netlify/functions/doubao-proxy.ts` - Doubao API代理

#### 2. 更新服务层代码

修改了 `deepseekService.ts` 和 `doubaoService.ts`：

```typescript
// 自动检测环境
const isProduction = typeof window !== 'undefined' && 
                     window.location.hostname !== 'localhost';

// 生产环境使用 Netlify Functions
this.baseURL = isProduction 
  ? '/.netlify/functions'  // Netlify Functions
  : 'https://ark.cn-beijing.volces.com/api/v3';  // 直接调用
```

#### 3. 配置 netlify.toml

```toml
[build]
  functions = "netlify/functions"  # Functions 目录
```

## 📦 部署步骤

### 1. 安装依赖

```bash
npm install
```

### 2. 提交代码

```bash
git add .
git commit -m "fix: 添加Netlify Functions解决CORS问题"
git push origin main
```

### 3. Netlify 自动部署

Netlify 会自动：
1. 检测到 `netlify/functions` 目录
2. 编译 TypeScript Functions
3. 部署 Functions 到 `/.netlify/functions/` 路径

### 4. 验证

部署完成后，API调用会自动路由到：
- `https://your-site.netlify.app/.netlify/functions/deepseek-proxy`
- `https://your-site.netlify.app/.netlify/functions/doubao-proxy`

## 🔍 调试

### 查看 Functions 日志

1. 进入 Netlify Dashboard
2. 点击 **Functions** 标签
3. 选择函数查看日志

### 本地测试 Functions

```bash
# 安装 Netlify CLI
npm install -g netlify-cli

# 本地运行（包括 Functions）
netlify dev
```

这会在本地启动：
- 前端：http://localhost:8888
- Functions：http://localhost:8888/.netlify/functions/

## 📊 对比

### 修复前
```
浏览器 → 火山引擎API ❌ CORS错误
```

### 修复后
```
浏览器 → Netlify Functions → 火山引擎API ✅ 成功
```

## 🎯 其他说明

### 图表警告
```
The width(0) and height(0) of chart should be greater than 0
```
这是 Recharts 的初始化警告，不影响功能。图表会在容器尺寸就绪后正常渲染。

### React DevTools
```
Download the React DevTools for a better development experience
```
这只是开发提示，不影响生产环境。

## 🚀 预期结果

修复后，所有AI功能都能正常工作：
- ✅ 纹样解读（DeepSeek）
- ✅ 效果图生成（Doubao）
- ✅ 房间分析（DeepSeek + Doubao）
- ✅ 历史记录保存
- ✅ 流式输出

## 💡 技术细节

### Netlify Functions 特点

1. **无服务器**：按需执行，无需管理服务器
2. **自动扩展**：根据流量自动扩展
3. **同域请求**：与前端在同一域名，无CORS问题
4. **环境变量**：自动注入 Netlify 配置的环境变量

### 安全性

- ✅ API Key 保存在服务器端（Netlify Functions）
- ✅ 不会暴露在客户端代码中
- ✅ 浏览器无法直接访问 API Key

### 性能

- ⚡ Netlify Functions 部署在全球CDN
- ⚡ 低延迟
- ⚡ 自动缓存

## 🔗 相关资源

- [Netlify Functions 文档](https://docs.netlify.com/functions/overview/)
- [CORS 详解](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/CORS)
- [火山引擎 API 文档](https://www.volcengine.com/docs/82379)

---

**总结**：通过 Netlify Functions 作为代理，我们绕过了浏览器的CORS限制，同时保护了API密钥的安全。
