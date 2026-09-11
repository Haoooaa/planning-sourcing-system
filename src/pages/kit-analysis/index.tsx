import {
  PageContainer,
  ProForm,
  ProFormCheckbox,
  ProFormSelect,
  ProFormText,
} from '@ant-design/pro-components';
import { Alert, Button, Card, Drawer, Space, Table, message } from 'antd';
import React, { useMemo, useState } from 'react';
import { getKitSeedRows, startAnalysisJob } from '@/services/mock/store';
import { useDemoStore } from '@/services/mock/useDemoStore';

const KitAnalysisPage: React.FC = () => {
  const store = useDemoStore();
  const [open, setOpen] = useState(false);
  const [activeFileId, setActiveFileId] = useState<string>();
  const files = useMemo(
    () => store.files.filter((f) => f.module === 'kit-analysis'),
    [store.files],
  );
  const active = files.find((f) => f.id === activeFileId);

  return (
    <PageContainer
      title="齐套分析"
      extra={
        <Button
          type="link"
          onClick={() =>
            message.info(
              '思考要点：品牌先对齐；补边不改边/品/品质；灯镜板等大件慎入齐套',
            )
          }
        >
          功能说明
        </Button>
      }
    >
      <Alert
        showIcon
        type="info"
        style={{ marginBottom: 16 }}
        message="结果里的「标记 / 分析备注」体现齐套思考，不做硬过滤删行。"
      />
      <Card title="齐套分析" style={{ marginBottom: 16 }}>
        <ProForm
          layout="vertical"
          submitter={{ searchConfig: { submitText: '开始分析' } }}
          onFinish={async (values) => {
            const wh = values.warehouseName || '示例共享仓';
            startAnalysisJob({
              type: 'kit-analysis',
              title: `齐套分析：${wh}`,
              fileName: `齐套分析结果_${wh}_${Date.now()}.xlsx`,
              remark: `月份=${values.month}；热销AE=${values.hotAe ? '是' : '否'}`,
              rows: getKitSeedRows(),
            });
            message.success('齐套分析任务已创建');
            return true;
          }}
        >
          <ProFormText
            name="warehouseName"
            label="分析共享仓名称"
            rules={[{ required: true }]}
            initialValue="常平示例共享仓"
          />
          <ProFormText name="storeName" label="分析店铺名称" initialValue="常平示例店铺" />
          <ProFormSelect
            name="month"
            label="分析月份名称"
            rules={[{ required: true }]}
            initialValue="2026-08"
            options={[
              { label: '2026-08', value: '2026-08' },
              { label: '2026-07', value: '2026-07' },
            ]}
          />
          <ProFormCheckbox name="hotAe" initialValue>
            是否带出热销AE
          </ProFormCheckbox>
          <ProFormSelect
            name="oosAe"
            label="带出缺货AE"
            mode="multiple"
            options={[
              { label: '热销缺货', value: 'hot' },
              { label: '季节性缺货', value: 'season' },
            ]}
          />
        </ProForm>
      </Card>

      <Card title="历史文件">
        <Table
          rowKey="id"
          dataSource={files}
          locale={{ emptyText: '暂无文件' }}
          columns={[
            { title: '文件名', dataIndex: 'name', ellipsis: true },
            { title: '文件大小', dataIndex: 'sizeLabel', width: 110 },
            { title: '创建时间', dataIndex: 'createdAt', width: 180 },
            {
              title: '操作',
              width: 200,
              render: (_, row) => (
                <Space>
                  <Button
                    type="link"
                    onClick={() => {
                      setActiveFileId(row.id);
                      setOpen(true);
                    }}
                  >
                    回写详情
                  </Button>
                  <Button
                    type="link"
                    onClick={() => message.success('演示环境：已模拟下载')}
                  >
                    下载
                  </Button>
                </Space>
              ),
            },
          ]}
        />
      </Card>

      <Drawer width={920} title="回写详情" open={open} onClose={() => setOpen(false)}>
        <Table
          size="small"
          rowKey={(_, i) => String(i)}
          scroll={{ x: 1100 }}
          dataSource={active?.rows || []}
          columns={Object.keys(active?.rows?.[0] || {}).map((k) => ({
            title: k,
            dataIndex: k,
            ellipsis: true,
            width: k === '分析备注' ? 240 : 120,
          }))}
          pagination={false}
        />
      </Drawer>
    </PageContainer>
  );
};

export default KitAnalysisPage;
