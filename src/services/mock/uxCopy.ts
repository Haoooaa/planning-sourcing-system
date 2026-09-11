/** Plain-language UX copy — Cooper: recognition over jargon recall */

export const statusLabel: Record<string, { zh: string; hint: string; color: string }> = {
  healthy: {
    zh: '充足',
    hint: '可发库存不低于再订货点',
    color: 'green',
  },
  below_reorder: {
    zh: '偏低',
    hint: '还能发，但已低于再订货点，该准备补货',
    color: 'orange',
  },
  out_of_stock: {
    zh: '缺货',
    hint: '可发库存为 0，新单无法承诺发货',
    color: 'red',
  },
};

export const coverLabel: Record<string, { zh: string; hint: string; color: string }> = {
  covered: {
    zh: '在途够用',
    hint: '开放采购量已覆盖缺口',
    color: 'green',
  },
  at_risk: {
    zh: '在途不稳',
    hint: '有采购在途，但延误/数量不足，仍有风险',
    color: 'orange',
  },
  uncovered: {
    zh: '没有在途',
    hint: '该仓该 SKU 没有开放采购可补缺口',
    color: 'red',
  },
  'n/a': {
    zh: '无需覆盖',
    hint: '当前没有缺口',
    color: 'default',
  },
};

export const actionLabel: Record<
  string,
  { zh: string; why: string; next: string; path: string }
> = {
  wait_inbound: {
    zh: '先等入库',
    why: '在途数量已够，不必急着新建采购',
    next: '去核对采购单进度',
    path: '/purchase-orders',
  },
  expedite_po: {
    zh: '催一下采购',
    why: '有货在路上，但延误或卡清关，需要跟催',
    next: '打开相关采购单',
    path: '/purchase-orders',
  },
  transfer: {
    zh: '从别的仓调',
    why: '别的仓还有多余可发库存，调过来更快',
    next: '对比各仓库存',
    path: '/inventory',
  },
  new_po: {
    zh: '考虑新下采购',
    why: '既没有可靠在途，也没有可调拨盈余',
    next: '去看供应商',
    path: '/suppliers',
  },
  hold_order: {
    zh: '先安抚/改期订单',
    why: '客户单已异常，先处理履约再补货',
    next: '打开客户订单',
    path: '/orders',
  },
};

export function availableExplain(onHand: number, reserved: number, available: number) {
  return `账面 ${onHand}，已占用 ${reserved}，真正能发 ${available}`;
}
