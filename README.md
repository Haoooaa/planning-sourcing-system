# ZavaShop Planning & Sourcing

供应链运营原型：库存口径、补货分析、采购跟单、履约异常与数据看板。基于 Ant Design Pro，主数据沿用 ZavaShop 英文字段。

## 在线预览

https://haoooaa.github.io/planning-sourcing-system/

## 本地运行

```bash
npm install
npm start
```

打开 http://localhost:8000/

## 发布到 GitHub Pages

```bash
npm run deploy
```

或 push 到 `master` / `main`，由 GitHub Actions 自动构建并发布。

项目站 `publicPath` 为 `/planning-sourcing-system/`（`CI=true` 时自动生效）。

## 功能模块

| Menu | Data |
|------|------|
| 业务背景 / 今日风险 / 数据看板 | 运营说明与决策队列 |
| Inventory | `inventory.json` + `skus.json` + `warehouses.json` |
| Reorder Plan | `available` vs `reorder_point` + async result file |
| Purchase Orders | `purchase_orders.json` |
| Customer Orders | `orders.json` |
| Suppliers | `suppliers.json` |
| Warehouses | `warehouses.json` |
| Tasks / Files | local mock job queue |

## 文档

见 [docs/README.md](./docs/README.md)

## 来源

- UI 框架：[ant-design/ant-design-pro](https://github.com/ant-design/ant-design-pro)
- 样例数据：[ZavaShop workshop/data](https://github.com/microsoft/Learn-Microsoft-Agent-Framework-with-Foundry-ZavaShop-Supply-Chain-Workshop/tree/main/workshop/data)
