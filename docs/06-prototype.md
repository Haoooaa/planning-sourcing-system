# 06 — 原型说明（附录）

## 6.1 技术架构

```text
Browser (hash routes)
    │
    ▼
Ant Design Pro (Umi Max + React + Ant Design)
    │
    ├── pages/*          业务页
    ├── services/mock/
    │     ├── zavashop/*.json   原始样例
    │     ├── catalog.ts        读取与派生（available/status）
    │     └── store.ts          任务/文件（localStorage）
    └── config/routes.ts
```

无服务端 API；分析任务用前端 `setTimeout` 模拟异步。

## 6.2 页面与路由

| 路由 | 页面 | 说明 |
|------|------|------|
| `/home` | Home | 入口卡片 |
| `/inventory` | Inventory | 库存表 + 仓筛选 |
| `/reorder-plan` | Reorder Plan | 发起分析 + 历史结果 |
| `/purchase-orders` | Purchase Orders | PO 只读 |
| `/orders` | Customer Orders | 订单只读，可展开明细 |
| `/suppliers` | Suppliers | 供应商只读 |
| `/warehouses` | Warehouses | 仓库只读 |
| `/tasks` | Tasks | 异步任务 |
| `/files` | Files | 结果文件 |

## 6.3 关键演示路径

```text
Home → Inventory（理解库存口径）
    → Reorder Plan（Start analysis）
    → Tasks（看 success）
    → Files（Preview notes）
```

## 6.4 数据出处

Microsoft ZavaShop Supply Chain Workshop — `workshop/data`  

详见：`src/services/mock/zavashop/SOURCE.md`

## 6.5 本地运行

```bash
npm install
npm start
```

浏览器打开 http://localhost:8000/

若遇白屏：确认使用 webpack 模式构建（本仓库已关闭会在部分 Windows 环境 404 的 utoopack），并硬刷新。
