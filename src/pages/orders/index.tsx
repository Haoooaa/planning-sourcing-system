import { PageContainer } from '@ant-design/pro-components';
import { Table, Tag } from 'antd';
import React from 'react';
import { getSku, orders } from '@/services/mock/catalog';

const statusColor: Record<string, string> = {
  new: 'blue',
  processing: 'cyan',
  in_transit: 'processing',
  delivered: 'green',
  exception: 'red',
};

const OrdersPage: React.FC = () => (
  <PageContainer title="Customer Orders">
    <Table
      rowKey="order_id"
      dataSource={orders}
      expandable={{
        expandedRowRender: (r) => (
          <Table
            size="small"
            pagination={false}
            rowKey={(_, i) => String(i)}
            dataSource={r.lines}
            columns={[
              { title: 'sku', dataIndex: 'sku', width: 120 },
              {
                title: 'product',
                render: (_, line) => getSku(line.sku)?.name || line.sku,
              },
              { title: 'qty', dataIndex: 'qty', width: 80 },
              { title: 'unit_price_usd', dataIndex: 'unit_price_usd', width: 140 },
            ]}
          />
        ),
      }}
      columns={[
        { title: 'order_id', dataIndex: 'order_id', width: 180 },
        { title: 'customer_id', dataIndex: 'customer_id', width: 120 },
        { title: 'ship_to_city', dataIndex: 'ship_to_city', width: 120 },
        { title: 'ship_to_warehouse', dataIndex: 'ship_to_warehouse', width: 140 },
        {
          title: 'status',
          dataIndex: 'status',
          width: 120,
          render: (s: string) => <Tag color={statusColor[s] || 'default'}>{s}</Tag>,
        },
        { title: 'total_usd', dataIndex: 'total_usd', width: 100 },
        { title: 'created_at', dataIndex: 'created_at', width: 190 },
        {
          title: 'incident / exception',
          ellipsis: true,
          render: (_, r) =>
            (r as { incident?: string; exception_reason?: string }).incident ||
            (r as { exception_reason?: string }).exception_reason ||
            '-',
        },
      ]}
    />
  </PageContainer>
);

export default OrdersPage;
