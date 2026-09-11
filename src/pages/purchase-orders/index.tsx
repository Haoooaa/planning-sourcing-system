import { PageContainer } from '@ant-design/pro-components';
import { Table, Tag, Typography } from 'antd';
import React from 'react';
import { getSku, getWarehouse, purchaseOrders } from '@/services/mock/catalog';
import './index.less';

const { Text } = Typography;

const statusColor: Record<string, string> = {
  confirmed: 'blue',
  production: 'cyan',
  in_transit: 'processing',
  customs_clearing: 'orange',
  delayed: 'red',
  delivered: 'green',
};

function EllipsisCell({ text }: { text: string }) {
  return (
    <Text className="po-ellipsis" ellipsis={{ tooltip: { placement: 'topLeft' } }}>
      {text}
    </Text>
  );
}

const PurchaseOrdersPage: React.FC = () => (
  <PageContainer title="Purchase Orders">
    <Table
      className="po-table"
      rowKey="po_number"
      dataSource={purchaseOrders}
      tableLayout="fixed"
      scroll={{ x: 1280 }}
      columns={[
        {
          title: 'po_number',
          dataIndex: 'po_number',
          width: 150,
          render: (v: string) => <EllipsisCell text={v} />,
        },
        {
          title: 'sku / product',
          width: 240,
          render: (_, r) => {
            const sku = getSku(r.sku);
            return <EllipsisCell text={`${r.sku} — ${sku?.name || ''}`} />;
          },
        },
        { title: 'qty', dataIndex: 'qty', width: 72 },
        {
          title: 'supplier_name',
          dataIndex: 'supplier_name',
          width: 150,
          render: (v: string) => <EllipsisCell text={v} />,
        },
        {
          title: 'destination_warehouse',
          width: 200,
          render: (_, r) => {
            const wh = getWarehouse(r.destination_warehouse);
            const text = wh ? `${wh.code} ${wh.name}` : r.destination_warehouse;
            return <EllipsisCell text={text} />;
          },
        },
        {
          title: 'status',
          dataIndex: 'status',
          width: 140,
          render: (s: string) => <Tag color={statusColor[s] || 'default'}>{s}</Tag>,
        },
        { title: 'eta', dataIndex: 'eta', width: 110 },
        {
          title: 'unit_price_usd',
          dataIndex: 'unit_price_usd',
          width: 120,
        },
        {
          title: 'last_event',
          dataIndex: 'last_event',
          width: 280,
          render: (v: string) => <EllipsisCell text={v || ''} />,
        },
      ]}
    />
  </PageContainer>
);

export default PurchaseOrdersPage;
