import { PageContainer } from '@ant-design/pro-components';
import { Table, Tag, Typography } from 'antd';
import React from 'react';
import { suppliers } from '@/services/mock/catalog';
import './index.less';

const { Text } = Typography;

function EllipsisCell({ text }: { text: string }) {
  return (
    <Text className="sup-ellipsis" ellipsis={{ tooltip: { placement: 'topLeft' } }}>
      {text}
    </Text>
  );
}

const SuppliersPage: React.FC = () => (
  <PageContainer title="Suppliers">
    <Table
      className="sup-table"
      rowKey="supplier_id"
      dataSource={suppliers}
      tableLayout="fixed"
      scroll={{ x: 1180 }}
      columns={[
        {
          title: 'supplier_id',
          dataIndex: 'supplier_id',
          width: 110,
        },
        {
          title: 'name',
          dataIndex: 'name',
          width: 160,
          render: (v: string) => <EllipsisCell text={v} />,
        },
        { title: 'country', dataIndex: 'country', width: 100 },
        { title: 'city', dataIndex: 'city', width: 110 },
        {
          title: 'specialties',
          dataIndex: 'specialties',
          width: 260,
          render: (list: string[]) => (
            <div className="sup-tags">
              {(list || []).map((s) => (
                <Tag key={s}>{s}</Tag>
              ))}
            </div>
          ),
        },
        {
          title: 'primary_contact',
          dataIndex: 'primary_contact',
          width: 130,
          render: (v: string) => <EllipsisCell text={v} />,
        },
        {
          title: 'email',
          dataIndex: 'email',
          width: 220,
          render: (v: string) => <EllipsisCell text={v} />,
        },
        {
          title: 'preferred_incoterm',
          dataIndex: 'preferred_incoterm',
          width: 140,
          render: (v: string) => <EllipsisCell text={v} />,
        },
      ]}
    />
  </PageContainer>
);

export default SuppliersPage;
