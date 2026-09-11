import type { Settings as LayoutSettings } from '@ant-design/pro-components';
import { SettingDrawer } from '@ant-design/pro-components';
import type { RequestConfig, RunTimeLayoutConfig } from '@umijs/max';
import { Link, history } from '@umijs/max';
import { Button } from 'antd';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import React from 'react';

dayjs.extend(relativeTime);

import {
  AvatarDropdown,
  ErrorBoundary,
  Footer,
  OfflineBanner,
} from '@/components';
import { buildOpsCases } from '@/services/mock/catalog';
import defaultSettings from '../config/defaultSettings';
import { errorConfig } from './requestErrorConfig';

const isDev = process.env.NODE_ENV === 'development';

/** 默认操作员（静态托管，无真实登录） */
const DEMO_USER: API.CurrentUser = {
  name: 'Supply Planner',
  avatar:
    'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png',
  userid: 'planner-001',
  email: 'planner@zavashop.example',
  access: 'admin',
};

export async function getInitialState(): Promise<{
  settings?: Partial<LayoutSettings>;
  currentUser?: API.CurrentUser;
  loading?: boolean;
  fetchUserInfo?: () => Promise<API.CurrentUser | undefined>;
  settingDrawerOpen?: boolean;
}> {
  const fetchUserInfo = async () => DEMO_USER;
  return {
    fetchUserInfo,
    currentUser: DEMO_USER,
    settings: defaultSettings as Partial<LayoutSettings>,
    settingDrawerOpen: false,
  };
}

export const layout: RunTimeLayoutConfig = ({
  initialState,
  setInitialState,
}) => {
  const riskCount = buildOpsCases().length;

  return {
    menuItemRender: (item, dom) => {
      if (item.path) {
        return (
          <Link to={item.path} prefetch>
            {dom}
          </Link>
        );
      }
      return dom;
    },
    actionsRender: () => [
      <Button
        key="risks"
        type="primary"
        ghost
        size="small"
        style={{ color: '#fff', borderColor: 'rgba(255,255,255,0.65)' }}
        onClick={() => history.push('/guide')}
      >
        今日风险 {riskCount}
      </Button>,
    ],
    avatarProps: {
      src: initialState?.currentUser?.avatar,
      title: initialState?.currentUser?.name,
      render: (_, avatarChildren) => (
        <AvatarDropdown menu={false}>{avatarChildren}</AvatarDropdown>
      ),
    },
    footerRender: () => <Footer />,
    onPageChange: () => {
      // 演示模式：不做登录跳转
    },
    ErrorBoundary,
    menuHeaderRender: undefined,
    childrenRender: (children) => {
      return (
        <>
          {children}
          {isDev && (
            <SettingDrawer
              disableUrlParams
              enableDarkTheme
              collapse={initialState?.settingDrawerOpen}
              onCollapseChange={(open) => {
                setInitialState((s) => ({
                  ...s,
                  settingDrawerOpen: open,
                }));
              }}
              settings={initialState?.settings}
              onSettingChange={(settings) => {
                setInitialState((s) => ({
                  ...s,
                  settings,
                }));
              }}
            />
          )}
        </>
      );
    },
    ...initialState?.settings,
  };
};

export const request: RequestConfig = {
  baseURL: '',
  ...errorConfig,
};

export function rootContainer(container: React.ReactNode) {
  return (
    <>
      <OfflineBanner />
      {container}
    </>
  );
}
