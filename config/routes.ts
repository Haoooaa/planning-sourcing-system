/**
 * ZavaShop supply-chain demo routes — no login
 * Menu order follows goal-directed flow (Cooper): start → risks → inspect → act
 */
export default [
  { path: '/', redirect: '/home' },
  { path: '/home', name: 'home', icon: 'home', component: './home' },
  {
    path: '/background',
    name: 'background',
    icon: 'info',
    component: './background',
  },
  {
    path: '/guide',
    name: 'guide',
    icon: 'alert',
    component: './guide',
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    icon: 'dashboard',
    component: './ops-dashboard',
  },
  {
    path: '/inventory',
    name: 'inventory',
    icon: 'database',
    component: './inventory',
  },
  {
    path: '/reorder-plan',
    name: 'reorder-plan',
    icon: 'schedule',
    component: './reorder-plan',
  },
  {
    path: '/purchase-orders',
    name: 'purchase-orders',
    icon: 'shopping',
    component: './purchase-orders',
  },
  {
    path: '/orders',
    name: 'orders',
    icon: 'shoppingCart',
    component: './orders',
  },
  {
    path: '/suppliers',
    name: 'suppliers',
    icon: 'team',
    component: './suppliers',
  },
  {
    path: '/warehouses',
    name: 'warehouses',
    icon: 'cluster',
    component: './warehouses',
  },
  {
    path: '/tasks',
    name: 'tasks',
    icon: 'unorderedList',
    component: './tasks',
  },
  {
    path: '/files',
    name: 'files',
    icon: 'folder',
    component: './files',
  },
  {
    path: '*',
    layout: false,
    component: './exception/404',
  },
];
