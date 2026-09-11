import { PageContainer } from '@ant-design/pro-components';
import { Badge, Progress, Table, Tag } from 'antd';
import React from 'react';
import type { JobStatus } from '@/services/mock/store';
import { useDemoStore } from '@/services/mock/useDemoStore';

const statusMap: Record<
  JobStatus,
  { text: string; status: 'default' | 'processing' | 'success' | 'error' }
> = {
  pending: { text: 'queued', status: 'default' },
  running: { text: 'running', status: 'processing' },
  success: { text: 'success', status: 'success' },
  failed: { text: 'failed', status: 'error' },
};

const typeLabel: Record<string, string> = {
  'reorder-plan': 'reorder-plan',
  'inventory-export': 'inventory-export',
  'supplier-export': 'supplier-export',
};

const TasksPage: React.FC = () => {
  const store = useDemoStore();
  return (
    <PageContainer title="Tasks">
      <Table
        rowKey="id"
        dataSource={store.jobs}
        locale={{ emptyText: 'No tasks yet — run a Reorder Plan analysis' }}
        columns={[
          {
            title: 'type',
            dataIndex: 'type',
            width: 140,
            render: (t) => <Tag color="blue">{typeLabel[t] || t}</Tag>,
          },
          { title: 'title', dataIndex: 'title', ellipsis: true },
          {
            title: 'status',
            dataIndex: 'status',
            width: 120,
            render: (s: JobStatus) => (
              <Badge status={statusMap[s].status} text={statusMap[s].text} />
            ),
          },
          {
            title: 'progress',
            dataIndex: 'progress',
            width: 160,
            render: (p) => <Progress percent={p} size="small" />,
          },
          { title: 'message', dataIndex: 'message', ellipsis: true },
          { title: 'created_at', dataIndex: 'createdAt', width: 180 },
        ]}
      />
    </PageContainer>
  );
};

export default TasksPage;
