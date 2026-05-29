import type { ReactNode } from 'react';
import type { FormItemProps } from 'antd';

import type { Model } from './shared';

type MenuFormFieldProps = {
  children: ReactNode;
  label: ReactNode;
  name: keyof Model | (string | number)[];
  rules?: FormItemProps['rules'];
};

/**
 * 外层 label 不绑定 htmlFor，避免 Radio/Select/InputNumber 等复合控件触发 label for 警告。
 */
export function MenuFormField({ children, label, name, rules }: MenuFormFieldProps) {
  return (
    <AForm.Item label={label}>
      <AForm.Item
        name={name}
        noStyle
        rules={rules}
      >
        {children}
      </AForm.Item>
    </AForm.Item>
  );
}
