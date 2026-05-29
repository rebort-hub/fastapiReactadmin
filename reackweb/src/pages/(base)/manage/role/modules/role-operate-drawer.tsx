import Auth from '@/components/Auth';
import { backendUserStatusOptions } from '@/constants/backend-user';
import { Perm } from '@/constants/permissions';
import { useFormRules } from '@/features/form';

import ButtonAuthModal from './button-auth-modal';
import MenuAuthModal from './menu-auth-modal';

type Props = Page.OperateDrawerProps & { rowId: number };

type Model = Api.SystemModule.RoleForm;

type RuleKey = Extract<keyof Model, 'code' | 'name' | 'status'>;

const RoleOperateDrawer: FC<Props> = memo(({ form, handleSubmit, onClose, open, operateType, rowId }) => {
  const { t } = useTranslation();

  const { defaultRequiredRule } = useFormRules();

  const [buttonAuthVisible, { setFalse: closeButtonAuthModal, setTrue: openButtonAuthModal }] = useBoolean();

  const [menuAuthVisible, { setFalse: closeMenuAuthModal, setTrue: openMenuAuthModal }] = useBoolean();

  const rules: Record<RuleKey, App.Global.FormRule> = {
    code: defaultRequiredRule,
    name: defaultRequiredRule,
    status: defaultRequiredRule
  };

  return (
    <ADrawer
      open={open}
      title={operateType === 'add' ? t('page.manage.role.addRole') : t('page.manage.role.editRole')}
      footer={
        <AFlex justify="space-between">
          <AButton onClick={onClose}>{t('common.cancel')}</AButton>
          <AButton
            type="primary"
            onClick={handleSubmit}
          >
            {t('common.confirm')}
          </AButton>
        </AFlex>
      }
      onClose={onClose}
    >
      <AForm
        form={form}
        initialValues={{ data_scope: 1, order: 1, status: '0' }}
        layout="vertical"
      >
        <AForm.Item
          label={t('page.manage.role.roleName')}
          name="name"
          rules={[rules.name]}
        >
          <AInput placeholder={t('page.manage.role.form.roleName')} />
        </AForm.Item>

        <AForm.Item
          label={t('page.manage.role.roleCode')}
          name="code"
          rules={[rules.code]}
        >
          <AInput
            disabled={operateType === 'edit'}
            placeholder={t('page.manage.role.form.roleCode')}
          />
        </AForm.Item>

        <AForm.Item
          label={t('page.manage.role.roleStatus')}
          name="status"
          rules={[rules.status]}
        >
          <ARadio.Group>
            {backendUserStatusOptions.map(item => (
              <ARadio
                key={item.value}
                value={item.value}
              >
                {t(item.label)}
              </ARadio>
            ))}
          </ARadio.Group>
        </AForm.Item>

        <AForm.Item
          label={t('page.manage.role.roleDesc')}
          name="description"
        >
          <AInput placeholder={t('page.manage.role.form.roleDesc')} />
        </AForm.Item>
      </AForm>

      {operateType === 'edit' && rowId > 0 && (
        <Auth perm={Perm.Role.permission}>
          <ASpace className="mt-16px">
            <AButton onClick={openMenuAuthModal}>{t('page.manage.role.menuAuth')}</AButton>
            <MenuAuthModal
              open={menuAuthVisible}
              roleId={rowId}
              onClose={closeMenuAuthModal}
            />

            <AButton onClick={openButtonAuthModal}>{t('page.manage.role.buttonAuth')}</AButton>
            <ButtonAuthModal
              open={buttonAuthVisible}
              roleId={rowId}
              onClose={closeButtonAuthModal}
            />
          </ASpace>
        </Auth>
      )}
    </ADrawer>
  );
});

export default RoleOperateDrawer;
