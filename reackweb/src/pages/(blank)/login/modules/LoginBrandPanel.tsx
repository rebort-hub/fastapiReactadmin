import LoginBg from '@/components/LoginBg';
import SystemLogo from '@/components/SystemLogo';

import LoginIllustration from './LoginIllustration';

const LoginBrandPanel = memo(() => {
  const { t } = useTranslation();

  return (
    <section className="relative hidden flex-[1.85] overflow-hidden lg:flex">
      <LoginBg />

      <div className="relative z-2 flex-col-stretch size-full">
        <div className="flex-y-center gap-10px px-40px pt-32px">
          <SystemLogo className="h-36px w-36px text-primary" />
          <span className="text-18px text-#1d2129 font-600 dark:text-white:88">{t('system.title')}</span>
        </div>

        <div className="flex flex-1 flex-col-center justify-center px-40px">
          <LoginIllustration />
          <div className="mt-48px text-center">
            <h2 className="text-32px text-#1d2129 font-600 dark:text-white:88">{t('system.title')}</h2>
            <p className="mt-16px max-w-480px text-14px text-#86909c leading-relaxed dark:text-white:65">
              {t('page.login.brand.subtitle')}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
});

export default LoginBrandPanel;
