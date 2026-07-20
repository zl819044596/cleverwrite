# CleverWrite 首页布局补全

## 背景
tools.getfitai.io 首页（index.astro）当前版本比之前在线版本精简太多，缺少导航入口、页脚链接、信任条、升级弹窗等关键模块。

## 任务清单

### 1. 导航栏补充
- 增加入口：AI Detector、Paraphraser、Summarizer、Translator、Smart Rewriter、Pricing（Pro）
- 保持现有 nav-links 结构，适配响应式
- 参考文件: `src/pages/index.astro` + `src/layouts/Layout.astro`

### 2. 页脚补充
- 增加 Privacy、Pricing、Contact 链接
- 保留 "Powered by GetFitAI"
- 参考文件: `src/layouts/Layout.astro`

### 3. 添加 All Tools 网格
- 在 tool cards 下方添加 programmatic SEO tools 网格（12 个工具 pill）
- 参考之前 CF Pages 部署的版本

### 4. 添加信任条 (Trust Strip)
- 🔒 Encrypted processing
- 🚫 No storage
- 🆓 No signup
- ♾️ Unlimited usage

### 5. 添加升级弹窗 (Upgrade Modal)
- 每日 3 次免费限制
- 超限弹窗引导到 /pricing
- 样式对应当前设计系统

### 6. 导航链接更新
- 首页 nav 增加 AI Detector、Paraphraser、Smart Rewriter、Translator 入口
- Layout.astro 同步更新

## 约束
- 已有设计系统变量（--color-*, --bg-*, --text-*, --space-*）已在 Layout.astro 中
- 保持暗色模式兼容
- 不要破坏现有交互（Humanize API、暗色切换、移动菜单）
- SPA fallback 已禁用（_redirects 404），不要依赖 SPA fallback
