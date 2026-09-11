import {
  CheckOutlined,
  LeftOutlined,
  QuestionCircleOutlined,
  RightOutlined,
} from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';
import { history } from '@umijs/max';
import {
  Alert,
  Button,
  Card,
  Col,
  Collapse,
  Progress,
  Row,
  Space,
  Table,
  Tag,
  Tooltip,
  Typography,
  message,
} from 'antd';
import React, { useEffect, useMemo, useState } from 'react';
import {
  type OpsAction,
  type OpsCase,
  buildOpsCases,
} from '@/services/mock/catalog';
import {
  actionLabel,
  availableExplain,
  coverLabel,
  statusLabel,
} from '@/services/mock/uxCopy';
import './index.less';

const { Title, Paragraph, Text } = Typography;

const TIP_KEY = 'zavashop_guide_tip_dismissed';

const GuidePage: React.FC = () => {
  const cases = useMemo(() => buildOpsCases(), []);
  const [index, setIndex] = useState(0);
  const [decided, setDecided] = useState<Record<string, OpsAction>>({});
  const [showTip, setShowTip] = useState(false);
  const [showMoreActions, setShowMoreActions] = useState(false);

  useEffect(() => {
    try {
      setShowTip(localStorage.getItem(TIP_KEY) !== '1');
    } catch {
      setShowTip(true);
    }
  }, []);

  const current = cases[index];
  const done = Object.keys(decided).length;
  const total = cases.length;
  const progress = total ? Math.round((done / total) * 100) : 0;

  const go = (next: number) => {
    if (!cases.length) return;
    setIndex(((next % cases.length) + cases.length) % cases.length);
    setShowMoreActions(false);
  };

  const dismissTip = () => {
    setShowTip(false);
    try {
      localStorage.setItem(TIP_KEY, '1');
    } catch {
      /* ignore */
    }
  };

  const decide = (action: OpsAction) => {
    if (!current) return;
    setDecided((prev) => ({ ...prev, [current.key]: action }));
    message.success(`已记下：${actionLabel[action].zh}`);
  };

  if (!current) {
    return (
      <PageContainer title={false} className="guide-page">
        <Card>
          <Title level={3}>今天没有需要处理的库存风险</Title>
          <Paragraph type="secondary">所有仓的可发库存都达到再订货点。</Paragraph>
          <Button type="primary" onClick={() => history.push('/inventory')}>
            去看库存
          </Button>
        </Card>
      </PageContainer>
    );
  }

  const st = statusLabel[current.status];
  const cv = coverLabel[current.cover];
  const rec = current.recommendation.action;
  const recCopy = actionLabel[rec];
  const myDecision = decided[current.key];
  const remaining = cases.filter((c) => !decided[c.key]).length;

  const otherActions = (Object.keys(actionLabel) as OpsAction[]).filter((a) => a !== rec);

  return (
    <PageContainer title={false} className="guide-page guide-page--simple">
      <header className="guide-topbar">
        <div>
          <Text type="secondary">今日目标</Text>
          <Title level={3} className="guide-topbar__title">
            给每条库存风险定一个动作
          </Title>
        </div>
        <div className="guide-topbar__progress">
          <div className="guide-topbar__progress-text">
            已处理 <b>{done}</b> / {total}
            {remaining > 0 ? (
              <span> · 还剩 {remaining} 条</span>
            ) : (
              <span> · 全部完成</span>
            )}
          </div>
          <Progress percent={progress} showInfo={false} strokeColor="#1677ff" />
        </div>
      </header>

      {showTip ? (
        <Alert
          className="guide-tip"
          type="info"
          showIcon
          closable
          onClose={dismissTip}
          message="使用说明"
          description={
            <span>
              队列按缺货优先、缺口货值从高到低排列。聚焦当前一条，确认或改选动作后进入下一条。
              字段保留英文名，旁侧提供中文释义。
            </span>
          }
        />
      ) : null}

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={7}>
          <Card className="guide-queue" bordered={false} title="待办队列">
            <Paragraph type="secondary" className="guide-queue__hint">
              点一条即可切换；打勾表示你已定过动作。
            </Paragraph>
            <div className="guide-queue__list">
              {cases.map((c, i) => {
                const decidedHere = Boolean(decided[c.key]);
                return (
                  <button
                    key={c.key}
                    type="button"
                    className={`guide-queue__item ${i === index ? 'is-active' : ''} ${
                      decidedHere ? 'is-done' : ''
                    }`}
                    onClick={() => {
                      setIndex(i);
                      setShowMoreActions(false);
                    }}
                  >
                    <span className="guide-queue__idx">{i + 1}</span>
                    <span className="guide-queue__body">
                      <strong>
                        {c.sku}
                        <Text type="secondary"> · {c.warehouse_code}</Text>
                      </strong>
                      <small>{statusLabel[c.status].zh}</small>
                    </span>
                    {decidedHere ? (
                      <CheckOutlined className="guide-queue__check" />
                    ) : (
                      <span className="guide-queue__money">${Math.round(c.gap_value_usd)}</span>
                    )}
                  </button>
                );
              })}
            </div>
          </Card>
        </Col>

        <Col xs={24} lg={17}>
          <Card className="guide-focus" bordered={false}>
            <div className="guide-focus__nav">
              <Button icon={<LeftOutlined />} onClick={() => go(index - 1)}>
                上一条
              </Button>
              <Text type="secondary">
                第 {index + 1} / {total} 条
              </Text>
              <Button type="primary" onClick={() => go(index + 1)}>
                下一条 <RightOutlined />
              </Button>
            </div>

            <div className="guide-focus__headline">
              <Space wrap size={[8, 8]}>
                <Tag color={st.color}>
                  {st.zh}
                  <Text type="secondary" style={{ marginLeft: 6, color: 'inherit', opacity: 0.85 }}>
                    {current.status}
                  </Text>
                </Tag>
                <Tag color={cv.color}>
                  {cv.zh}
                  <Text type="secondary" style={{ marginLeft: 6, color: 'inherit', opacity: 0.85 }}>
                    {current.cover}
                  </Text>
                </Tag>
                {current.has_exception_order ? <Tag color="red">关联履约异常</Tag> : null}
              </Space>
              <Title level={2} className="guide-focus__title">
                {current.product}
              </Title>
              <Paragraph className="guide-focus__sub">
                {current.sku} · {current.warehouse}（{current.warehouse_code}）
              </Paragraph>
            </div>

            <div className="guide-story">
              <div className="guide-story__block">
                <div className="guide-story__label">
                  发生了什么？
                  <Tooltip title={st.hint}>
                    <QuestionCircleOutlined />
                  </Tooltip>
                </div>
                <Paragraph className="guide-story__text">
                  {availableExplain(current.on_hand, current.reserved, current.available)}。
                  再订货点是 <b>{current.reorder_point}</b>，还差 <b>{current.gap}</b> 件到安全水位
                  {current.gap > 0 ? (
                    <>
                      （约 <b>${current.gap_value_usd}</b>）
                    </>
                  ) : null}
                  。
                </Paragraph>
              </div>

              <div className="guide-story__block">
                <div className="guide-story__label">
                  为什么重要？
                  <Tooltip title={cv.hint}>
                    <QuestionCircleOutlined />
                  </Tooltip>
                </div>
                <Paragraph className="guide-story__text">
                  {cv.zh}：{cv.hint}
                  {current.has_exception_order
                    ? ' 另外已有客户订单卡在异常，需要一起闭环。'
                    : ''}
                </Paragraph>
              </div>
            </div>

            <div className="guide-nums">
              <div className="guide-num">
                <span>账面 on_hand</span>
                <b>{current.on_hand}</b>
              </div>
              <div className="guide-num">
                <span>占用 reserved</span>
                <b>{current.reserved}</b>
              </div>
              <div className="guide-num is-key">
                <span>可发 available</span>
                <b>{current.available}</b>
              </div>
              <div className="guide-num">
                <span>再订货点</span>
                <b>{current.reorder_point}</b>
              </div>
            </div>

            <Collapse
              ghost
              className="guide-details"
              items={[
                {
                  key: 'po',
                  label: `在途采购（${current.open_pos.length}）`,
                  children: (
                    <Table
                      size="small"
                      pagination={false}
                      rowKey="po_number"
                      dataSource={current.open_pos}
                      locale={{ emptyText: '没有开放采购单' }}
                      columns={[
                        { title: '采购单', dataIndex: 'po_number' },
                        { title: '数量', dataIndex: 'qty', width: 70 },
                        { title: '状态', dataIndex: 'status', width: 130 },
                        { title: 'ETA', dataIndex: 'eta', width: 110 },
                        { title: '最近事件', dataIndex: 'last_event', ellipsis: true },
                      ]}
                    />
                  ),
                },
                {
                  key: 'transfer',
                  label: `可调拨候选（${current.transfers.length}）`,
                  children: (
                    <Table
                      size="small"
                      pagination={false}
                      rowKey="from"
                      dataSource={current.transfers.slice(0, 5)}
                      locale={{ emptyText: '暂无他仓盈余' }}
                      columns={[
                        { title: '从哪仓', dataIndex: 'from', width: 90 },
                        { title: '仓名', dataIndex: 'from_name', ellipsis: true },
                        { title: '可发', dataIndex: 'available', width: 80 },
                        { title: '盈余', dataIndex: 'surplus', width: 80 },
                      ]}
                    />
                  ),
                },
                {
                  key: 'orders',
                  label: `相关客户订单（${current.related_orders.length}）`,
                  children: (
                    <Table
                      size="small"
                      pagination={false}
                      rowKey="order_id"
                      dataSource={current.related_orders}
                      locale={{ emptyText: '没有相关订单' }}
                      columns={[
                        { title: '订单', dataIndex: 'order_id' },
                        { title: '客户', dataIndex: 'customer_id', width: 100 },
                        { title: '状态', dataIndex: 'status', width: 100 },
                        {
                          title: '说明',
                          ellipsis: true,
                          render: (_: unknown, r: OpsCase['related_orders'][number]) =>
                            (r as { exception_reason?: string; incident?: string })
                              .exception_reason ||
                            (r as { incident?: string }).incident ||
                            '—',
                        },
                      ]}
                    />
                  ),
                },
              ]}
            />

            <div className="guide-decide">
              <div className="guide-decide__head">
                <Title level={4} style={{ margin: 0 }}>
                  建议你这样做
                </Title>
                <Paragraph type="secondary" style={{ margin: '4px 0 0' }}>
                  {recCopy.why}
                  <br />
                  <Text type="secondary">系统依据：{current.recommendation.rationale}</Text>
                </Paragraph>
              </div>

              <Space wrap size="middle" className="guide-decide__primary">
                <Button
                  type="primary"
                  size="large"
                  onClick={() => {
                    decide(rec);
                    history.push(recCopy.path);
                  }}
                >
                  采用建议：{recCopy.zh}
                </Button>
                <Button
                  size="large"
                  onClick={() => {
                    decide(rec);
                    go(index + 1);
                  }}
                >
                  记下建议，看下一条
                </Button>
              </Space>

              {myDecision ? (
                <Paragraph className="guide-decide__yours">
                  你已选择：<Tag color="blue">{actionLabel[myDecision].zh}</Tag>
                </Paragraph>
              ) : null}

              <div className="guide-decide__alt">
                <Button type="link" onClick={() => setShowMoreActions((v) => !v)}>
                  {showMoreActions ? '收起其他选项' : '查看其他选项'}
                </Button>
                {showMoreActions ? (
                  <Space wrap>
                    {otherActions.map((a) => (
                      <Button
                        key={a}
                        onClick={() => {
                          decide(a);
                          message.info(actionLabel[a].why);
                        }}
                      >
                        {actionLabel[a].zh}
                      </Button>
                    ))}
                  </Space>
                ) : null}
              </div>
            </div>
          </Card>

          {done === total && total > 0 ? (
            <Alert
              style={{ marginTop: 16 }}
              type="success"
              showIcon
              message="今天的风险条目都有动作了"
              description="可以去 Reorder Plan 导出分析文件，或到 Tasks / Files 查看异步结果。"
              action={
                <Button type="primary" onClick={() => history.push('/reorder-plan')}>
                  去导出分析
                </Button>
              }
            />
          ) : null}
        </Col>
      </Row>

      <footer className="guide-footer-links">
        <Button type="link" onClick={() => history.push('/background')}>
          业务背景
        </Button>
        <Button type="link" onClick={() => history.push('/inventory')}>
          库存明细
        </Button>
        <Button type="link" onClick={() => history.push('/purchase-orders')}>
          采购单
        </Button>
        <Button type="link" onClick={() => history.push('/orders')}>
          客户订单
        </Button>
        <Button type="link" onClick={() => history.push('/home')}>
          回首页
        </Button>
      </footer>
    </PageContainer>
  );
};

export default GuidePage;
