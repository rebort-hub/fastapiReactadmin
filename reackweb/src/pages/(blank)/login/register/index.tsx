import { useMutation } from '@tanstack/react-query';

import { useFormRules } from '@/features/form';
import { useRouter } from '@/features/router';
import { fetchRegisterUser } from '@/service/api/auth';

import LoginPageHeader from '../modules/LoginPageHeader';

import '../modules/loginForm.scss';

interface FormModel {
  confirmPassword: string;
  password: string;
  username: string;
}

const Register = () => {
  const { t } = useTranslation();

  const { navigateUp } = useRouter();

  const [form] = AForm.useForm<FormModel>();

  const { createConfirmPwdRule, formRules } = useFormRules();

  const { isPending, mutate: register } = useMutation({
    mutationFn: (values: FormModel) =>
      fetchRegisterUser({
        password: values.password,
        username: values.username
      })
  });

  function handleSubmit(params: FormModel) {
    register(params, {
      onSuccess: () => {
        window.$message?.success(t('page.login.common.validateSuccess'));
        navigateUp();
      }
    });
  }

  useKeyPress('enter', () => {
    form.submit();
  });

  return (
    <>
      <LoginPageHeader title={t('page.login.register.title')} />
      <AForm
        className="login-form w-full"
        form={form}
        layout="vertical"
        requiredMark={false}
        scrollToFirstError
        validateTrigger={['onChange', 'onSubmit']}
        onFinish={handleSubmit}
      >
        <AForm.Item
          name="username"
          rules={formRules.userName}
        >
          <AInput placeholder={t('page.login.pwdLogin.accountPlaceholder')} />
        </AForm.Item>
        <AForm.Item
          name="password"
          rules={formRules.pwd}
        >
          <AInput.Password placeholder={t('page.login.common.passwordPlaceholder')} />
        </AForm.Item>
        <AForm.Item
          name="confirmPassword"
          rules={createConfirmPwdRule(form)}
        >
          <AInput.Password placeholder={t('page.login.common.confirmPasswordPlaceholder')} />
        </AForm.Item>
        <ASpace
          className="w-full"
          direction="vertical"
          size={18}
        >
          <AButton
            block
            htmlType="submit"
            loading={isPending}
            shape="round"
            size="large"
            type="primary"
          >
            {t('common.confirm')}
          </AButton>

          <AButton
            block
            shape="round"
            size="large"
            onClick={navigateUp}
          >
            {t('page.login.common.back')}
          </AButton>
        </ASpace>
      </AForm>
    </>
  );
};

export default Register;
