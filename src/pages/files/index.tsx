import { PageContainer } from '@ant-design/pro-components';
import { Button, Drawer, Space, Table, Tag, message } from 'antd';
import React, { useState } from 'react';
import { useDemoStore } from '@/services/mock/useDemoStore';

const FilesPage: React.FC = () => {
  const store = useDemoStore();
  const [open, setOpen] = useState(false);
  const [fileId, setFileId] = useState<string>();
  const active = store.files.find((f) => f.id === fileId);

  return (
    <PageContainer title="Files">
      <Table
        rowKey="id"
        dataSource={store.files}
        locale={{ emptyText: 'No files yet' }}
        columns={[
          {
            title: 'module',
            dataIndex: 'module',
            width: 140,
            render: (m) => <Tag>{m}</Tag>,
          },
          { title: 'name', dataIndex: 'name', ellipsis: true },
          { title: 'size', dataIndex: 'sizeLabel', width: 100 },
          { title: 'created_at', dataIndex: 'createdAt', width: 180 },
          { title: 'remark', dataIndex: 'remark', ellipsis: true },
          {
            title: 'actions',
            width: 160,
            render: (_, row) => (
              <Space>
                <Button
                  type="link"
                  onClick={() => {
                    setFileId(row.id);
                    setOpen(true);
                  }}
                >
                  Preview
                </Button>
                <Button
                  type="link"
                  onClick={() => message.success('Demo: download simulated')}
                >
                  Download
                </Button>
              </Space>
            ),
          },
        ]}
      />
      <Drawer width={960} title="File preview" open={open} onClose={() => setOpen(false)}>
        <Table
          size="small"
          rowKey={(_, i) => String(i)}
          scroll={{ x: 1000 }}
          dataSource={active?.rows || []}
          columns={Object.keys(active?.rows?.[0] || { tip: 1 }).map((k) => ({
            title: k,
            dataIndex: k,
            ellipsis: true,
          }))}
          locale={{ emptyText: 'No preview rows' }}
          pagination={false}
        />
      </Drawer>
    </PageContainer>
  );
};

export default FilesPage;
