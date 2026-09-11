import { PageContainer } from '@ant-design/pro-components';
import { history } from '@umijs/max';
import { Alert, Button, Segmented, Select, Space, Table, Tag, Tooltip } from 'antd';
import React, { useMemo, useState } from 'react';
import { buildInventoryTable, warehouses } from '@/services/mock/catalog';
import { statusLabel } from '@/services/mock/uxCopy';

const InventoryPage: React.FC = () => {
  const [wh, setWh] = useState<string | undefined>();
  const [view, setView] = useState<'risk' | 'all'>('risk');

  const data = useMemo(() => {
    let all = buildInventoryTable();
    if (wh) all = all.filter((r) => r.warehouse_code === wh);
    if (view === 'risk') {
      all = all.filter((r) => r.status !== 'healthy');
    }
    const rank = { out_of_stock: 0, below_reorder: 1, healthy: 2 } as const;
    return [...all].sort(
      (a, b) =>
        rank[a.status as keyof typeof rank] - rank[b.status as keyof typeof rank] ||
        a.available - b.available,
    );
  }, [wh, view]);

  return (
    <PageContainer
      title="库存"
      subTitle="先看可发数量，不是账面在库"
      extra={
        <Button type="primary" onClick={() => history.push('/guide')}>
          去处理风险队列
        </Button>
      }
    >
      <Alert
        showIcon
        type="info"
        style={{ marginBottom: 16 }}
        message="可发 available = 账面 on_hand − 占用 reserved。低于再订货点就会标成「偏低」或「缺货」。"
      />
      <Space wrap style={{ marginBottom: 16 }}>
        <Segmented
          value={view}
          onChange={(v) => setView(v as 'risk' | 'all')}
          options={[
            { label: '只需关注的', value: 'risk' },
            { label: '全部库存', value: 'all' },
          ]}
        />
        <Select
          allowClear
          placeholder="按仓筛选"
          style={{ width: 320 }}
          value={wh}
          onChange={setWh}
          options={warehouses.map((w) => ({
            label: `${w.code} — ${w.name}`,
            value: w.code,
          }))}
        />
      </Space>
      <Table
        rowKey={(r) => `${r.warehouse_code}_${r.sku}`}
        dataSource={data}
        scroll={{ x: 1100 }}
        locale={{
          emptyText:
            view === 'risk' ? '当前筛选下没有风险库存，可切换到「全部库存」' : '暂无数据',
        }}
        columns={[
          { title: '仓', dataIndex: 'warehouse_code', width: 90 },
          { title: 'SKU', dataIndex: 'sku', width: 110 },
          { title: '商品', dataIndex: 'product', ellipsis: true },
          {
            title: (
              <Tooltip title="账面库存">
                <span>on_hand</span>
              </Tooltip>
            ),
            dataIndex: 'on_hand',
            width: 90,
          },
          {
            title: (
              <Tooltip title="已被订单占用">
                <span>reserved</span>
              </Tooltip>
            ),
            dataIndex: 'reserved',
            width: 90,
          },
          {
            title: (
              <Tooltip title="真正能发的数量">
                <span>可发 available</span>
              </Tooltip>
            ),
            dataIndex: 'available',
            width: 120,
          },
          {
            title: (
              <Tooltip title="再订货点">
                <span>reorder_point</span>
              </Tooltip>
            ),
            dataIndex: 'reorder_point',
            width: 120,
          },
          {
            title: '状态',
            dataIndex: 'status',
            width: 140,
            render: (s: string) => {
              const meta = statusLabel[s];
              return (
                <Tooltip title={meta?.hint}>
                  <Tag color={meta?.color || 'default'}>
                    {meta?.zh || s}
                    <span style={{ opacity: 0.7, marginLeft: 4 }}>{s}</span>
                  </Tag>
                </Tooltip>
              );
            },
          },
        ]}
      />
    </PageContainer>
  );
};

export default InventoryPage;
