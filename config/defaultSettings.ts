import type { ProLayoutProps } from '@ant-design/pro-components';

/**
 * Light content + dark sider for readable contrast.
 * Avoid realDark (it forces light text onto light cards).
 */
const Settings: ProLayoutProps & {
  logo?: string;
} = {
  navTheme: 'light',
  colorPrimary: '#1677ff',
  layout: 'side',
  contentWidth: 'Fluid',
  fixedHeader: true,
  fixSiderbar: true,
  colorWeak: false,
  title: 'ZavaShop 运营',
  logo: 'https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg',
  iconfontUrl: '',
  token: {
    bgLayout: '#eef2f7',
    header: {
      colorBgHeader: '#ffffff',
      colorHeaderTitle: '#0f172a',
      colorTextMenu: 'rgba(15, 23, 42, 0.72)',
      colorTextMenuSelected: '#1677ff',
      colorTextMenuActive: '#1677ff',
      colorBgMenuItemHover: 'rgba(22, 119, 255, 0.06)',
      colorBgMenuItemSelected: 'rgba(22, 119, 255, 0.1)',
      heightLayoutHeader: 56,
    },
    sider: {
      colorMenuBackground: '#0f172a',
      colorMenuItemDivider: 'rgba(255, 255, 255, 0.08)',
      colorTextMenu: 'rgba(255, 255, 255, 0.72)',
      colorTextMenuSelected: '#ffffff',
      colorTextMenuActive: '#ffffff',
      colorTextMenuItemHover: '#ffffff',
      colorBgMenuItemHover: 'rgba(255, 255, 255, 0.08)',
      colorBgMenuItemSelected: '#1677ff',
      colorBgCollapsedButton: '#ffffff',
      colorTextCollapsedButtonHover: '#1677ff',
      colorTextCollapsedButton: 'rgba(15, 23, 42, 0.45)',
    },
    pageContainer: {
      colorBgPageContainer: 'transparent',
      paddingBlockPageContainerContent: 20,
      paddingInlinePageContainerContent: 24,
    },
  },
};

export default Settings;
