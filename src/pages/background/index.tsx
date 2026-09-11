import { PageContainer } from '@ant-design/pro-components';
import { history } from '@umijs/max';
import { Button, Card, Col, Row, Space, Steps, Tag, Typography } from 'antd';
import React, { useMemo, useState } from 'react';
import { warehouses } from '@/services/mock/catalog';
import NetworkMap from './NetworkMap';
import './index.less';

const { Title, Paragraph, Text } = Typography;

const roles = [
  {
    title: '仓管 / 计划',
    job: '每天先看可发库存，标出缺货与偏低',
  },
  {
    title: '采购',
    job: '对在途 PO：能不能救火、要不要加急',
  },
  {
    title: '履约 / 客服',
    job: '处理 exception 订单，协调改期或调拨',
  },
  {
    title: '寻源',
    job: '按品类匹配供应商与 Incoterm',
  },
];

const pains = [
  {
    title: '账面有货，实际发不了',
    detail: 'on_hand 看着不少，但 reserved 被订单占住，可发 available 可能已经是 0。',
  },
  {
    title: '缺货时不知道先看谁',
    detail: '要同时看库存、在途采购、他仓盈余、客户异常单，信息散在各处。',
  },
  {
    title: '系统爱替人做决定',
    detail: '真实运营往往需要人工判断：等入库、催 PO、调拨还是新建采购——不能一刀切删行或自动下单。',
  },
];

const BackgroundPage: React.FC = () => {
  const [focusWh, setFocusWh] = useState('LON-02');
  const regions = useMemo(() => {
    const set = new Set(warehouses.map((w) => w.region));
    return Array.from(set);
  }, []);
  const focusMeta = warehouses.find((w) => w.code === focusWh);

  return (
    <PageContainer title={false} className="bg-page">
      <section className="bg-hero">
        <div className="bg-hero__copy">
          <Tag color="blue">业务背景</Tag>
          <Title level={1} className="bg-hero__title">
            ZavaShop 全球电商供应链
            <span>仓网里的货，如何按时到客户手里</span>
          </Title>
          <Paragraph className="bg-hero__desc">
            ZavaShop 经营家居、园艺、小家电等品类，履约中心覆盖美西、欧洲、亚太、拉美与中东。
            本页说明运营背景与库存口径，随后可进入「今日风险」做补货与履约决策。
          </Paragraph>
          <Space wrap>
            <Button type="primary" size="large" onClick={() => history.push('/guide')}>
              去处理今日风险
            </Button>
            <Button size="large" onClick={() => history.push('/home')}>
              回工作台
            </Button>
          </Space>
        </div>
        <div className="bg-hero__visual">
          <NetworkMap variant="hero" onSelect={setFocusWh} />
        </div>
      </section>

      <section className="bg-section">
        <Title level={2}>公司在干什么</Title>
        <Paragraph type="secondary" className="bg-lead">
          客户在网上下单 → 履约中心拣货发运 → 库存不够就补货或调拨。听起来简单，难在「可发」口径和跨仓协同。
        </Paragraph>
        <Steps
          direction="vertical"
          size="small"
          current={-1}
          items={[
            {
              title: '客户下单',
              description: '订单落到某个 ship_to_warehouse，占用 reserved。',
            },
            {
              title: '仓内履约',
              description: '用 available（可发）承诺发货；不够就会 exception。',
            },
            {
              title: '补货与在途',
              description: '对照 reorder_point，看开放 PO 能否覆盖缺口，或从他仓调拨。',
            },
            {
              title: '入库上架',
              description: 'PO delivered / putaway 后，on_hand 回升，风险解除。',
            },
          ]}
        />
      </section>

      <section className="bg-section">
        <Title level={2}>运营痛点</Title>
        <Row gutter={[16, 16]}>
          {pains.map((p) => (
            <Col xs={24} md={8} key={p.title}>
              <Card className="bg-pain" bordered={false}>
                <Title level={4}>{p.title}</Title>
                <Paragraph type="secondary" style={{ marginBottom: 0 }}>
                  {p.detail}
                </Paragraph>
              </Card>
            </Col>
          ))}
        </Row>
      </section>

      <section className="bg-section">
        <Title level={2}>一张图看懂口径</Title>
        <Paragraph type="secondary" className="bg-lead">
          全公司只用这一套数说话，避免「系统说有货、现场发不出」。
        </Paragraph>
        <div className="bg-formula">
          <div className="bg-formula__row">
            <span>可发 available</span>
            <b>= max(0, on_hand − reserved)</b>
          </div>
          <div className="bg-formula__rules">
            <div>
              <Tag color="red">缺货</Tag> available ≤ 0
            </div>
            <div>
              <Tag color="orange">偏低</Tag> available &lt; reorder_point
            </div>
            <div>
              <Tag color="green">充足</Tag> 其余情况
            </div>
          </div>
          <Paragraph type="secondary" style={{ marginBottom: 0, marginTop: 12 }}>
            系统只给 note / 建议，不自动删行、不自动建采购单——把判断留给人。
          </Paragraph>
        </div>
      </section>

      <section className="bg-section">
        <Title level={2}>谁在用</Title>
        <Row gutter={[12, 12]}>
          {roles.map((r) => (
            <Col xs={24} sm={12} key={r.title}>
              <Card size="small" className="bg-role" bordered={false}>
                <Text strong>{r.title}</Text>
                <Paragraph type="secondary" style={{ margin: '6px 0 0' }}>
                  {r.job}
                </Paragraph>
              </Card>
            </Col>
          ))}
        </Row>
      </section>

      <section className="bg-section">
        <Title level={2}>全球仓网</Title>
        <Paragraph type="secondary" className="bg-lead">
          {warehouses.length} 个履约中心 · 区域 {regions.join(' / ')}。悬停或点击地图上的仓点查看详情。
        </Paragraph>
        <NetworkMap variant="section" onSelect={setFocusWh} />
        <Row gutter={[12, 12]} style={{ marginTop: 14 }}>
          {warehouses.map((w) => (
            <Col xs={24} sm={12} md={8} lg={4} key={w.code} style={{ flex: 1 }}>
              <Card
                size="small"
                className={`bg-wh ${focusWh === w.code ? 'is-active' : ''}`}
                bordered={false}
                onClick={() => setFocusWh(w.code)}
                style={{ cursor: 'pointer' }}
              >
                <Tag color={focusWh === w.code ? 'blue' : 'default'}>{w.code}</Tag>
                <div className="bg-wh__name">{w.name}</div>
                <Text type="secondary">{w.region}</Text>
                <div className="bg-wh__sup">Supervisor · {w.supervisor}</div>
              </Card>
            </Col>
          ))}
        </Row>
        {focusMeta ? (
          <Paragraph type="secondary" style={{ marginTop: 12 }}>
            当前聚焦：{focusMeta.code} · {focusMeta.address}
          </Paragraph>
        ) : null}
        <Button style={{ marginTop: 8 }} onClick={() => history.push('/warehouses')}>
          查看仓库主数据
        </Button>
      </section>

      <section className="bg-section">
        <Title level={2}>典型场景</Title>
        <Card className="bg-story" bordered={false}>
          <Paragraph>
            <Text strong>伦敦仓 LON-02</Text> 的{' '}
            <Text code>SKU-6190</Text>（Cordless Hedge Trimmer 40V）可发为 0 → 客户订单
            标成 <Text code>exception</Text>（OUT_OF_STOCK）。
          </Paragraph>
          <Paragraph>
            同时有一张到 LON-02 的采购单状态是 <Text code>delayed</Text>（北海风暴改线）。
            西雅图 SEA-01 同 SKU 还有盈余，于是晨会常见决策是：
            <Text strong> 催 PO + 评估跨仓调拨 + 先安抚客户</Text>。
          </Paragraph>
          <Paragraph type="secondary" style={{ marginBottom: 0 }}>
            「今日风险」会把这类 case 排在前面，并给出系统建议，供确认或改选。
          </Paragraph>
        </Card>
      </section>

      <section className="bg-section bg-section--end">
        <Title level={3} style={{ marginBottom: 8 }}>
          建议浏览路径
        </Title>
        <Paragraph type="secondary">
          业务背景 → 今日风险 → 按需下钻库存 / 采购 / 订单。
        </Paragraph>
        <Space wrap>
          <Button type="primary" size="large" onClick={() => history.push('/guide')}>
            进入今日风险
          </Button>
          <Button size="large" onClick={() => history.push('/inventory')}>
            先看库存明细
          </Button>
        </Space>
        <Paragraph type="secondary" style={{ marginTop: 20, marginBottom: 0, fontSize: 12 }}>
          主数据与单据字段沿用 ZavaShop 供应链英文口径
        </Paragraph>
      </section>
    </PageContainer>
  );
};

export default BackgroundPage;
