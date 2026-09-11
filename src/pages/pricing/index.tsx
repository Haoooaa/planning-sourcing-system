import { PageContainer } from '@ant-design/pro-components';
import { InboxOutlined } from '@ant-design/icons';
import { Alert, Button, Card, Table, Tabs, Upload, message } from 'antd';
import React, { useMemo } from 'react';
import { addPricingRecord } from '@/services/mock/store';
import { useDemoStore } from '@/services/mock/useDemoStore';

const PricingPage: React.FC = () => {
  const store = useDemoStore();
  const records = useMemo(
    () => store.files.filter((f) => f.module === 'pricing'),
    [store.files],
  );

  return (
    <PageContainer title="定价分析">
      <Tabs
        items={[
          {
            key: 'new',
            label: '新版定价',
            children: (
              <>
                <Card
                  title="定价文件上传"
                  extra={
                    <Button onClick={() => message.info('演示：模板下载未接入真实文件')}>
                      下载模版文件
                    </Button>
                  }
                  style={{ marginBottom: 16 }}
                >
                  <Upload.Dragger
                    multiple={false}
                    accept=".xlsx,.xls"
                    beforeUpload={(file) => {
                      addPricingRecord(file.name);
                      message.success(`已模拟上传：${file.name}`);
                      return false;
                    }}
                    showUploadList={false}
                  >
                    <p className="ant-upload-drag-icon">
                      <InboxOutlined />
                    </p>
                    <p className="ant-upload-text">选择定价文件并上传</p>
                    <p className="ant-upload-hint">只能上传一个 xlsx，演示不解析真实内容</p>
                  </Upload.Dragger>
                </Card>
                <Card title="文件上传记录">
                  <Alert
                    style={{ marginBottom: 12 }}
                    type="info"
                    showIcon
                    message="上传后会进入任务队列，完成后出现在此列表与「文件管理」。"
                  />
                  <Table
                    rowKey="id"
                    dataSource={records}
                    locale={{ emptyText: '暂无文件记录' }}
                    columns={[
                      { title: '文件名', dataIndex: 'name', ellipsis: true },
                      { title: '大小', dataIndex: 'sizeLabel', width: 100 },
                      { title: '创建时间', dataIndex: 'createdAt', width: 180 },
                      {
                        title: '状态',
                        width: 100,
                        render: () => '成功',
                      },
                    ]}
                  />
                </Card>
              </>
            ),
          },
          {
            key: 'old',
            label: '旧版定价',
            children: <Alert type="warning" message="演示占位：旧版定价第二期" />,
          },
          {
            key: 'quick',
            label: '快速定价',
            children: <Alert type="warning" message="演示占位：快速定价第二期" />,
          },
        ]}
      />
    </PageContainer>
  );
};

export default PricingPage;
