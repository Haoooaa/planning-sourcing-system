import {
  PageContainer,
  ProForm,
  ProFormSelect,
} from '@ant-design/pro-components';
import { history } from '@umijs/max';
import {
  Alert,
  Button,
  Card,
  Drawer,
  Table,
  Tag,
  message,
} from 'antd';
import React, { useMemo, useState } from 'react';
import { buildReorderRows, warehouses } from '@/services/mock/catalog';
import { startAnalysisJob } from '@/services/mock/store';
import { useDemoStore } from '@/services/mock/useDemoStore';
import { statusLabel } from '@/services/mock/uxCopy';

const ReorderPlanPage: React.FC = () => {
  const store = useDemoStore();
  const [open, setOpen] = useState(false);
  const [fileId, setFileId] = useState<string>();
  const files = useMemo(
    () => store.files.filter((f) => f.module === 'reorder-plan'),
    [store.files],
  );
  const active = files.find((f) => f.id === fileId);

  return (
    <PageContainer
      title="补货分析"
      subTitle="生成结果文件；分析不自动创建采购单"
      extra={
        <Button onClick={() => history.push('/guide')}>回到风险队列</Button>
      }
    >
      <Alert
        showIcon
        type="info"
        style={{ marginBottom: 16 }}
        message="选择仓库后开始分析，完成后在下方预览。状态说明仅供决策参考，不会自动删行或下单。"
      />
      <Card title="1. 开始分析" style={{ marginBottom: 16 }}>
        <ProForm
          submitter={{ searchConfig: { submitText: '开始分析' } }}
          onFinish={async (values) => {
            const code = values.warehouse as string | undefined;
            const wh = warehouses.find((w) => w.code === code);
            const rows = buildReorderRows(code);
            startAnalysisJob({
              type: 'reorder-plan',
              title: `Reorder plan: ${wh?.name || 'All warehouses'}`,
              fileName: `ReorderPlan_${code || 'ALL'}_${Date.now()}.json`,
              remark: wh
                ? `${wh.code} / ${wh.region}`
                : 'All fulfillment centers',
              rows,
            });
            message.success('已创建任务，完成后会出现在下方结果列表');
            return true;
          }}
        >
          <ProFormSelect
            name="warehouse"
            label="仓库"
            placeholder="留空则分析全部仓"
            options={warehouses.map((w) => ({
              label: `${w.code} — ${w.name}`,
              value: w.code,
            }))}
            extra="可先看全网，再按仓细化。"
          />
        </ProForm>
      </Card>

      <Card title="2. 结果文件">
        <Table
          rowKey="id"
          dataSource={files}
          locale={{ emptyText: '暂无结果，请先开始分析' }}
          columns={[
            { title: '文件名', dataIndex: 'name', ellipsis: true },
            { title: '大小', dataIndex: 'sizeLabel', width: 100 },
            { title: '生成时间', dataIndex: 'createdAt', width: 180 },
            {
              title: '',
              width: 100,
              render: (_, row) => (
                <Button
                  type="link"
                  onClick={() => {
                    setFileId(row.id);
                    setOpen(true);
                  }}
                >
                  预览
                </Button>
              ),
            },
          ]}
        />
      </Card>

      <Drawer
        width={960}
        title="分析结果预览"
        open={open}
        onClose={() => setOpen(false)}
        extra={
          <Button type="primary" onClick={() => history.push('/guide')}>
            前往风险队列
          </Button>
        }
      >
        <Alert
          style={{ marginBottom: 12 }}
          type="success"
          showIcon
          message="优先处理「缺货 / 偏低」；healthy 行为对照基线。"
        />
        <Table
          size="small"
          rowKey={(_, i) => String(i)}
          scroll={{ x: 1100 }}
          dataSource={active?.rows || []}
          columns={[
            { title: '仓', dataIndex: 'warehouse', width: 180 },
            { title: 'SKU', dataIndex: 'sku', width: 100 },
            { title: '商品', dataIndex: 'product', width: 200, ellipsis: true },
            { title: '可发', dataIndex: 'available', width: 80 },
            { title: '再订货点', dataIndex: 'reorder_point', width: 100 },
            {
              title: '状态',
              dataIndex: 'status',
              width: 140,
              render: (s: string) => {
                const meta = statusLabel[s];
                return (
                  <Tag color={meta?.color || 'default'}>
                    {meta?.zh || s}
                  </Tag>
                );
              },
            },
            { title: '说明', dataIndex: 'note', ellipsis: true },
          ]}
        />
      </Drawer>
    </PageContainer>
  );
};

export default ReorderPlanPage;
