import { PageContainer } from '@ant-design/pro-components';
import { history, useLocation } from '@umijs/max';
import { Button, Result } from 'antd';
import React from 'react';

const titles: Record<string, string> = {
  '/batch-price': '批量改价',
  '/kit-query': '齐套数据查询',
  '/store-inventory': '店铺库存分析',
  '/no-stock-category': '不建议备货品类',
  '/wear-parts': '易损件报价',
};

const PlaceholderPage: React.FC = () => {
  const { pathname } = useLocation();
  const title = titles[pathname] || '功能模块';

  return (
    <PageContainer>
      <Result
        status="info"
        title={`${title} · 第二期`}
        subTitle="菜单已预留。第一版优先打通备货计划、齐套分析、定价、供应商与任务/文件闭环。"
        extra={
          <Button type="primary" onClick={() => history.push('/home')}>
            返回首页
          </Button>
        }
      />
    </PageContainer>
  );
};

export default PlaceholderPage;
