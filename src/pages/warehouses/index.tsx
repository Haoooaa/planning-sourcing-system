import { PageContainer } from '@ant-design/pro-components';
import { Table } from 'antd';
import React from 'react';
import { warehouses } from '@/services/mock/catalog';

const WarehousesPage: React.FC = () => (
  <PageContainer title="Warehouses">
    <Table
      rowKey="code"
      dataSource={warehouses}
      columns={[
        { title: 'code', dataIndex: 'code', width: 100 },
        { title: 'name', dataIndex: 'name', width: 240 },
        { title: 'region', dataIndex: 'region', width: 100 },
        { title: 'timezone', dataIndex: 'timezone', width: 180 },
        { title: 'supervisor', dataIndex: 'supervisor', width: 140 },
        { title: 'capacity_pallets', dataIndex: 'capacity_pallets', width: 140 },
        { title: 'address', dataIndex: 'address', ellipsis: true },
      ]}
    />
  </PageContainer>
);

export default WarehousesPage;
