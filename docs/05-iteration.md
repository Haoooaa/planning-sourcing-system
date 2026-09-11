# 05 — 迭代（Iteration）

## 5.1 迭代原则

1. **小步发布**：每迭代可演示、可回滚  
2. **反馈驱动**：评审意见与 Issue 进 Backlog，不直接改范围外功能  
3. **数据与壳分离**：优先改 `mock/zavashop` 或 `catalog.ts`，少动布局壳  
4. **规则仍不写死**：分析类能力用备注/提示表达判断，避免硬删行

## 5.2 反馈收集

| 渠道 | 用途 |
|------|------|
| 评审会议纪要 | 范围与优先级 |
| GitHub Issues | Bug / 小需求 |
| 演示现场笔记 | 讲解卡点、文案歧义 |

Issue 标签建议：`bug` / `enhancement` / `docs` / `data` / `deploy`

## 5.3 Backlog（建议优先级）

### P1 — 下一迭代

- [ ] GitHub Pages 正式发布与 README 徽章/链接  
- [ ] 清理未挂路由的旧页面（stock-plan / kit-analysis 等残留）  
- [ ] Reorder Plan 增加「仅看 below_reorder / out_of_stock」筛选（可选，仍不删数据）  
- [ ] 中英文菜单与界面文案统一策略（当前偏英文原字段）

### P2 — 增强演示

- [ ] Contracts / Carriers 只读页（数据已在包内）  
- [ ] Dashboard：按仓汇总缺货 SKU 数  
- [ ] 导出真实 CSV/JSON 文件（替代模拟下载）  
- [ ] 简易 Playwright 冒烟：Home + Reorder 闭环

### P3 — 中长期

- [ ] 可选接入轻量 BaaS（Supabase）代替 localStorage  
- [ ] 与 ZavaShop LAB 的 Agent 能力做「概念对接」页（外链说明，不强制跑 Foundry）  
- [ ] 设计系统与品牌（自有 Logo，弱化默认 Pro 外观）

## 5.4 版本策略

| 版本 | 含义 |
|------|------|
| v0.x | 原型 / 演示 |
| v1.0 | Pages 稳定对外 + 文档闭环 + 冒烟通过 |
| v1.x | 功能增量，不破坏演示剧本 |

Commit 信息建议：`feat:` / `fix:` / `docs:` / `chore:`

## 5.5 迭代节奏（建议）

```text
每周或双周：
  收集反馈 → 排进 P1 → 实现 → 本地验收 → 文档同步 →（可选） redeploy
```

每次迭代结束更新：

1. 本文件 Backlog 勾选状态  
2. README「What's new」一小节（可选）  
3. PRD 验收表若有范围变更则改版本号

## 5.6 变更控制

| 变更类型 | 流程 |
|----------|------|
| 文案/样式 | 直接改，docs 可略 |
| 新菜单/新数据实体 | 更新 PRD 功能表 + 原型说明 |
| 改变「无登录 / 静态」约束 | 必须重新需求评审 |
| 换数据集 | 更新 SOURCE、README、评审合规项 |
