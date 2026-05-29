import { backendUserStatusOptions } from '@/constants/backend-user';
import { NOTICE_TYPE_OPTIONS } from '@/constants/notice';
import { useFormRules } from '@/features/form';
import { translateOptions } from '@/utils/common';

type Props = Page.OperateDrawerProps;

type Model = Api.SystemModule.NoticeForm;

type RuleKey = Extract<keyof Model, 'notice_title' | 'notice_type' | 'notice_content' | 'status'>;

const NoticeOperateDrawer: FC<Props> = memo(({ form, handleSubmit, onClose, open, operateType }) => {
  const { t } = useTranslation();
  const { defaultRequiredRule } = useFormRules();

  const rules: Record<RuleKey, App.Global.FormRule> = {
    notice_content: defaultRequiredRule,
    notice_title: defaultRequiredRule,
    notice_type: defaultRequiredRule,
    status: defaultRequiredRule
  };

  return (
    <ADrawer
      open={open}
      title={operateType === 'add' ? t('page.manage.notice.addNotice') : t('page.manage.notice.editNotice')}
      width={720}
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
          label={t('page.manage.notice.noticeTitle')}
          name="notice_title"
          rules={[rules.notice_title]}
        >
          <AInput placeholder={t('page.manage.notice.form.noticeTitle')} />
        </AForm.Item>

        <AForm.Item
          label={t('page.manage.notice.noticeType')}
          name="notice_type"
          rules={[rules.notice_type]}
        >
          <ASelect
            options={translateOptions(NOTICE_TYPE_OPTIONS)}
            placeholder={t('page.manage.notice.form.noticeType')}
          />
        </AForm.Item>

        <AForm.Item
          label={t('page.manage.notice.noticeStatus')}
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
          label={t('page.manage.notice.noticeContent')}
          name="notice_content"
          rules={[rules.notice_content]}
        >
          <AInput.TextArea
            placeholder={t('page.manage.notice.form.noticeContent')}
            rows={8}
          />
        </AForm.Item>

        <AForm.Item
          label={t('page.manage.notice.description')}
          name="description"
        >
          <AInput.TextArea
            placeholder={t('page.manage.notice.form.description')}
            rows={2}
          />
        </AForm.Item>
      </AForm>
    </ADrawer>
  );
});

export default NoticeOperateDrawer;
