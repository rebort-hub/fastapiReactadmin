import { resetAuth } from '@/features/auth';
import { useFormRules } from '@/features/form';

type PasswordForm = Api.SystemModule.ChangePasswordForm & {
  confirm_password: string;
};

type Props = {
  onSubmit: (values: Api.SystemModule.ChangePasswordForm) => Promise<void>;
};

const PasswordSettings: FC<Props> = memo(({ onSubmit }) => {
  const { t } = useTranslation();
  const [form] = AForm.useForm<PasswordForm>();
  const [editing, setEditing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { defaultRequiredRule, formRules } = useFormRules();

  async function handleToggleSave() {
    if (!editing) {
      form.resetFields();
      setEditing(true);
      return;
    }

    try {
      setSubmitting(true);
      const values = await form.validateFields();
      await onSubmit({
        new_password: values.new_password,
        old_password: values.old_password
      });
      form.resetFields();
      setEditing(false);
      window.$message?.success(t('page.userCenter.passwordChangeSuccess'));
      resetAuth();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <ACard title={t('page.userCenter.passwordSettings')}>
      <AForm
        disabled={!editing}
        form={form}
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 16 }}
      >
        <AForm.Item
          label={t('page.userCenter.oldPassword')}
          name="old_password"
          rules={[defaultRequiredRule]}
        >
          <AInput.Password placeholder={t('page.userCenter.form.oldPassword')} />
        </AForm.Item>

        <AForm.Item
          label={t('page.userCenter.newPassword')}
          name="new_password"
          rules={formRules.pwd}
        >
          <AInput.Password placeholder={t('page.userCenter.form.newPassword')} />
        </AForm.Item>

        <AForm.Item
          label={t('page.userCenter.confirmPassword')}
          name="confirm_password"
          rules={[
            defaultRequiredRule,
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('new_password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error(t('page.userCenter.passwordMismatch')));
              }
            })
          ]}
        >
          <AInput.Password placeholder={t('page.userCenter.form.confirmPassword')} />
        </AForm.Item>

        <AForm.Item wrapperCol={{ offset: 6, span: 16 }}>
          <AButton
            loading={submitting}
            type="primary"
            onClick={handleToggleSave}
          >
            {editing ? t('common.confirm') : t('common.edit')}
          </AButton>
          {editing ? (
            <AButton
              className="ml-12px"
              onClick={() => {
                form.resetFields();
                setEditing(false);
              }}
            >
              {t('common.cancel')}
            </AButton>
          ) : null}
        </AForm.Item>
      </AForm>
    </ACard>
  );
});

export default PasswordSettings;
