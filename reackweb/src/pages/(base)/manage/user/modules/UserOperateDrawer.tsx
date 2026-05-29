import { useRequest } from 'ahooks';
import { Button, Drawer, Flex, Form, Input, Radio, Select, TreeSelect } from 'antd';
import type { FC } from 'react';

import { backendUserGenderOptions, backendUserStatusOptions } from '@/constants/backend-user';
import { useFormRules } from '@/features/form';
import { fetchGetDeptTree } from '@/service/api';
import { usePositionOptions, useRoleOptions } from '@/service/hooks';

import { mapDeptToTreeSelectData } from '@/utils/dept-tree';

type UserFormModel = Api.SystemModule.UserForm & {
  role_ids?: number[];
  position_ids?: number[];
};

type RuleKey = Extract<keyof UserFormModel, 'status' | 'username' | 'name'>;

const UserOperateDrawer: FC<Page.OperateDrawerProps> = ({ form, handleSubmit, onClose, open, operateType }) => {
  const { t } = useTranslation();

  const { data: roleOptions = [], refetch: refetchRoles } = useRoleOptions();

  const { data: positionOptions = [], refetch: refetchPositions } = usePositionOptions();

  const { data: deptTree = [] } = useRequest(fetchGetDeptTree, { ready: open });

  const { defaultRequiredRule } = useFormRules();

  const rules: Record<RuleKey, App.Global.FormRule> = {
    name: defaultRequiredRule,
    status: defaultRequiredRule,
    username: defaultRequiredRule
  };

  useUpdateEffect(() => {
    if (open) {
      refetchRoles();
      refetchPositions();
    }
  }, [open, refetchRoles, refetchPositions]);

  return (
    <Drawer
      open={open}
      title={operateType === 'add' ? t('page.manage.user.addUser') : t('page.manage.user.editUser')}
      footer={
        <Flex justify="space-between">
          <Button onClick={onClose}>{t('common.cancel')}</Button>
          <Button
            type="primary"
            onClick={handleSubmit}
          >
            {t('common.confirm')}
          </Button>
        </Flex>
      }
      onClose={onClose}
    >
      <Form
        form={form}
        initialValues={{ status: '0' }}
        layout="vertical"
      >
        <Form.Item
          label={t('page.manage.user.userName')}
          name="username"
          rules={[rules.username]}
        >
          <Input
            disabled={operateType === 'edit'}
            placeholder={t('page.manage.user.form.userName')}
          />
        </Form.Item>

        <Form.Item
          label={t('page.manage.user.nickName')}
          name="name"
          rules={[rules.name]}
        >
          <Input placeholder={t('page.manage.user.form.nickName')} />
        </Form.Item>

        <Form.Item
          label={t('page.manage.user.userGender')}
          name="gender"
        >
          <Radio.Group>
            {backendUserGenderOptions.map(item => (
              <Radio
                key={item.value}
                value={item.value}
              >
                {t(item.label)}
              </Radio>
            ))}
          </Radio.Group>
        </Form.Item>

        <Form.Item
          label={t('page.manage.user.userPhone')}
          name="mobile"
        >
          <Input placeholder={t('page.manage.user.form.userPhone')} />
        </Form.Item>

        <Form.Item
          label={t('page.manage.user.userEmail')}
          name="email"
        >
          <Input placeholder={t('page.manage.user.form.userEmail')} />
        </Form.Item>

        <Form.Item
          label="部门"
          name="dept_id"
        >
          <TreeSelect
            allowClear
            placeholder="请选择部门"
            treeData={mapDeptToTreeSelectData(deptTree)}
            treeDefaultExpandAll
          />
        </Form.Item>

        <Form.Item
          label={t('page.manage.user.userStatus')}
          name="status"
          rules={[rules.status]}
        >
          <Radio.Group>
            {backendUserStatusOptions.map(item => (
              <Radio
                key={item.value}
                value={item.value}
              >
                {t(item.label)}
              </Radio>
            ))}
          </Radio.Group>
        </Form.Item>

        <Form.Item
          label={t('page.manage.user.userRole')}
          name="role_ids"
        >
          <Select
            allowClear
            mode="multiple"
            options={roleOptions.map(item => ({ label: item.name, value: item.id }))}
            placeholder={t('page.manage.user.form.userRole')}
          />
        </Form.Item>

        <Form.Item
          label={t('page.manage.user.userPosition')}
          name="position_ids"
        >
          <Select
            allowClear
            mode="multiple"
            options={positionOptions.map(item => ({ label: item.name, value: item.id }))}
            placeholder={t('page.manage.user.form.userPosition')}
          />
        </Form.Item>

        {operateType === 'add' && (
          <Form.Item
            label="登录密码"
            name="password"
            extra="留空则使用系统默认密码"
          >
            <Input.Password placeholder="可选，创建用户登录密码" />
          </Form.Item>
        )}
      </Form>
    </Drawer>
  );
};

export default UserOperateDrawer;
