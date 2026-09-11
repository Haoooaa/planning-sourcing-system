import {
  PageContainer,
  ProForm,
  ProFormSelect,
  ProFormText,
} from '@ant-design/pro-components';
import {
  Alert,
  Button,
  Card,
  Drawer,
  Space,
  Table,
  message,
} from 'antd';
import React, { useMemo, useState } from 'react';
import {
  getStockSeedRows,
  startAnalysisJob,
} from '@/services/mock/store';
import { useDemoStore } from '@/services/mock/useDemoStore';

const StockPlanPage: React.FC = () => {
  const store = useDemoStore();
  const [open, setOpen] = useState(false);
  const [activeFileId, setActiveFileId] = useState<string>();

  const files = useMemo(
    () => store.files.filter((f) => f.module === 'stock-plan'),
    [store.files],
  );
  const active = files.find((f) => f.id === activeFileId);

  return (
    <PageContainer
      title="备货计划"
      extra={
        <Button
          type="link"
          onClick={() =>
            message.info(
              '思考要点：去不建议备货干扰 → 询销/库存对照 → 高价与事故件谨慎 → 必要时转一件代发',
            )
          }
        >
          功能说明
        </Button>
      }
    >
      <Alert
        type="info"
        showIcon
        style={{ marginBottom: 16 }}
        message="分析备注体现运营思考，不把询价/价格阈值写死成自动删行。"
      />
      <Card title="新建备货计划" style={{ marginBottom: 16 }}>
        <ProForm
          layout="vertical"
          submitter={{
            searchConfig: { submitText: '开始新备货计划分析' },
            resetButtonProps: { style: { display: 'inline-flex' } },
          }}
          onFinish={async (values) => {
            const wh = values.warehouseName || '示例共享仓';
            startAnalysisJob({
              type: 'stock-plan',
              title: `备货计划：${wh}`,
              fileName: `新备货计划_${wh}_${Date.now()}.xlsx`,
              remark: `车品牌=${values.carBrand || '多选'}；区域=${values.region || '-'}`,
              rows: getStockSeedRows(),
            });
            message.success('已创建分析任务，可在「任务管理 / 文件管理」查看');
            return true;
          }}
        >
          <ProFormText
            name="warehouseName"
            label="分析共享仓名称"
            placeholder="输入关键词搜索（演示可直接填）"
            initialValue="惠城示例共享仓"
            rules={[{ required: true, message: '请填写共享仓' }]}
          />
          <ProFormText name="warehouseId" label="分析共享仓ID" initialValue="WH013" />
          <ProFormText
            name="storeName"
            label="分析店铺名称"
            placeholder="可选"
          />
          <ProFormSelect
            name="carBrand"
            label="分析车品牌"
            mode="multiple"
            options={[
              { label: '宝马', value: 'BMW' },
              { label: '丰田', value: 'TOYOTA' },
              { label: '大众', value: 'VW' },
            ]}
            extra="多选演示；真实场景选主品牌可带出关联品牌"
          />
          <ProFormText
            name="region"
            label="期望区域名称"
            placeholder="如：广东省"
            initialValue="广东省"
          />
        </ProForm>
      </Card>

      <Card
        title="历史分析文件"
        extra={
          <Button type="link" onClick={() => message.success('已刷新')}>
            刷新
          </Button>
        }
      >
        <Table
          rowKey="id"
          dataSource={files}
          pagination={{ pageSize: 8 }}
          locale={{ emptyText: '暂无数据，先跑一条备货计划' }}
          columns={[
            { title: '文件名', dataIndex: 'name', ellipsis: true },
            { title: '文件大小', dataIndex: 'sizeLabel', width: 110 },
            { title: '创建时间', dataIndex: 'createdAt', width: 180 },
            {
              title: '操作',
              width: 160,
              render: (_, row) => (
                <Space>
                  <Button
                    type="link"
                    onClick={() => {
                      setActiveFileId(row.id);
                      setOpen(true);
                    }}
                  >
                    查看详情
                  </Button>
                </Space>
              ),
            },
          ]}
        />
      </Card>

      <Drawer
        width={880}
        title="备货结果样例"
        open={open}
        onClose={() => setOpen(false)}
      >
        <Alert
          style={{ marginBottom: 12 }}
          type="warning"
          showIcon
          message={active?.remark || '虚构样例，列结构对齐真实导出'}
        />
        <Table
          size="small"
          rowKey={(_, i) => String(i)}
          scroll={{ x: 1000 }}
          dataSource={active?.rows || []}
          columns={Object.keys(active?.rows?.[0] || { 产品名称: 1, 分析备注: 1 }).map(
            (k) => ({
              title: k,
              dataIndex: k,
              ellipsis: true,
              width: k === '分析备注' ? 220 : 120,
            }),
          )}
          pagination={false}
        />
      </Drawer>
    </PageContainer>
  );
};

export default StockPlanPage;
