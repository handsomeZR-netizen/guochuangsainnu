# 🚨 Netlify 500 错误快速修复

## 最可能的原因（90%+）

### ❌ 环境变量未配置

**症状：**
- Netlify Function 日志显示：`❌ VITE_ARK_API_KEY not found`
- 或者 Response Body：`{"error": "API key not configured"}`

**修复（3步）：**

1. **Netlify Dashboard** → 你的站点 → **Site settings** → **Environment variables**

2. **Add a variable**：
   ```
   Key:    VITE_ARK_API_KEY
   Value:  你的火山引擎API密钥
   Scopes: ✅ Functions (必须勾选)
   ```

3. **重新部署**（必须！）：
   ```bash
   git commit --allow-empty -m "trigger redeploy"
   git push
   ```
   或在 Netlify Dashboard → Deploys → Trigger deploy

---

## 验证修复

### 1. 查看 Function 日志
Netlify Dashboard → Functions → deepseek-proxy

**期望看到：**
```
✅ API Key found, calling DeepSeek API...
DeepSeek API response status: 200
```

### 2. 浏览器测试
DevTools → Network → 触发 AI 功能

**期望看到：**
- Status: `200 OK`
- Response Headers 包含 `x-nf-request-id`
- Response Body 有正常数据

---

## 其他可能原因（10%）

### 流式响应超时
**症状：** 请求卡住或 502 Bad Gateway

**临时修复：**
在 `services/deepseekService.ts` 中：
```typescript
stream: false  // 改为 false
```

### 火山引擎 API 错误
**症状：** Response Body 包含 `errID` 或 `logID`

**修复：**
1. 记录 `errID` 和 `logID`
2. 检查请求参数（model 名称、消息格式）
3. 联系火山引擎技术支持

---

## 快速测试命令

```bash
# 测试 Function 是否可访问
curl -X POST https://你的域名.netlify.app/.netlify/functions/deepseek-proxy \
  -H "Content-Type: application/json" \
  -d '{"model":"deepseek-v3-2-251201","messages":[{"role":"user","content":"测试"}]}'
```

**期望返回：**
```json
{"choices":[{"message":{"content":"..."}}]}
```

---

## 需要更多帮助？

查看详细文档：
- 📖 [NETLIFY_500_DEBUG_GUIDE.md](./NETLIFY_500_DEBUG_GUIDE.md)
- ✅ [NETLIFY_DEPLOYMENT_CHECKLIST.md](./NETLIFY_DEPLOYMENT_CHECKLIST.md)

或提供以下信息寻求帮助：
1. Netlify Function 日志截图
2. 浏览器 Network 请求详情
3. 环境变量配置截图（隐藏密钥值）
