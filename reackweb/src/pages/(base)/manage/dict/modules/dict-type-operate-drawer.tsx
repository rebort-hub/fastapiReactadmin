import { backendUserStatusOptions } from '@/constants/backend-user';
import { REG_DICT_TYPE } from '@/constants/reg';
import { FORM_VALIDATE_TRIGGER, useFormRules } from '@/features/form';

type Props = Page.OperateDrawerProps;

const DictTypeOperateDrawer: FC<Props> = memo(({ form, handleSubmit, onClose, open, operateType }) => {
  const { t } = useTranslation();
  const { defaultRequiredRule } = useFormRules();

  const dictTypeRule: App.Global.FormRule = {
    message: t('page.manage.dict.form.dictTypeInvalid'),
    pattern: REG_DICT_TYPE,
    validateTrigger: FORM_VALIDATE_TRIGGER
  };

  return (
    <ADrawer
      open={open}
      title={operateType === 'add' ? t('page.manage.dict.addDictType') : t('page.manage.dict.editDictType')}
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
        initialValues={{ status: '0' }}
        layout="vertical"
      >
        <AForm.Item
          label={t('page.manage.dict.dictName')}
          name="dict_name"
          rules={[defaultRequiredRule]}
        >
          <AInput placeholder={t('page.manage.dict.form.dictName')} />
        </AForm.Item>

        <AForm.Item
          label={t('page.manage.dict.dictType')}
          name="dict_type"
          rules={[defaultRequiredRule, dictTypeRule]}
        >
          <AInput
            disabled={operateType === 'edit'}
            placeholder={t('page.manage.dict.form.dictType')}
          />
        </AForm.Item>

        <AForm.Item
          label={t('page.manage.dict.dictStatus')}
          name="status"
          rules={[defaultRequiredRule]}
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
          label={t('page.manage.dict.dictDesc')}
          name="description"
        >
          <AInput.TextArea
            placeholder={t('page.manage.dict.form.dictDesc')}
            rows={3}
          />
        </AForm.Item>
      </AForm>
    </ADrawer>
  );
});

export default DictTypeOperateDrawer;
