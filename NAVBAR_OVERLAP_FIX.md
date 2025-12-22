# 页眉与首页重叠问题修复

## 问题描述
固定定位的Navbar与Hero部分内容重叠，导致标题和导航栏文字叠加在一起。

## 根本原因
1. Navbar使用 `fixed` 定位，脱离文档流
2. Hero部分没有足够的顶部padding来为Navbar留出空间
3. 滚动锚点没有考虑固定导航栏的高度

## 修复方案

### 1. 优化Navbar背景
```tsx
// 修改前
className={`... ${isScrolled ? 'bg-slate-50/90 backdrop-blur-md shadow-sm py-4' : 'bg-transparent py-6'}`}

// 修改后
className={`... ${isScrolled ? 'bg-slate-50/95 backdrop-blur-md shadow-md py-3' : 'bg-slate-50/80 backdrop-blur-sm py-5'}`}
```

**改进点：**
- 初始状态添加半透明背景（80%），避免完全透明导致可读性问题
- 滚动后增加背景不透明度到95%
- 调整padding使导航栏更紧凑

### 2. Hero部分添加顶部间距
```tsx
// 修改前
<section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-slate-50">
  <div className="relative z-10 text-center px-4 max-w-4xl mx-auto select-none">

// 修改后
<section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-slate-50">
  <div className="relative z-10 text-center px-4 max-w-4xl mx-auto select-none pt-20 pb-10">
```

**改进点：**
- 内容容器添加 `pt-20`（80px）顶部padding
- 添加 `pb-10`（40px）底部padding保持平衡
- 确保内容不会被Navbar遮挡

### 3. 全局滚动优化
```css
/* 平滑滚动 + 固定导航栏偏移 */
html {
  scroll-behavior: smooth;
  scroll-padding-top: 80px;
}

/* 所有锚点section添加滚动边距 */
section[id] {
  scroll-margin-top: 80px;
}

/* Hero特殊处理 */
#hero {
  min-height: 100vh;
  padding-top: 80px;
}
```

**改进点：**
- `scroll-padding-top`: 滚动时自动为固定导航栏留出空间
- `scroll-margin-top`: 锚点跳转时的偏移量
- 确保点击导航链接时内容不会被遮挡

### 4. 响应式调整
```css
@media (max-width: 768px) {
  html {
    scroll-padding-top: 70px;
  }
  
  section[id] {
    scroll-margin-top: 70px;
  }
  
  #hero {
    padding-top: 70px;
  }
}
```

**改进点：**
- 移动端使用较小的偏移量（70px）
- 适配移动端导航栏高度

## 技术细节

### Navbar高度计算
- 未滚动状态：`py-5` = 20px × 2 = 40px padding + 内容高度 ≈ 70-80px
- 滚动后状态：`py-3` = 12px × 2 = 24px padding + 内容高度 ≈ 60-70px
- 安全偏移量：80px（覆盖最大高度）

### Z-index层级
```
Navbar: z-50 (固定在顶部)
Hero内容: z-10 (在Three.js背景之上)
Three.js背景: z-0 (默认)
```

### 背景透明度策略
- **初始状态**: `bg-slate-50/80` - 80%不透明度
  - 保持可读性
  - 轻微透明效果展示背景
- **滚动后**: `bg-slate-50/95` - 95%不透明度
  - 更强的对比度
  - 更好的可读性

## 视觉效果

### 修复前
```
┌─────────────────────────────┐
│ [Logo] 墨韵智汇：南通蓝印花布 │ ← Navbar (透明，重叠)
│                             │
│   墨韵智汇：南通蓝印花布      │ ← Hero标题 (被遮挡)
│   全球活化                   │
└─────────────────────────────┘
```

### 修复后
```
┌─────────────────────────────┐
│ [Logo] 墨韵智汇 (半透明背景)  │ ← Navbar (清晰可见)
├─────────────────────────────┤
│                             │ ← 80px 间距
│   墨韵智汇：南通蓝印花布      │ ← Hero标题 (完整显示)
│   全球活化                   │
│                             │
└─────────────────────────────┘
```

## 测试检查清单

- [x] 页面加载时Navbar不遮挡Hero内容
- [x] 滚动时Navbar背景正确变化
- [x] 点击导航链接时内容不被遮挡
- [x] 移动端布局正常
- [x] 平滑滚动效果正常
- [x] 所有section锚点跳转正确

## 浏览器兼容性

- Chrome/Edge: ✅ 完全支持
- Firefox: ✅ 完全支持
- Safari: ✅ 完全支持
- 移动浏览器: ✅ 支持（已添加响应式处理）

## 性能影响

- ✅ 无额外JavaScript计算
- ✅ 纯CSS解决方案
- ✅ 不影响渲染性能
- ✅ backdrop-blur使用GPU加速

## 未来优化建议

1. 考虑添加Navbar收缩动画
2. 优化移动端菜单展开效果
3. 添加滚动进度指示器
4. 考虑添加"回到顶部"按钮
