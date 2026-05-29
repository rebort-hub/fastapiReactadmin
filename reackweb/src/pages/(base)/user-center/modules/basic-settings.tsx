import { REG_EMAIL, REG_PHONE } from '@/constants/reg';
import { backendUserGenderOptions } from '@/constants/backend-user';
import { useFormRules } from '@/features/form';
import { translateOptions } from '@/utils/common';

type Props = {
  disabled?: boolean;
  initialValues?: Api.SystemModule.CurrentUserProfileForm & { username?: string; dept_name?: string };
  loading?: boolean;
  onSubmit: (values: Api.SystemModule.CurrentUserProfileForm) => Promise<void>;
};

const BasicSettings: FC<Props> = memo(({ disabled, initialValues, loading, onSubmit }) => {
  const { t } = useTranslation();
  const [form] = AForm.useForm<Api.SystemModule.CurrentUserProfileForm & { username?: string; dept_name?: string }>();
  const [editing, setEditing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { defaultRequiredRule } = useFormRules();

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue(initialValues);
    }
  }, [form, initialValues]);

  async function handleToggleSave() {
    if (!editing) {
      setEditing(true);
      return;
    }

    try {
      setSubmitting(true);
      const values = await form.validateFields();
      await onSubmit({
        avatar: values.avatar,
        email: values.email || undefined,
        gender: values.gender,
        mobile: values.mobile || undefined,
        name: values.name
      });
      setEditing(false);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <ACard
      loading={loading}
      title={t('page.userCenter.basicSettings')}
    >
      {disabled ? (
        <AAlert
          className="mb-16px"
          message={t('page.userCenter.superUserTip')}
          showIcon
          type="info"
        />
      ) : null}

      <AForm
        disabled={!editing || disabled}
        form={form}
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 16 }}
      >
        <AForm.Item
          label={t('page.manage.user.nickName')}
          name="name"
          rules={[defaultRequiredRule]}
        >
          <AInput placeholder={t('page.manage.user.form.nickName')} />
        </AForm.Item>

        <AForm.Item
          label={t('page.manage.user.userGender')}
          name="gender"
        >
          <ASelect
            allowClear
            options={translateOptions(backendUserGenderOptions)}
            placeholder={t('page.manage.user.form.userGender')}
          />
        </AForm.Item>

        <AForm.Item
          label={t('page.manage.user.userName')}
          name="username"
        >
          <AInput disabled />
        </AForm.Item>

        <AForm.Item
          label={t('page.manage.user.userEmail')}
          name="email"
          rules={[
            {
              validateTrigger: 'onBlur',
              validator: (_, value) => {
                if (!value) {
                  return Promise.resolve();
                }
                if (!REG_EMAIL.test(value)) {
                  return Promise.reject(new Error(t('form.email.invalid')));
                }
                return Promise.resolve();
              }
            }
          ]}
        >
          <AInput placeholder={t('page.manage.user.form.userEmail')} />
        </AForm.Item>

        <AForm.Item
          label={t('page.manage.user.userPhone')}
          name="mobile"
          rules={[
            {
              validateTrigger: 'onBlur',
              validator: (_, value) => {
                if (!value) {
                  return Promise.resolve();
                }
                if (!REG_PHONE.test(value)) {
                  return Promise.reject(new Error(t('form.phone.invalid')));
                }
                return Promise.resolve();
              }
            }
          ]}
        >
          <AInput placeholder={t('page.manage.user.form.userPhone')} />
        </AForm.Item>

        <AForm.Item
          label={t('page.userCenter.dept')}
          name="dept_name"
        >
          <AInput disabled />
        </AForm.Item>

        <AForm.Item wrapperCol={{ offset: 6, span: 16 }}>
          <AButton
            disabled={disabled}
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
                form.setFieldsValue(initialValues);
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

export default BasicSettings;
