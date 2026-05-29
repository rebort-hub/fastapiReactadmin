import type { FormInstance } from 'antd';

import { FormInstanceBinder } from './FormInstanceBinder';

/** 绑定 useTable 搜索区 form（页面无搜索栏时使用） */
export function TableFormBinder({ form }: { form: FormInstance }) {
  return (
    <FormInstanceBinder
      active={false}
      form={form}
    />
  );
}
