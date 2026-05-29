import { Outlet } from 'react-router-dom';

import SystemLogo from '@/components/SystemLogo';

import LoginBrandPanel from './modules/LoginBrandPanel';
import LoginLayoutToolbar from './modules/LoginLayoutToolbar';

const LoginLayout = () => {
  const { t } = useTranslation();

  return (
    <div className="size-full flex overflow-hidden">
      <LoginBrandPanel />

      <section className="relative flex flex-1 flex-col bg-container">
        <LoginLayoutToolbar />

        <div className="flex flex-1 items-center justify-center overflow-y-auto px-32px py-48px lg:px-48px">
          <div className="w-full min-w-320px max-w-450px">
            <div className="mb-32px flex-y-center gap-10px lg:hidden">
              <SystemLogo className="h-36px w-36px text-primary" />
              <span className="text-18px text-#1d2129 font-600">{t('system.title')}</span>
            </div>
            <Outlet />
          </div>
        </div>
      </section>
    </div>
  );
};

export default LoginLayout;
