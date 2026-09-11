import { PageContainer } from '@ant-design/pro-components';
import { InboxOutlined } from '@ant-design/icons';
import {
  Alert,
  Button,
  Card,
  Input,
  Space,
  Table,
  Tabs,
  Upload,
  message,
} from 'antd';
import React, { useMemo, useState } from 'react';
import { addSupplierClean } from '@/services/mock/store';
import { useDemoStore } from '@/services/mock/useDemoStore';

const SupplierPage: React.FC = () => {
  const store = useDemoStore();
  const [supplier, setSupplier] = useState('示例供应商A');
  const rows = useMemo(() => {
    return store.files
      .filter((f) => f.module === 'supplier-clean')
      .flatMap((f) =>
        (f.rows || []).map((r, i) => ({
          ...r,
          _key: `${f.id}_${i}`,
          _file: f.name,
        })),
      );
  }, [store.files]);

  return (
    <PageContainer title="供应商管理">
      <Tabs
        items={[
          {
            key: 'clean',
            label: '供应商货物数据清洗',
            children: (
              <>
                <Card style={{ marginBottom: 16 }}>
                  <Space direction="vertical" style={{ width: '100%' }} size="middle">
                    <div>
                      <div style={{ marginBottom: 8 }}>选择供应商</div>
                      <Input
                        value={supplier}
                        onChange={(e) => setSupplier(e.target.value)}
                        placeholder="请输入供应商编码或名称搜索"
                      />
                    </div>
                    <Upload.Dragger
                      accept=".xlsx,.xls"
                      showUploadList={false}
                      beforeUpload={(file) => {
                        if (!supplier.trim()) {
                          message.warning('请先选择供应商');
                          return false;
                        }
                        addSupplierClean(supplier.trim(), file.name);
                        message.success('已模拟上传并处理');
                        return false;
                      }}
                    >
                      <p className="ant-upload-drag-icon">
                        <InboxOutlined />
                      </p>
                      <p className="ant-upload-text">上传供应商货物数据</p>
                      <p className="ant-upload-hint">
                        支持 Excel，演示不解析真实内容；需同时选择供应商
                      </p>
                    </Upload.Dragger>
                    <Button
                      type="primary"
                      onClick={() => {
                        if (!supplier.trim()) {
                          message.warning('请先选择供应商');
                          return;
                        }
                        addSupplierClean(supplier.trim(), 'demo_supplier.xlsx');
                        message.success('已用演示文件触发清洗');
                      }}
                    >
                      上传并处理
                    </Button>
                  </Space>
                </Card>
                <Card title="数据清洗结果列表">
                  <Alert
                    showIcon
                    style={{ marginBottom: 12 }}
                    message="清洗思考：对齐货号/品牌/平台AE；报价侧不改边、不改品、不改品质"
                  />
                  <Table
                    rowKey="_key"
                    dataSource={rows}
                    locale={{ emptyText: '暂无清洗结果' }}
                    columns={[
                      { title: '来源文件', dataIndex: '_file', ellipsis: true },
                      { title: '供应商', dataIndex: '供应商', width: 120 },
                      { title: '匹配货号', dataIndex: '匹配货号', width: 120 },
                      { title: '匹配名称', dataIndex: '匹配名称', width: 120 },
                      { title: '匹配品牌', dataIndex: '匹配品牌', width: 100 },
                      { title: '原始报价', dataIndex: '原始报价', width: 100 },
                      { title: '平台AE号', dataIndex: '平台AE号', width: 120 },
                      { title: '分析备注', dataIndex: '分析备注', ellipsis: true },
                    ]}
                  />
                </Card>
              </>
            ),
          },
          {
            key: 'price',
            label: '价格对比',
            children: <Alert message="第二期：价格对比" type="info" />,
          },
          {
            key: 'offline',
            label: '线下供应商信息',
            children: <Alert message="第二期：线下供应商信息" type="info" />,
          },
          {
            key: 'rules',
            label: '供应商清洗数据规则',
            children: <Alert message="第二期：清洗规则配置" type="info" />,
          },
        ]}
      />
    </PageContainer>
  );
};

export default SupplierPage;
