import type { FormInstance } from 'antd';
import { Form } from 'antd';

type FormInstanceBinderProps = {
  form: FormInstance;
  /** 为 true 时表示已有可见 Form 挂载（如抽屉/弹窗打开），无需占位绑定 */
  active?: boolean;
};

/** 在 Form 未挂载时绑定 useForm 实例，消除 antd 未连接警告 */
export function FormInstanceBinder({ active = false, form }: FormInstanceBinderProps) {
  if (active) {
    return null;
  }

  return <Form component={false} form={form} />;
}
