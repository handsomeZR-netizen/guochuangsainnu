# GitHub 仓库设置指南

## 步骤1：在GitHub上创建新仓库

1. 访问 https://github.com/new
2. 填写仓库信息：
   - **Repository name**: `nantong-blue-calico`
   - **Description**: 墨韵智汇：南通蓝印花布全球活化方案 - 集文化传承、智能定制、数据可视化于一体的沉浸式电商平台
   - **Visibility**: Public（或 Private）
   - **不要**勾选 "Initialize this repository with a README"
   - **不要**添加 .gitignore 或 license（我们已经有了）

3. 点击 "Create repository"

## 步骤2：连接本地仓库到GitHub

复制GitHub提供的仓库URL，然后在终端执行：

```bash
# 添加远程仓库（替换为你的GitHub用户名）
git remote add origin https://github.com/YOUR_USERNAME/nantong-blue-calico.git

# 或使用SSH（推荐）
git remote add origin git@github.com:YOUR_USERNAME/nantong-blue-calico.git

# 推送代码到GitHub
git branch -M main
git push -u origin main
```

## 步骤3：验证推送

访问你的GitHub仓库页面，确认所有文件已成功上传。

## 步骤4：配置GitHub Pages（可选）

如果想要部署静态网站：

1. 进入仓库的 Settings > Pages
2. Source 选择 "GitHub Actions"
3. 创建 `.github/workflows/deploy.yml` 文件（见下方）

### GitHub Actions 部署配置

创建 `.github/workflows/deploy.yml`：

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build
        run: npm run build
        env:
          VITE_ARK_API_KEY: ${{ secrets.VITE_ARK_API_KEY }}
      
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./dist

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

### 配置Secrets

1. 进入仓库的 Settings > Secrets and variables > Actions
2. 点击 "New repository secret"
3. 添加：
   - Name: `VITE_ARK_API_KEY`
   - Value: 你的火山引擎API Key

## 步骤5：添加仓库描述和标签

在GitHub仓库页面：

1. 点击右上角的 ⚙️ 图标
2. 添加 Topics（标签）：
   - `react`
   - `typescript`
   - `ai`
   - `deepseek`
   - `cultural-heritage`
   - `e-commerce`
   - `data-visualization`
   - `three-js`
   - `i18n`

## 步骤6：创建README徽章（可选）

在README.md顶部添加更多徽章：

```markdown
![Build Status](https://github.com/YOUR_USERNAME/nantong-blue-calico/workflows/Deploy%20to%20GitHub%20Pages/badge.svg)
![License](https://img.shields.io/github/license/YOUR_USERNAME/nantong-blue-calico)
![Stars](https://img.shields.io/github/stars/YOUR_USERNAME/nantong-blue-calico)
```

## 常用Git命令

```bash
# 查看状态
git status

# 查看提交历史
git log --oneline

# 创建新分支
git checkout -b feature/new-feature

# 推送新分支
git push -u origin feature/new-feature

# 拉取最新代码
git pull origin main

# 查看远程仓库
git remote -v
```

## 协作开发流程

1. Fork 仓库
2. Clone 到本地
3. 创建特性分支
4. 提交更改
5. 推送到你的Fork
6. 创建Pull Request

## 问题排查

### 推送失败：认证问题

如果遇到认证问题，使用Personal Access Token：

1. 访问 https://github.com/settings/tokens
2. 生成新token（勾选 `repo` 权限）
3. 使用token作为密码

### 推送失败：文件过大

如果有大文件，使用Git LFS：

```bash
git lfs install
git lfs track "*.psd"
git add .gitattributes
git commit -m "Add Git LFS"
```

## 下一步

- [ ] 添加CI/CD流程
- [ ] 配置代码质量检查（ESLint, Prettier）
- [ ] 添加自动化测试
- [ ] 配置依赖更新机器人（Dependabot）
- [ ] 添加贡献指南（CONTRIBUTING.md）
- [ ] 添加行为准则（CODE_OF_CONDUCT.md）
