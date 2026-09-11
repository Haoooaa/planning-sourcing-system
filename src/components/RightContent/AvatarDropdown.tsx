import { useModel } from '@umijs/max';
import { Spin, Tag } from 'antd';
import React from 'react';
import HeaderDropdown from '../HeaderDropdown';

type GlobalHeaderRightProps = {
  children?: React.ReactNode;
  menu?: boolean;
};

export const AvatarDropdown: React.FC<GlobalHeaderRightProps> = ({
  children,
}) => {
  const { initialState } = useModel('@@initialState');

  if (!initialState?.currentUser) {
    return <Spin size="small" />;
  }

  return (
    <HeaderDropdown
      placement="bottomRight"
      menu={{
        items: [
          {
            key: 'demo',
            label: (
              <span>
                Demo mode <Tag color="blue">no login</Tag>
              </span>
            ),
            disabled: true,
          },
        ],
      }}
      arrow
    >
      {children}
    </HeaderDropdown>
  );
};
