type QuickLoginProvider = Api.Auth.OAuthProvider;

const QUICK_LOGIN_ITEMS: {
  color: string;
  icon: string;
  key: QuickLoginProvider;
  labelKey: App.I18n.I18nKey;
}[] = [
  {
    color: '#07c160',
    icon: 'ri:wechat-fill',
    key: 'wechat',
    labelKey: 'page.login.quickLogin.wechat'
  },
  {
    color: '#12b7f5',
    icon: 'ri:qq-fill',
    key: 'qq',
    labelKey: 'page.login.quickLogin.qq'
  },
  {
    color: '#24292f',
    icon: 'mdi:github',
    key: 'github',
    labelKey: 'page.login.quickLogin.github'
  },
  {
    color: '#c71d23',
    icon: 'simple-icons:gitee',
    key: 'gitee',
    labelKey: 'page.login.quickLogin.gitee'
  }
];

interface LoginQuickLoginProps {
  onOAuth: (provider: QuickLoginProvider) => void;
}

const LoginQuickLogin = memo(({ onOAuth }: LoginQuickLoginProps) => {
  const { t } = useTranslation();

  return (
    <div className="mt-24px">
      <ADivider className="!my-0 !text-13px !text-#86909c">{t('page.login.quickLogin.title')}</ADivider>
      <div className="flex-center gap-28px pt-20px">
        {QUICK_LOGIN_ITEMS.map(item => (
          <ATooltip
            key={item.key}
            title={t(item.labelKey)}
          >
            <button
              className="h-44px w-44px flex-center cursor-pointer border-0 bg-transparent rd-full transition-300 hover:bg-#f2f3f5 dark:hover:bg-#ffffff14"
              type="button"
              onClick={() => onOAuth(item.key)}
            >
              <SvgIcon
                className="text-30px"
                icon={item.icon}
                style={{ color: item.color }}
              />
            </button>
          </ATooltip>
        ))}
      </div>
    </div>
  );
});

export default LoginQuickLogin;
