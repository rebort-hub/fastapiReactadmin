import { backendUserStatusOptions } from '@/constants/backend-user';
import { useFormRules } from '@/features/form';

type Props = Page.OperateDrawerProps;

const DictDataOperateModal: FC<Props> = memo(({ form, handleSubmit, onClose, open, operateType }) => {
  const { t } = useTranslation();
  const { defaultRequiredRule, numberRequiredRule } = useFormRules();

  return (
    <AModal
      open={open}
      title={operateType === 'add' ? t('page.manage.dict.addDictData') : t('page.manage.dict.editDictData')}
      onCancel={onClose}
      onOk={handleSubmit}
    >
      <AForm
        form={form}
        initialValues={{ dict_sort: 1, is_default: false, status: '0' }}
        layout="vertical"
      >
        <AForm.Item
          label={t('page.manage.dict.dictLabel')}
          name="dict_label"
          rules={[defaultRequiredRule]}
        >
          <AInput placeholder={t('page.manage.dict.form.dictLabel')} />
        </AForm.Item>

        <AForm.Item
          label={t('page.manage.dict.dictValue')}
          name="dict_value"
          rules={[defaultRequiredRule]}
        >
          <AInput placeholder={t('page.manage.dict.form.dictValue')} />
        </AForm.Item>

        <AForm.Item
          label={t('page.manage.dict.dictSort')}
          name="dict_sort"
          rules={[numberRequiredRule]}
        >
          <AInputNumber
            className="w-full"
            max={999}
            min={1}
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
          label={t('page.manage.dict.isDefault')}
          name="is_default"
          valuePropName="checked"
        >
          <ASwitch />
        </AForm.Item>

        <AForm.Item
          label={t('page.manage.dict.dictDesc')}
          name="description"
        >
          <AInput.TextArea rows={2} />
        </AForm.Item>
      </AForm>
    </AModal>
  );
});

export default DictDataOperateModal;
