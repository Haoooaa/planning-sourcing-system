# 02 — 产品需求文档（PRD）

**产品名称：** ZavaShop SCM Demo  
**版本：** v0.1（原型）  
**状态：** 已实现可演示 MVP  

## 2.1 产品定位

一句话：基于 ZavaShop 样例数据的 **供应链运营中台静态原型**，用于展示信息架构与补货分析闭环，而非生产级 ERP/WMS。

## 2.2 用户与场景

### 主要用户

演示讲解者 / 产品或工程候选人 / 内部评审人。

### 核心场景

| ID | 场景 | 步骤 | 期望结果 |
|----|------|------|----------|
| S1 | 浏览库存健康度 | Home → Inventory → 按仓筛选 | 看到 `on_hand` / `reserved` / `available` / `status` |
| S2 | 跑补货分析 | Reorder Plan → 选仓或不选 → Start | Tasks 出现进度；Files 可 Preview |
| S3 | 查看在途采购 | Purchase Orders | 看到 PO 状态（`in_transit` / `delayed` 等）与 `last_event` |
| S4 | 查看履约订单 | Customer Orders → 展开行 | 看到 line items（sku / qty / price） |
| S5 | 查看主数据 | Suppliers / Warehouses | 原文字段完整可读 |

## 2.3 信息架构

```text
ZavaShop SCM
├── Home
├── Inventory
├── Reorder Plan
├── Purchase Orders
├── Customer Orders
├── Suppliers
├── Warehouses
├── Tasks
└── Files
```

无登录页；进入即 Home。

## 2.4 功能需求

### F1 Home

- 展示产品标题与数据来源说明
- 卡片跳转到六大业务模块

### F2 Inventory

- 表格展示全量库存行（仓 × SKU）
- 支持按 `warehouse` 筛选
- `status`：`healthy` / `below_reorder` / `out_of_stock`（由 available 与 reorder_point 推导）

### F3 Reorder Plan

- 可选仓库后发起分析
- 生成异步 Job（pending → running → success）
- 结果写入 Files，可 Preview
- 结果含 `note`（思考提示），**不因阈值自动删行**

### F4 Purchase Orders / Orders / Suppliers / Warehouses

- 只读表格，字段与 JSON 原文一致（可做展示层拼接，如 sku + product name）

### F5 Tasks / Files

- Tasks：任务列表、状态、进度
- Files：结果文件列表、预览、模拟下载

## 2.5 非功能需求

| 类别 | 要求 |
|------|------|
| 可用性 | 免登录；首屏可理解 |
| 性能 | 样例数据全量前端加载可接受 |
| 可部署 | 支持 hash 路由；可静态托管 |
| 可维护 | 数据与页面分离（`src/services/mock/`） |
| 合规展示 | README / SOURCE 注明数据出处；无真实 PII |

## 2.6 数据需求

| 实体 | 文件 | 关键字段 |
|------|------|----------|
| Warehouse | warehouses.json | code, name, region, capacity_pallets |
| SKU | skus.json | sku, name, category, unit_price_usd |
| Inventory | inventory.json | sku, warehouse, on_hand, reserved, reorder_point |
| Supplier | suppliers.json | supplier_id, name, specialties, preferred_incoterm |
| PO | purchase_orders.json | po_number, status, eta, last_event |
| Order | orders.json | order_id, status, lines[], ship_to_warehouse |

派生：`available = max(0, on_hand - reserved)`。

## 2.7 验收标准（Acceptance Criteria）

| AC | 描述 | 优先级 |
|----|------|--------|
| AC1 | 打开站点无需登录即可使用全部菜单 | P0 |
| AC2 | Inventory 至少展示全部 ZavaShop inventory 行 | P0 |
| AC3 | Reorder Plan 一次运行可在 Tasks 看到成功任务 | P0 |
| AC4 | Files 可预览本次分析结果行 | P0 |
| AC5 | PO / Orders / Suppliers / Warehouses 只读可用 | P0 |
| AC6 | 文档含需求→PRD→评审→上线→迭代 | P0 |
| AC7 | 不出现汽配行业强行映射文案 | P0 |

## 2.8 里程碑

| 里程碑 | 内容 | 状态 |
|--------|------|------|
| M0 | 选型：Pro 壳 + ZavaShop 数据 | 完成 |
| M1 | MVP 页面与 mock 任务闭环 | 完成 |
| M2 | 产品流程文档 | 本文档集 |
| M3 | GitHub Pages 正式发布 | 待执行（见上线文档） |
