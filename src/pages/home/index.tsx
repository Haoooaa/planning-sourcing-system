import { PageContainer } from '@ant-design/pro-components';
import { history } from '@umijs/max';
import { Button, Card, Col, Row, Space, Typography } from 'antd';
import React, { useMemo } from 'react';
import { buildOpsCases, inventory, inventoryStatus, orders } from '@/services/mock/catalog';

const { Title, Paragraph, Text } = Typography;

const HomePage: React.FC = () => {
  const summary = useMemo(() => {
    const cases = buildOpsCases();
    const oos = inventory.filter((r) => inventoryStatus(r) === 'out_of_stock').length;
    const exceptions = orders.filter(
      (o) =>
        o.status === 'exception' ||
        Boolean((o as { incident?: string }).incident) ||
        Boolean((o as { exception_reason?: string }).exception_reason),
    ).length;
    return {
      risks: cases.length,
      oos,
      exceptions,
      top: cases[0],
    };
  }, []);

  return (
    <PageContainer title={false}>
      <div style={{ maxWidth: 920, margin: '0 auto', padding: '28px 8px 8px' }}>
        <Text type="secondary">今日工作台</Text>
        <Title level={2} style={{ marginTop: 4, marginBottom: 8 }}>
          先把今天的库存风险处理掉
        </Title>
        <Paragraph type="secondary" style={{ fontSize: 15, maxWidth: 560 }}>
          风险已按缺货优先、缺口货值从高到低排序。一次处理一条，确认动作后进入下一条。
          不熟业务流程时可先看「业务背景」。
        </Paragraph>

        <Card
          style={{
            marginBottom: 20,
            borderColor: '#91caff',
            background: 'linear-gradient(160deg, #ffffff 0%, #f0f7ff 100%)',
          }}
        >
          <Row gutter={[16, 12]} align="middle">
            <Col xs={24} md={14}>
              <Title level={4} style={{ marginTop: 0, marginBottom: 6 }}>
                今日有 {summary.risks} 条需关注
              </Title>
              <Paragraph type="secondary" style={{ marginBottom: 0 }}>
                缺货 {summary.oos} · 履约异常信号 {summary.exceptions}
                {summary.top
                  ? ` · 建议从 ${summary.top.sku}@${summary.top.warehouse_code} 开始`
                  : ''}
              </Paragraph>
            </Col>
            <Col xs={24} md={10} style={{ textAlign: 'right' }}>
              <Space direction="vertical" size={8} style={{ width: '100%', alignItems: 'flex-end' }}>
                <Button type="primary" size="large" onClick={() => history.push('/guide')}>
                  开始处理
                </Button>
                <Button type="link" onClick={() => history.push('/background')}>
                  先了解业务背景
                </Button>
              </Space>
            </Col>
          </Row>
        </Card>

        <Title level={5} style={{ marginBottom: 12, color: 'rgba(0,0,0,0.45)' }}>
          快捷入口
        </Title>
        <Row gutter={[12, 12]}>
          {[
            {
              title: '我想看整体数据看板',
              path: '/dashboard',
              hint: '库存健康 · 缺口货值 · PO · 异常订单',
            },
            {
              title: '我想看某个仓还剩多少可发',
              path: '/inventory',
              hint: 'Inventory · available = on_hand − reserved',
            },
            {
              title: '我想导出一份补货分析结果',
              path: '/reorder-plan',
              hint: 'Reorder Plan · 异步任务 + 结果文件',
            },
            {
              title: '我想跟进在途采购',
              path: '/purchase-orders',
              hint: 'Purchase Orders · delayed / customs_clearing',
            },
            {
              title: '我想处理卡住的客户订单',
              path: '/orders',
              hint: 'Orders · exception / incident',
            },
          ].map((item) => (
            <Col xs={24} sm={12} key={item.path}>
              <Card hoverable onClick={() => history.push(item.path)} style={{ height: '100%' }}>
                <Title level={5} style={{ marginTop: 0, marginBottom: 6 }}>
                  {item.title}
                </Title>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  {item.hint}
                </Text>
              </Card>
            </Col>
          ))}
        </Row>

        <div style={{ marginTop: 28, textAlign: 'center' }}>
          <Space split={<span style={{ color: '#d9d9d9' }}>|</span>}>
            <Button type="link" onClick={() => history.push('/warehouses')}>
              仓网络
            </Button>
            <Button type="link" onClick={() => history.push('/suppliers')}>
              供应商
            </Button>
            <Button type="link" onClick={() => history.push('/tasks')}>
              任务
            </Button>
            <Button type="link" onClick={() => history.push('/files')}>
              文件
            </Button>
          </Space>
          <Paragraph type="secondary" style={{ marginTop: 8, fontSize: 12 }}>
            ZavaShop Supply Chain · Planning &amp; Sourcing
          </Paragraph>
        </div>
      </div>
    </PageContainer>
  );
};

export default HomePage;
