import { useQuery } from '@tanstack/react-query';

import { globalConfig } from '@/config';
import { useInitAuth } from '@/features/auth/auth';
import {
  buildLoginPathWithoutOAuthQuery,
  consumeOAuthCallback,
  startOAuthLogin
} from '@/features/auth/oauth';
import { useFormRules } from '@/features/form';
import { useRouter } from '@/features/router';
import { fetchGetCaptcha } from '@/service/api/auth';

import LoginPageHeader from './modules/LoginPageHeader';
import LoginQuickLogin from './modules/LoginQuickLogin';

import './modules/loginForm.scss';

type LoginFormValues = {
  captcha?: string;
  password: string;
  userName: string;
};

const INITIAL_VALUES: LoginFormValues = {
  password: '123456',
  userName: 'admin'
};

const PwdLogin = () => {
  const { t } = useTranslation();

  const { loading, toLogin } = useInitAuth();

  const [form] = AForm.useForm<LoginFormValues>();

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { replace } = useRouter();

  const {
    formRules: { account, loginPwd }
  } = useFormRules();

  const { data: captcha, refetch: reloadCaptcha } = useQuery({
    queryFn: fetchGetCaptcha,
    queryKey: ['auth', 'captcha']
  });

  useEffect(() => {
    async function handleOAuth() {
      const handled = await consumeOAuthCallback(
        searchParams,
        () => {
          window.$notification?.success({
            message: t('page.login.common.loginSuccess')
          });
          const redirect = searchParams.get('redirect');
          replace(redirect || globalConfig.homePath);
        },
        message => {
          window.$message?.error(message);
        }
      );

      if (handled) {
        replace(buildLoginPathWithoutOAuthQuery(searchParams));
      }
    }

    handleOAuth();
  }, []);

  function goRegister() {
    navigate('register');
  }

  function goResetPwd() {
    navigate('reset-pwd');
  }

  async function handleFinish(values: LoginFormValues) {
    if (captcha?.enable && !values.captcha) {
      window.$message?.warning(t('page.login.codeLogin.imageCodePlaceholder'));
      return;
    }

    await toLogin({
      captcha: values.captcha,
      captchaKey: captcha?.key,
      password: values.password,
      userName: values.userName
    });

    if (captcha?.enable) {
      form.setFieldValue('captcha', '');
      reloadCaptcha();
    }
  }

  useKeyPress('enter', () => {
    form.submit();
  });

  return (
    <>
      <LoginPageHeader
        subtitle={t('page.login.pwdLogin.welcomeDesc')}
        title={t('page.login.pwdLogin.welcomeTitle')}
      />

      <AForm
        className="login-form w-full"
        form={form}
        initialValues={INITIAL_VALUES}
        layout="vertical"
        requiredMark={false}
        scrollToFirstError
        validateTrigger={['onChange', 'onSubmit']}
        onFinish={handleFinish}
      >
        <AForm.Item
          name="userName"
          rules={account}
        >
          <AInput
            className="w-full"
            placeholder={t('page.login.pwdLogin.accountPlaceholder')}
            size="large"
          />
        </AForm.Item>

        <AForm.Item
          name="password"
          rules={loginPwd}
        >
          <AInput.Password
            autoComplete="password"
            className="w-full"
            placeholder={t('page.login.common.passwordPlaceholder')}
            size="large"
          />
        </AForm.Item>

        {captcha?.enable ? (
          <AForm.Item
            name="captcha"
            rules={[{ message: t('page.login.codeLogin.imageCodePlaceholder'), required: true, validateTrigger: ['onChange', 'onSubmit'] }]}
          >
            <div className="w-full flex-y-center gap-12px">
              <AInput
                className="min-w-0 flex-1"
                placeholder={t('page.login.codeLogin.imageCodePlaceholder')}
                size="large"
              />
              <button
                className="h-40px min-w-112px shrink-0 cursor-pointer border border-#e5e6eb rd-8px bg-#f7f8fa p-0 overflow-hidden"
                type="button"
                onClick={() => reloadCaptcha()}
              >
                {captcha.imgBase ? (
                  <img
                    alt="captcha"
                    className="h-full w-full object-cover"
                    src={captcha.imgBase}
                  />
                ) : null}
              </button>
            </div>
          </AForm.Item>
        ) : null}

        <div className="mb-24px flex-y-center justify-between">
          <ACheckbox>{t('page.login.pwdLogin.rememberPassword')}</ACheckbox>
          <span className="text-14px text-#86909c">{t('page.login.pwdLogin.loginValidity')}</span>
        </div>

        <AButton
          block
          htmlType="submit"
          icon={<SvgIcon icon="mdi:login" />}
          loading={loading}
          size="large"
          type="primary"
        >
          {t('page.login.pwdLogin.loginButton')}
        </AButton>

        <div className="mt-24px flex-y-center justify-between text-14px">
          <AButton
            className="!px-0"
            type="link"
            onClick={goRegister}
          >
            {t('page.login.pwdLogin.noAccountRegister')}
          </AButton>
          <AButton
            className="!px-0"
            type="link"
            onClick={goResetPwd}
          >
            {t('page.login.pwdLogin.forgetPasswordLink')}
          </AButton>
        </div>
      </AForm>

      <LoginQuickLogin onOAuth={startOAuthLogin} />
    </>
  );
};

export default PwdLogin;
