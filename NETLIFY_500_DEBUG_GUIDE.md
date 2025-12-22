# Netlify 上火山引擎 API 500 错误排查指南

## 🔍 当前问题分析

你的项目已经有 Netlify Functions，但可能遇到以下问题导致 500 错误：

### 1. **环境变量问题**（最常见）
- Netlify Functions 使用 `Netlify.env.get()` 而不是 `process.env`
- 环境变量名称：`VITE_ARK_API_KEY`
- **必须在 Netlify 后台配置**，不是 `.env` 文件

### 2. **流式响应未正确处理**
- 你的 `deepseekService.ts` 支持流式输出（`stream: true`）
- 但 Netlify Function 没有正确转发流式响应
- 这会导致客户端无法正确解析响应

### 3. **CORS 预检请求**
- Functions 缺少 OPTIONS 方法处理
- 浏览器会先发送 OPTIONS 预检，如果失败会导致实际请求无法发送

---

## 🛠️ 立即排查步骤

### 步骤 1：确认 500 来源
打开浏览器 DevTools → Network，找到失败的请求：

```
查看 Request URL：
- 如果是 `https://你的域名.netlify.app/.netlify/functions/deepseek-proxy`
  → 500 来自 Netlify Function（继续步骤 2）
  
- 如果是 `https://ark.cn-beijing.volces.com/...`
  → 500 来自火山引擎（检查签名/参数）
```

### 步骤 2：查看 Netlify Function 日志
1. 登录 Netlify Dashboard
2. 进入你的站点 → Functions 标签
3. 点击 `deepseek-proxy` 查看实时日志
4. **关键信息**：
   - 是否有 "API key not configured" 错误？
   - 是否有网络超时？
   - 是否有 JSON 解析错误？

### 步骤 3：检查环境变量配置
1. Netlify Dashboard → Site settings → Environment variables
2. 确认 `VITE_ARK_API_KEY` 已配置
3. **注意**：修改环境变量后需要重新部署！

---

## ✅ 修复方案

### 方案 A：修复流式响应支持（推荐）

你的 Function 需要正确转发流式响应。我已经为你准备了修复后的代码。

### 方案 B：禁用流式输出（快速临时方案）

如果急需上线，可以先在 `deepseekService.ts` 中禁用流式：

```typescript
// 临时修改：强制使用非流式 API
stream: false  // 改为 false
```

---

## 📋 完整检查清单

- [ ] Netlify 环境变量 `VITE_ARK_API_KEY` 已配置
- [ ] 环境变量配置后已重新部署
- [ ] Netlify Function 日志中没有 "API key not configured"
- [ ] 浏览器 Network 中看到请求到达 `/.netlify/functions/deepseek-proxy`
- [ ] Response Headers 中有 `x-nf-request-id`（证明是 Netlify 返回的）
- [ ] 如果使用流式，Function 正确处理了 `stream: true`

---

## 🔧 常见错误码含义

| 错误 | 来源 | 原因 | 解决方法 |
|------|------|------|----------|
| 500 + "API key not configured" | Netlify Function | 环境变量未配置 | 在 Netlify 后台添加 `VITE_ARK_API_KEY` |
| 500 + "Internal server error" | Netlify Function | Function 代码错误 | 查看 Function 日志 |
| 500 + errID/logID | 火山引擎 | API 参数/签名错误 | 检查请求体格式 |
| 502 Bad Gateway | Netlify | Function 超时（10秒） | 优化请求或增加超时 |
| 405 Method Not Allowed | Netlify Function | 使用了 GET 而非 POST | 检查前端请求方法 |

---

## 🚀 下一步

1. 我会为你修复 Netlify Functions 代码（支持流式 + CORS）
2. 你需要在 Netlify 后台配置环境变量
3. 重新部署后测试

准备好了吗？
