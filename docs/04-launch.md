# 04 — 上线（Launch）

## 4.1 上线目标

将 **ZavaShop SCM Demo** 发布为可公开访问的静态站点（推荐 GitHub Pages），供演示与作品集展示。

## 4.2 发布形态

| 项 | 选择 |
|----|------|
| 托管 | GitHub Pages |
| 仓库 | `Haoooaa/planning-sourcing-system` |
| 路由 | hash（`/#/home`），避免深链 404 |
| 后端 | 无；数据打进前端包 |
| 登录 | 无 |

## 4.3 发布前检查表（P0）

- [ ] `npm install` 成功  
- [ ] `npm start` 本地演示剧本跑通  
- [ ] `npm run build` 成功，产物在 `dist/`  
- [ ] `config/config.ts` 中 `publicPath` 与 Pages 路径一致  
  - 用户站：`https://<user>.github.io/` → `publicPath: '/'`  
  - 项目站：`https://<user>.github.io/planning-sourcing-system/` → `publicPath: '/planning-sourcing-system/'`  
- [ ] README 含运行与数据出处  
- [ ] 无密钥、无真实客户数据  

## 4.4 推荐发布步骤

### A. 配置 publicPath（项目页场景）

在 `config/config.ts`：

```ts
const PUBLIC_PATH = '/planning-sourcing-system/';
```

（若使用用户根域名 Pages，则保持 `'/'`。）

### B. 本地构建验证

```bash
npm run build
npx serve dist
# 或：npm run preview
```

确认打开后菜单与 Reorder 闭环正常。

### C. 部署到 GitHub Pages

仓库已带 Pro 模板脚本时可：

```bash
npm run deploy
```

（内部一般为 `max build` + `gh-pages -d dist`。需本机已登录 GitHub 推送权限。）

或使用 GitHub Actions：push 到 `main` 后构建并发布 `dist` 到 `gh-pages` 分支。

### D. 上线冒烟

打开线上地址，执行：

1. Home 可见  
2. Inventory 有数据  
3. Reorder Plan 跑通 → Files 可预览  

## 4.5 回滚

- Pages：将 `gh-pages` 回退到上一发布 commit，或重新 deploy 上一 tag  
- 文档：在迭代日志标注回滚原因  

## 4.6 上线公告模板

```text
标题：ZavaShop SCM Demo v0.1 上线
地址：https://hao ooaa.github.io/planning-sourcing-system/
说明：静态供应链演示；数据来自 Microsoft ZavaShop workshop fixtures；无登录。
演示路径：Inventory → Reorder Plan → Tasks → Files
```

## 4.7 上线后 24h 观察

- 页面是否白屏（资源路径）  
- 移动端侧栏是否可用（可接受降级）  
- 反馈入口（Issue / 聊天）是否写在 README
