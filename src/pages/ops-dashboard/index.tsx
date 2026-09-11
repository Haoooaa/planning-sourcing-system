import { PageContainer } from '@ant-design/pro-components';
import { history } from '@umijs/max';
import { Column, Pie } from '@ant-design/plots';
import {
  Button,
  Card,
  Col,
  Progress,
  Row,
  Space,
  Statistic,
  Table,
  Tag,
  Typography,
} from 'antd';
import React, { useMemo } from 'react';
import {
  buildOpsCases,
  inventory,
  inventoryStatus,
  orders,
  purchaseOrders,
  skus,
  suppliers,
  warehouseHealth,
  warehouses,
} from '@/services/mock/catalog';
import { coverLabel, statusLabel } from '@/services/mock/uxCopy';
import './index.less';

const { Title, Paragraph, Text } = Typography;

const DashboardPage: React.FC = () => {
  const cases = useMemo(() => buildOpsCases(), []);
  const health = useMemo(() => warehouseHealth(), []);

  const kpis = useMemo(() => {
    const counts = { healthy: 0, below_reorder: 0, out_of_stock: 0 };
    inventory.forEach((r) => {
      counts[inventoryStatus(r)] += 1;
    });
    const gapValue = cases.reduce((s, c) => s + c.gap_value_usd, 0);
    const uncovered = cases.filter((c) => c.cover === 'uncovered').length;
    const atRiskCover = cases.filter((c) => c.cover === 'at_risk').length;
    const delayedPos = purchaseOrders.filter(
      (p) => p.status === 'delayed' || p.status === 'customs_clearing',
    ).length;
    const openPos = purchaseOrders.filter((p) => p.status !== 'delivered').length;
    const exceptions = orders.filter(
      (o) =>
        o.status === 'exception' ||
        Boolean((o as { incident?: string }).incident) ||
        Boolean((o as { exception_reason?: string }).exception_reason),
    ).length;
    const orderGmv = orders.reduce((s, o) => s + (o.total_usd || 0), 0);
    return {
      ...counts,
      gapValue: Math.round(gapValue),
      uncovered,
      atRiskCover,
      delayedPos,
      openPos,
      exceptions,
      orderGmv: Math.round(orderGmv),
      riskRows: cases.length,
    };
  }, [cases]);

  const inventoryPie = useMemo(
    () => [
      { type: '充足 healthy', value: kpis.healthy },
      { type: '偏低 below_reorder', value: kpis.below_reorder },
      { type: '缺货 out_of_stock', value: kpis.out_of_stock },
    ],
    [kpis],
  );

  const poColumn = useMemo(() => {
    const map = new Map<string, number>();
    purchaseOrders.forEach((p) => {
      map.set(p.status, (map.get(p.status) || 0) + 1);
    });
    return Array.from(map.entries()).map(([status, count]) => ({ status, count }));
  }, []);

  const whColumn = useMemo(
    () =>
      health.map((w) => ({
        warehouse: w.code,
        score: w.score,
        gap: Math.round(w.gap_value_usd),
        oos: w.out_of_stock,
      })),
    [health],
  );

  const coverPie = useMemo(() => {
    const map = new Map<string, number>();
    cases.forEach((c) => {
      const label = coverLabel[c.cover]?.zh || c.cover;
      map.set(label, (map.get(label) || 0) + 1);
    });
    return Array.from(map.entries()).map(([type, value]) => ({ type, value }));
  }, [cases]);

  return (
    <PageContainer
      title="运营看板"
      subTitle="库存健康 · 缺口货值 · 在途采购 · 履约异常"
      className="dash-page"
      extra={
        <Space>
          <Button onClick={() => history.push('/background')}>业务背景</Button>
          <Button type="primary" onClick={() => history.push('/guide')}>
            去处理今日风险
          </Button>
        </Space>
      }
    >
      <Paragraph type="secondary" style={{ marginTop: -8 }}>
        一眼看清：库存健康、缺口货值、在途采购、履约异常。点卡片可下钻到对应模块。
      </Paragraph>

      <Row gutter={[16, 16]}>
        <Col xs={12} sm={8} lg={4}>
          <Card
            className="dash-kpi is-danger"
            hoverable
            onClick={() => history.push('/guide')}
          >
            <Statistic title="缺货行" value={kpis.out_of_stock} suffix="行" />
          </Card>
        </Col>
        <Col xs={12} sm={8} lg={4}>
          <Card
            className="dash-kpi is-warn"
            hoverable
            onClick={() => history.push('/guide')}
          >
            <Statistic title="偏低行" value={kpis.below_reorder} suffix="行" />
          </Card>
        </Col>
        <Col xs={12} sm={8} lg={4}>
          <Card className="dash-kpi" hoverable onClick={() => history.push('/guide')}>
            <Statistic
              title="缺口货值"
              value={kpis.gapValue}
              prefix="$"
              valueStyle={{ color: '#b91c1c' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={8} lg={4}>
          <Card
            className="dash-kpi is-warn"
            hoverable
            onClick={() => history.push('/purchase-orders')}
          >
            <Statistic title="延误/清关 PO" value={kpis.delayedPos} />
          </Card>
        </Col>
        <Col xs={12} sm={8} lg={4}>
          <Card
            className="dash-kpi is-danger"
            hoverable
            onClick={() => history.push('/orders')}
          >
            <Statistic title="履约异常信号" value={kpis.exceptions} />
          </Card>
        </Col>
        <Col xs={12} sm={8} lg={4}>
          <Card className="dash-kpi is-ok" hoverable onClick={() => history.push('/orders')}>
            <Statistic title="订单金额" value={kpis.orderGmv} prefix="$" />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 8 }}>
        <Col xs={24} lg={8}>
          <Card title="库存健康分布" bordered={false} className="dash-card">
            <Pie
              data={inventoryPie}
              angleField="value"
              colorField="type"
              radius={0.9}
              innerRadius={0.55}
              legend={{ position: 'bottom' }}
              label={false}
              height={260}
              scale={{
                color: {
                  range: ['#52c41a', '#fa8c16', '#f5222d'],
                },
              }}
              tooltip={{
                title: 'type',
                items: [{ field: 'value', name: '行数' }],
              }}
            />
            <div className="dash-card__foot">
              共 {inventory.length} 条库存行 · {warehouses.length} 仓 · {skus.length} SKU
            </div>
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="风险覆盖（仅非健康行）" bordered={false} className="dash-card">
            <Pie
              data={coverPie}
              angleField="value"
              colorField="type"
              radius={0.9}
              innerRadius={0.55}
              legend={{ position: 'bottom' }}
              label={false}
              height={260}
              tooltip={{
                title: 'type',
                items: [{ field: 'value', name: '条数' }],
              }}
            />
            <div className="dash-card__foot">
              无在途 {kpis.uncovered} · 在途不稳 {kpis.atRiskCover} · 风险合计{' '}
              {kpis.riskRows}
            </div>
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="采购单状态" bordered={false} className="dash-card">
            <Column
              data={poColumn}
              xField="status"
              yField="count"
              height={260}
              colorField="status"
              scale={{
                color: {
                  range: ['#1677ff', '#fa8c16', '#52c41a', '#13c2c2', '#722ed1', '#eb2f96'],
                },
              }}
              axis={{
                x: { labelAutoRotate: true },
              }}
              tooltip={{
                title: 'status',
                items: [{ field: 'count', name: '单数' }],
              }}
            />
            <div className="dash-card__foot">
              开放中 {kpis.openPos} / 全部 {purchaseOrders.length} · 供应商{' '}
              {suppliers.length}
            </div>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 8 }}>
        <Col xs={24} lg={12}>
          <Card title="各仓健康分" bordered={false} className="dash-card">
            <Column
              data={whColumn}
              xField="warehouse"
              yField="score"
              height={280}
              colorField="warehouse"
              scale={{
                color: {
                  range: ['#52c41a', '#fa8c16', '#1677ff', '#13c2c2', '#f5222d'],
                },
              }}
              axis={{ y: { title: false, max: 100 } }}
              tooltip={{
                title: 'warehouse',
                items: [
                  { field: 'score', name: '健康分' },
                  { field: 'gap', name: '缺口$' },
                  { field: 'oos', name: '缺货行' },
                ],
              }}
            />
            <div className="dash-wh-list">
              {health.map((w) => (
                <div key={w.code} className="dash-wh-list__item">
                  <div className="dash-wh-list__head">
                    <Text strong>{w.code}</Text>
                    <Text type="secondary">${Math.round(w.gap_value_usd)}</Text>
                  </div>
                  <Progress
                    percent={w.score}
                    size="small"
                    status={w.score < 50 ? 'exception' : 'normal'}
                    format={(p) => `${p}%`}
                  />
                </div>
              ))}
            </div>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card
            title="优先风险清单"
            bordered={false}
            className="dash-card"
            extra={
              <Button type="link" onClick={() => history.push('/guide')}>
                打开风险队列
              </Button>
            }
          >
            <Table
              size="small"
              pagination={false}
              rowKey="key"
              dataSource={cases.slice(0, 8)}
              columns={[
                {
                  title: 'SKU',
                  dataIndex: 'sku',
                  width: 100,
                },
                {
                  title: '仓',
                  dataIndex: 'warehouse_code',
                  width: 80,
                },
                {
                  title: '状态',
                  dataIndex: 'status',
                  width: 110,
                  render: (s: string) => (
                    <Tag color={statusLabel[s]?.color}>
                      {statusLabel[s]?.zh || s}
                    </Tag>
                  ),
                },
                {
                  title: '覆盖',
                  dataIndex: 'cover',
                  width: 100,
                  render: (s: string) => (
                    <Tag color={coverLabel[s]?.color}>
                      {coverLabel[s]?.zh || s}
                    </Tag>
                  ),
                },
                {
                  title: '缺口$',
                  dataIndex: 'gap_value_usd',
                  width: 80,
                  render: (v: number) => `$${Math.round(v)}`,
                },
                {
                  title: '建议',
                  ellipsis: true,
                  render: (_: unknown, r) => r.recommendation.rationale,
                },
              ]}
            />
          </Card>
        </Col>
      </Row>

      <Card className="dash-cta" bordered={false}>
        <Space wrap align="center" style={{ width: '100%', justifyContent: 'space-between' }}>
          <div>
            <Title level={5} style={{ margin: 0 }}>
              下一步：进入风险队列做决策
            </Title>
            <Text type="secondary">
              按缺货优先、缺口货值排序，逐条确认补货与履约动作。
            </Text>
          </div>
          <Space>
            <Button onClick={() => history.push('/inventory')}>库存明细</Button>
            <Button type="primary" onClick={() => history.push('/guide')}>
              进入今日风险
            </Button>
          </Space>
        </Space>
      </Card>
    </PageContainer>
  );
};

export default DashboardPage;
