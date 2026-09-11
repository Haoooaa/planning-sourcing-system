/**
 * ZavaShop supply-chain fixtures (original wording preserved).
 * Source: Microsoft ZavaShop Supply Chain Workshop
 * https://github.com/microsoft/Learn-Microsoft-Agent-Framework-with-Foundry-ZavaShop-Supply-Chain-Workshop
 */
import warehousesRaw from './zavashop/warehouses.json';
import skusRaw from './zavashop/skus.json';
import inventoryRaw from './zavashop/inventory.json';
import suppliersRaw from './zavashop/suppliers.json';
import posRaw from './zavashop/purchase_orders.json';
import ordersRaw from './zavashop/orders.json';
import contractsRaw from './zavashop/contracts.json';
import carriersRaw from './zavashop/carriers.json';

export type Warehouse = (typeof warehousesRaw)[number];
export type Sku = (typeof skusRaw)[number];
export type InventoryRow = (typeof inventoryRaw)[number];
export type Supplier = (typeof suppliersRaw)[number];
export type PurchaseOrder = (typeof posRaw)[number];
export type CustomerOrder = (typeof ordersRaw)[number];

export const warehouses = warehousesRaw as Warehouse[];
export const skus = skusRaw as Sku[];
export const inventory = inventoryRaw as InventoryRow[];
export const suppliers = suppliersRaw as Supplier[];
export const purchaseOrders = posRaw as PurchaseOrder[];
export const orders = ordersRaw as CustomerOrder[];
export const contracts = contractsRaw;
export const carriers = carriersRaw;

export function getSku(sku: string) {
  return skus.find((s) => s.sku === sku);
}

export function getWarehouse(code: string) {
  return warehouses.find((w) => w.code === code);
}

export function getSupplier(id: string) {
  return suppliers.find((s) => s.supplier_id === id);
}

export function availableQty(row: InventoryRow) {
  return Math.max(0, row.on_hand - row.reserved);
}

export function inventoryStatus(row: InventoryRow) {
  const avail = availableQty(row);
  if (avail <= 0) return 'out_of_stock';
  if (avail < row.reorder_point) return 'below_reorder';
  return 'healthy';
}

/** Reorder analysis rows — notes are hints only, not hard filters */
export function buildReorderRows(warehouseCode?: string) {
  const rows = warehouseCode
    ? inventory.filter((r) => r.warehouse === warehouseCode)
    : inventory;

  return rows.map((row) => {
    const sku = getSku(row.sku);
    const wh = getWarehouse(row.warehouse);
    const avail = availableQty(row);
    const status = inventoryStatus(row);
    let note = 'On-hand looks fine vs reorder point.';
    if (status === 'out_of_stock') {
      note = 'Available is 0 — check open POs / transfer options.';
    } else if (status === 'below_reorder') {
      note = `Available ${avail} is below reorder point ${row.reorder_point}.`;
    }

    return {
      warehouse: wh?.name || row.warehouse,
      warehouse_code: row.warehouse,
      region: wh?.region || '-',
      sku: row.sku,
      product: sku?.name || row.sku,
      category: sku?.category || '-',
      unit_price_usd: sku?.unit_price_usd ?? 0,
      on_hand: row.on_hand,
      reserved: row.reserved,
      available: avail,
      reorder_point: row.reorder_point,
      status,
      note,
    };
  });
}

export function buildInventoryTable() {
  return inventory.map((row) => {
    const sku = getSku(row.sku);
    const wh = getWarehouse(row.warehouse);
    return {
      warehouse: wh?.name || row.warehouse,
      warehouse_code: row.warehouse,
      sku: row.sku,
      product: sku?.name || row.sku,
      category: sku?.category || '-',
      on_hand: row.on_hand,
      reserved: row.reserved,
      available: availableQty(row),
      reorder_point: row.reorder_point,
      status: inventoryStatus(row),
    };
  });
}

const OPEN_PO_STATUSES = new Set([
  'confirmed',
  'production',
  'in_transit',
  'customs_clearing',
  'delayed',
]);

export type CoverVerdict = 'covered' | 'at_risk' | 'uncovered' | 'n/a';

export type OpsAction =
  | 'wait_inbound'
  | 'expedite_po'
  | 'transfer'
  | 'new_po'
  | 'hold_order';

/** Qty short of reorder_point (0 when healthy). */
export function gapToReorder(row: InventoryRow) {
  return Math.max(0, row.reorder_point - availableQty(row));
}

export function openPosFor(sku: string, warehouse: string) {
  return purchaseOrders.filter(
    (p) =>
      p.sku === sku &&
      p.destination_warehouse === warehouse &&
      OPEN_PO_STATUSES.has(p.status),
  );
}

export function transfersFor(sku: string, toWarehouse: string, need: number) {
  return inventory
    .filter((r) => r.sku === sku && r.warehouse !== toWarehouse)
    .map((r) => {
      const avail = availableQty(r);
      const surplus = Math.max(0, avail - r.reorder_point);
      return {
        from: r.warehouse,
        from_name: getWarehouse(r.warehouse)?.name || r.warehouse,
        available: avail,
        surplus,
        can_cover: surplus >= need && need > 0,
        status: inventoryStatus(r),
      };
    })
    .filter((t) => t.surplus > 0 || t.status === 'healthy')
    .sort((a, b) => b.surplus - a.surplus);
}

export function ordersTouching(sku: string, warehouse: string) {
  return orders.filter(
    (o) =>
      o.ship_to_warehouse === warehouse &&
      o.lines.some((l) => l.sku === sku),
  );
}

export function coverVerdict(gap: number, openQty: number, hasDelayed: boolean): CoverVerdict {
  if (gap <= 0) return 'n/a';
  if (openQty <= 0) return 'uncovered';
  if (hasDelayed || openQty < gap) return 'at_risk';
  return 'covered';
}

export function recommendAction(input: {
  status: ReturnType<typeof inventoryStatus>;
  gap: number;
  openQty: number;
  hasDelayed: boolean;
  bestSurplus: number;
  hasExceptionOrder: boolean;
}): { action: OpsAction; rationale: string } {
  const { status, gap, openQty, hasDelayed, bestSurplus, hasExceptionOrder } = input;

  if (status === 'healthy') {
    return { action: 'wait_inbound', rationale: '库存健康，无需动作。' };
  }
  if (hasExceptionOrder && bestSurplus >= Math.max(gap, 1)) {
    return {
      action: 'transfer',
      rationale: '履约已异常且他仓有盈余，优先跨仓调拨救火。',
    };
  }
  if (hasDelayed && openQty > 0) {
    return {
      action: bestSurplus > 0 ? 'transfer' : 'expedite_po',
      rationale: bestSurplus > 0
        ? '在途延误，建议调拨兜底同时跟催 PO。'
        : '在途延误且无他仓盈余，需加急跟催供应商。',
    };
  }
  if (openQty >= gap && gap > 0) {
    return {
      action: hasExceptionOrder ? 'hold_order' : 'wait_inbound',
      rationale: hasExceptionOrder
        ? '在途可覆盖缺口，对异常单先改期/保留，等入库。'
        : '在途数量已覆盖到再订货点，可先等入库。',
    };
  }
  if (bestSurplus > 0) {
    return { action: 'transfer', rationale: '缺口未被在途覆盖，他仓有盈余可调拨。' };
  }
  return { action: 'new_po', rationale: '无可靠在途、无调拨盈余，需评估新建采购。' };
}

export type OpsCase = ReturnType<typeof buildOpsCases>[number];

/** Full war-room cases for critical inventory rows. */
export function buildOpsCases() {
  const rank = { out_of_stock: 0, below_reorder: 1, healthy: 2 } as const;

  return inventory
    .map((row) => {
      const sku = getSku(row.sku);
      const wh = getWarehouse(row.warehouse);
      const avail = availableQty(row);
      const status = inventoryStatus(row);
      const gap = gapToReorder(row);
      const openPos = openPosFor(row.sku, row.warehouse);
      const openQty = openPos.reduce((s, p) => s + p.qty, 0);
      const hasDelayed = openPos.some(
        (p) => p.status === 'delayed' || p.status === 'customs_clearing',
      );
      const transfers = transfersFor(row.sku, row.warehouse, gap || 1);
      const relatedOrders = ordersTouching(row.sku, row.warehouse);
      const hasExceptionOrder = relatedOrders.some(
        (o) =>
          o.status === 'exception' ||
          Boolean((o as { incident?: string }).incident) ||
          Boolean((o as { exception_reason?: string }).exception_reason),
      );
      const cover = coverVerdict(gap, openQty, hasDelayed);
      const bestSurplus = transfers[0]?.surplus ?? 0;
      const rec = recommendAction({
        status,
        gap,
        openQty,
        hasDelayed,
        bestSurplus,
        hasExceptionOrder,
      });
      const unit = sku?.unit_price_usd ?? 0;

      return {
        key: `${row.warehouse}_${row.sku}`,
        warehouse_code: row.warehouse,
        warehouse: wh?.name || row.warehouse,
        region: wh?.region || '-',
        supervisor: wh?.supervisor || '-',
        sku: row.sku,
        product: sku?.name || row.sku,
        category: sku?.category || '-',
        unit_price_usd: unit,
        on_hand: row.on_hand,
        reserved: row.reserved,
        available: avail,
        reorder_point: row.reorder_point,
        gap,
        gap_value_usd: Math.round(gap * unit * 100) / 100,
        status,
        cover,
        open_qty: openQty,
        open_pos: openPos,
        transfers,
        related_orders: relatedOrders,
        has_exception_order: hasExceptionOrder,
        recommendation: rec,
      };
    })
    .filter((c) => c.status !== 'healthy')
    .sort((a, b) => {
      const rs = rank[a.status as keyof typeof rank] - rank[b.status as keyof typeof rank];
      if (rs !== 0) return rs;
      return b.gap_value_usd - a.gap_value_usd;
    });
}

export function warehouseHealth() {
  return warehouses.map((w) => {
    const rows = inventory.filter((r) => r.warehouse === w.code);
    const counts = { healthy: 0, below_reorder: 0, out_of_stock: 0 };
    let gapValue = 0;
    rows.forEach((r) => {
      const st = inventoryStatus(r);
      counts[st] += 1;
      const sku = getSku(r.sku);
      gapValue += gapToReorder(r) * (sku?.unit_price_usd ?? 0);
    });
    const total = rows.length || 1;
    const score = Math.round((counts.healthy / total) * 100);
    return {
      ...w,
      ...counts,
      sku_count: rows.length,
      score,
      gap_value_usd: Math.round(gapValue * 100) / 100,
    };
  });
}
