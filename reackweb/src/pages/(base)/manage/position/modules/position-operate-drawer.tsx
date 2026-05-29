import { backendUserStatusOptions } from '@/constants/backend-user';
import { useFormRules } from '@/features/form';

type Props = Page.OperateDrawerProps;

type Model = Api.SystemModule.PositionForm;

type RuleKey = Extract<keyof Model, 'name' | 'status'>;

const PositionOperateDrawer: FC<Props> = memo(({ form, handleSubmit, onClose, open, operateType }) => {
  const { t } = useTranslation();

  const { defaultRequiredRule } = useFormRules();

  const rules: Record<RuleKey, App.Global.FormRule> = {
    name: defaultRequiredRule,
    status: defaultRequiredRule
  };

  return (
    <ADrawer
      open={open}
      title={operateType === 'add' ? t('page.manage.position.addPosition') : t('page.manage.position.editPosition')}
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
        initialValues={{ order: 1, status: '0' }}
        layout="vertical"
      >
        <AForm.Item
          label={t('page.manage.position.positionName')}
          name="name"
          rules={[rules.name]}
        >
          <AInput placeholder={t('page.manage.position.form.positionName')} />
        </AForm.Item>

        <AForm.Item
          label={t('page.manage.position.order')}
          name="order"
        >
          <AInputNumber
            className="w-full"
            min={1}
            placeholder={t('page.manage.position.form.order')}
          />
        </AForm.Item>

        <AForm.Item
          label={t('page.manage.position.positionStatus')}
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
          label={t('page.manage.position.positionDesc')}
          name="description"
        >
          <AInput.TextArea
            placeholder={t('page.manage.position.form.positionDesc')}
            rows={3}
          />
        </AForm.Item>
      </AForm>
    </ADrawer>
  );
});

export default PositionOperateDrawer;
