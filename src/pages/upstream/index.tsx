import { PageContainer } from '@ant-design/pro-components';
import {
  Button,
  Form,
  Input,
  Modal,
  Popconfirm,
  Select,
  Space,
  Table,
  message,
} from 'antd';
import React, { useMemo, useState } from 'react';
import type { UpstreamMerchant } from '@/services/mock/store';
import {
  removeUpstream,
  upsertUpstream,
} from '@/services/mock/store';
import { useDemoStore } from '@/services/mock/useDemoStore';

const UpstreamPage: React.FC = () => {
  const store = useDemoStore();
  const [filters, setFilters] = useState({
    province: undefined as string | undefined,
    carBrand: '',
    merchant: '',
  });
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<UpstreamMerchant | null>(null);
  const [form] = Form.useForm();

  const data = useMemo(() => {
    return store.upstream.filter((u) => {
      if (filters.province && u.province !== filters.province) return false;
      if (filters.carBrand && !u.carBrand.includes(filters.carBrand)) return false;
      if (
        filters.merchant &&
        !`${u.merchant}${u.merchantCode}`.includes(filters.merchant)
      )
        return false;
      return true;
    });
  }, [store.upstream, filters]);

  const openCreate = () => {
    setEditing(null);
    form.resetFields();
    form.setFieldsValue({
      province: '广东',
      carBrand: '全部',
      category: '全部',
      partsBrand: '全部',
    });
    setOpen(true);
  };

  const openEdit = (row: UpstreamMerchant) => {
    setEditing(row);
    form.setFieldsValue(row);
    setOpen(true);
  };

  return (
    <PageContainer title="区域上游商家管理">
      <Space wrap style={{ marginBottom: 16 }}>
        <Select
          allowClear
          placeholder="省"
          style={{ width: 120 }}
          value={filters.province}
          onChange={(v) => setFilters((s) => ({ ...s, province: v }))}
          options={['广东', '浙江', '北京', '福建'].map((p) => ({
            label: p,
            value: p,
          }))}
        />
        <Input
          placeholder="车品牌"
          style={{ width: 140 }}
          value={filters.carBrand}
          onChange={(e) => setFilters((s) => ({ ...s, carBrand: e.target.value }))}
        />
        <Input
          placeholder="输入商家编码或名称"
          style={{ width: 200 }}
          value={filters.merchant}
          onChange={(e) => setFilters((s) => ({ ...s, merchant: e.target.value }))}
        />
        <Button type="primary" onClick={() => message.success('已按条件筛选')}>
          查询
        </Button>
        <Button
          onClick={() =>
            setFilters({ province: undefined, carBrand: '', merchant: '' })
          }
        >
          重置
        </Button>
        <Button type="primary" ghost onClick={openCreate}>
          + 新增配置
        </Button>
      </Space>

      <Table
        rowKey="id"
        dataSource={data}
        columns={[
          { title: '序号', width: 70, render: (_, __, i) => i + 1 },
          {
            title: '上游商家',
            render: (_, r) => `${r.merchant}（${r.merchantCode}）`,
          },
          { title: '受配送网点', dataIndex: 'deliveryPoint' },
          { title: '省', dataIndex: 'province', width: 80 },
          { title: '车品牌', dataIndex: 'carBrand', width: 100 },
          { title: '品类', dataIndex: 'category', width: 100 },
          { title: '配件品牌', dataIndex: 'partsBrand', width: 100 },
          { title: '更新人', dataIndex: 'updatedBy', width: 90 },
          { title: '更新时间', dataIndex: 'updatedAt', width: 170 },
          {
            title: '操作',
            width: 140,
            render: (_, row) => (
              <Space>
                <Button type="link" onClick={() => openEdit(row)}>
                  编辑
                </Button>
                <Popconfirm
                  title="确认删除？"
                  onConfirm={() => {
                    removeUpstream(row.id);
                    message.success('已删除');
                  }}
                >
                  <Button type="link" danger>
                    删除
                  </Button>
                </Popconfirm>
              </Space>
            ),
          },
        ]}
      />

      <Modal
        title={editing ? '编辑配置' : '新增配置'}
        open={open}
        onCancel={() => setOpen(false)}
        onOk={async () => {
          const values = await form.validateFields();
          const row: UpstreamMerchant = {
            id: editing?.id || `u_${Date.now()}`,
            merchant: values.merchant,
            merchantCode: values.merchantCode,
            deliveryPoint: values.deliveryPoint,
            province: values.province,
            carBrand: values.carBrand,
            category: values.category,
            partsBrand: values.partsBrand,
            updatedBy: 'demo',
            updatedAt: new Date().toISOString().slice(0, 19).replace('T', ' '),
          };
          upsertUpstream(row);
          message.success(editing ? '已更新' : '已新增');
          setOpen(false);
        }}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="merchant" label="上游商家" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item
            name="merchantCode"
            label="商家编码"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="deliveryPoint"
            label="受配送网点"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="province" label="省" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="carBrand" label="车品牌" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="category" label="品类" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="partsBrand" label="配件品牌" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </PageContainer>
  );
};

export default UpstreamPage;
