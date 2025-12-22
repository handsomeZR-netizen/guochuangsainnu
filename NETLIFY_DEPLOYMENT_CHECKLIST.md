# Netlify 部署检查清单 - 解决 500 错误

## 🎯 问题定位

你的 500 错误最可能的原因（按概率排序）：

1. **环境变量未配置**（80% 概率）
2. **流式响应处理问题**（15% 概率）
3. **火山引擎 API 本身问题**（5% 概率）

---

## ✅ 部署前检查清单

### 1. 本地测试（可选但推荐）

```bash
# 设置环境变量
export VITE_ARK_API_KEY=你的密钥

# 运行测试脚本
node test-netlify-function.js
```

如果本地测试失败，说明 API 密钥或网络有问题，不要部署。

---

### 2. Netlify 环境变量配置（必须）

#### 步骤：
1. 登录 [Netlify Dashboard](https://app.netlify.com/)
2. 选择你的站点
3. 进入 **Site settings** → **Environment variables**
4. 点击 **Add a variable**
5. 添加：
   - **Key**: `VITE_ARK_API_KEY`
   - **Value**: 你的火山引擎 API 密钥
   - **Scopes**: 选择 `All scopes` 或至少 `Functions`

#### 验证：
- [ ] 变量名完全匹配：`VITE_ARK_API_KEY`（区分大小写）
- [ ] 密钥没有多余的空格或换行
- [ ] Scopes 包含 `Functions`

---

### 3. 部署代码

```bash
# 提交修复后的代码
git add netlify/functions/
git commit -m "fix: 修复 Netlify Functions 流式响应和错误处理"
git push origin main
```

Netlify 会自动触发部署。

---

### 4. 部署后验证

#### A. 检查 Function 日志

1. Netlify Dashboard → 你的站点 → **Functions** 标签
2. 点击 `deepseek-proxy` 函数
3. 查看 **Recent invocations**

**期望看到的日志：**
```
✅ API Key found, calling DeepSeek API...
Request body: { "model": "deepseek-v3-2-251201", ... }
DeepSeek API response status: 200
```

**如果看到错误日志：**
```
❌ VITE_ARK_API_KEY not found in environment variables
Available env keys: [...]
```
→ 说明环境变量未生效，需要重新部署（修改环境变量后必须重新部署）

#### B. 浏览器测试

1. 打开你的网站
2. 打开 DevTools → Network 标签
3. 触发一个 AI 功能（例如点击"生成解读"）
4. 找到 `deepseek-proxy` 请求

**检查项：**
- [ ] Request URL 是 `https://你的域名.netlify.app/.netlify/functions/deepseek-proxy`
- [ ] Status 是 200（不是 500）
- [ ] Response Headers 包含 `x-nf-request-id`（证明是 Netlify 返回的）
- [ ] Response 有正确的数据

**如果仍然 500：**
1. 查看 Response Body，里面会有错误信息
2. 对照下面的"常见错误"部分

---

## 🔧 常见错误和解决方法

### 错误 1: "API key not configured"

**原因：** 环境变量未配置或未生效

**解决：**
1. 确认 Netlify 环境变量已添加
2. **重新部署**（修改环境变量后必须重新部署）
   - 方法 1: 推送新的 commit
   - 方法 2: Netlify Dashboard → Deploys → Trigger deploy → Deploy site

### 错误 2: 流式响应卡住或超时

**原因：** Netlify Functions 有 10 秒超时限制

**解决：**
- 短期：在前端禁用流式（`stream: false`）
- 长期：优化 prompt 长度，或考虑使用 Netlify Edge Functions（无超时限制）

### 错误 3: CORS 错误

**原因：** 浏览器预检请求失败

**解决：**
- 已在修复后的代码中添加 OPTIONS 处理
- 确保部署了最新代码

### 错误 4: 火山引擎返回 500

**特征：** Response Body 包含 `errID` 或 `logID`

**解决：**
1. 记录 `errID` 和 `logID`
2. 检查请求参数是否正确（model 名称、消息格式等）
3. 联系火山引擎技术支持，提供 `errID`

---

## 📊 快速诊断流程图

```
500 错误
  │
  ├─ Response Body 有 "API key not configured"
  │   → 环境变量未配置 → 去 Netlify 添加环境变量 → 重新部署
  │
  ├─ Response Body 有 "Internal server error"
  │   → 查看 Netlify Function 日志 → 根据具体错误修复
  │
  ├─ Response Body 有 errID/logID
  │   → 火山引擎 API 错误 → 检查请求参数 → 联系火山引擎支持
  │
  └─ Response Headers 没有 x-nf-request-id
      → 不是 Netlify 返回的 → 检查前端请求 URL
```

---

## 🚀 部署后测试命令

```bash
# 测试 Function 是否可访问
curl -X POST https://你的域名.netlify.app/.netlify/functions/deepseek-proxy \
  -H "Content-Type: application/json" \
  -d '{"model":"deepseek-v3-2-251201","messages":[{"role":"user","content":"测试"}]}'

# 期望返回：
# {"choices":[{"message":{"content":"..."}}]}

# 如果返回 500，查看错误信息
```

---

## 📞 需要帮助？

如果按照上述步骤仍然无法解决，请提供以下信息：

1. **Netlify Function 日志截图**（最重要）
2. **浏览器 Network 中的请求详情**：
   - Request URL
   - Request Headers
   - Request Payload
   - Response Headers
   - Response Body
3. **环境变量配置截图**（隐藏密钥值）

有了这些信息，可以精确定位问题。
