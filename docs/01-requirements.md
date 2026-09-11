# 01 — 需求分析（Requirements Analysis）

## 1.1 项目背景

需要一个可公开展示的 **供应链中台原型**，用于说明：

- 如何用现成中后台框架快速搭壳（Ant Design Pro）
- 如何接入开源/教学向的供应链样例数据（Microsoft ZavaShop）
- 如何在无真实后端的前提下，演示「查询 → 分析 → 异步任务 → 结果文件」闭环

ZavaShop 本身是微软 Agent Framework 工作坊中的**虚构全球电商**，不是真实商城站点；本原型只复用其 `workshop/data` 主数据与单据样例，不引入汽配等其它行业映射。

## 1.2 干系人

| 角色 | 诉求 |
|------|------|
| 产品负责人 | 有清晰演示故事与文档，可对外讲解 |
| 前端/全栈 | 可本地运行、可静态部署、改动成本低 |
| 评审人/面试官/合作方 | 5–10 分钟内看懂范围与能力边界 |
| 终端用户（演示态） | 免登录，点菜单即可见数据与流程 |

## 1.3 问题陈述

| 编号 | 问题 | 影响 |
|------|------|------|
| P1 | 从零画供应链中台成本高 | 演示周期长 |
| P2 | 缺少一致、可引用的样例主数据 | 页面字段空洞、不可复现 |
| P3 | 真实后端与权限体系过重 | 不利于 GitHub Pages 静态展示 |
| P4 | 规则若写死阈值，难讲「运营判断」 | 产品叙事僵硬 |

## 1.4 目标与成功标准

**目标（Goal）**

1. 提供可交互的供应链演示壳：库存、补货分析、采购单、订单、供应商、仓库、任务与文件。
2. 数据字段与取值保持 ZavaShop 原文（如 `on_hand`、`reorder_point`、`SEA-01`）。
3. 文档覆盖完整产品流程，便于评审与后续迭代。

**成功标准（Success Metrics — 定性）**

- [ ] 本地 `npm start` 后可在 1 分钟内进入首页并浏览核心菜单
- [ ] Reorder Plan 可生成异步任务并在 Files 中预览结果
- [ ] 文档五阶段齐全，评审可据此签字/提意见

## 1.5 范围（In Scope）

- 免登录演示账号
- 只读主数据页：Inventory / Warehouses / Suppliers / Purchase Orders / Customer Orders
- 可交互：Reorder Plan（分析任务 + 结果文件）、Tasks、Files
- 静态部署能力（hash 路由 + 构建产物）

## 1.6 非目标（Out of Scope）

- 真实登录、权限、多租户
- 对接 Azure Foundry / Agent Framework（工作坊 LAB 本体）
- 真实 Excel 解析、真实订货算法、真实支付/物流 API
- 把业务规则做成不可配置的硬过滤引擎

## 1.7 约束与假设

| 类型 | 内容 |
|------|------|
| 约束 | 优先 GitHub Pages；无服务端数据库 |
| 约束 | 基于已 fork 的 Ant Design Pro v6 |
| 假设 | 演示数据量小（十余 SKU、五仓），全部可打包进前端 |
| 假设 | 观众接受英文字段名作为「原样展示」 |

## 1.8 依赖

- UI：Ant Design Pro / Ant Design / ProComponents
- 数据：ZavaShop `workshop/data` JSON
- 运行：Node.js + npm；部署可选 GitHub Actions + gh-pages
