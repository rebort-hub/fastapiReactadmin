import dayjs from 'dayjs';
import { useQuery } from '@tanstack/react-query';

import { fetchGetCurrentUserProfile } from '@/service/api';
import { defaultAvatar, resolveAvatarUrl } from '@/utils/avatar';
import { useUserInfo } from '@/service/hooks';
import { QUERY_KEYS } from '@/service/keys';

import { useHomeData } from '../use-home-data';

const HomeHeader = () => {
  const { t } = useTranslation();

  const { data: userInfo } = useUserInfo();
  const { data: profile } = useQuery({
    queryFn: fetchGetCurrentUserProfile,
    queryKey: QUERY_KEYS.USER_CENTER.PROFILE
  });
  const { data: dashboard } = useHomeData();

  const [now, setNow] = useState(dayjs());

  useEffect(() => {
    const timer = window.setInterval(() => setNow(dayjs()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const displayName = profile?.name || userInfo?.userName || 'Admin';
  const avatar = resolveAvatarUrl(profile?.avatar) ?? defaultAvatar;
  const roleName = profile?.roles?.[0]?.name || t('page.home.superAdmin');

  return (
    <div className="card-wrapper rd-12px bg-white px-24px py-20px shadow-sm">
      <ARow
        align="middle"
        gutter={[16, 16]}
      >
        <ACol
          lg={14}
          span={24}
        >
          <div>
            <h2 className="mb-8px text-22px font-600">
              {t('page.home.welcomeTitle', { userName: displayName })}
              <span className="ml-8px">👋</span>
            </h2>
            <p className="mb-0 text-14px text-gray-500">{t('page.home.welcomeDesc')}</p>
          </div>
        </ACol>

        <ACol
          lg={10}
          span={24}
        >
          <div className="flex flex-wrap items-center justify-end gap-16px">
            <div className="flex items-center gap-12px rd-10px bg-#f5f7fb px-16px py-10px">
              <div className="text-right">
                <div className="text-13px text-gray-500">{now.format('YYYY年MM月DD日 dddd')}</div>
                <div className="text-20px text-primary font-600 font-mono">{now.format('HH:mm:ss')}</div>
              </div>
              <div className="size-40px flex-center rd-full bg-warning/15 text-20px">☀️</div>
            </div>

            <div className="flex items-center gap-12px rd-10px bg-#f5f7fb px-16px py-10px">
              <AAvatar
                size={40}
                src={avatar}
              >
                {displayName.slice(0, 1)}
              </AAvatar>
              <div>
                <div className="text-14px font-600">{displayName}</div>
                <div className="text-12px text-gray-500">{roleName}</div>
              </div>
            </div>
          </div>
        </ACol>
      </ARow>

      {dashboard?.overview ? (
        <div className="mt-16px hidden text-12px text-gray-400 md:block">
          {t('page.home.systemSummary', {
            logCount: dashboard.overview.logCount,
            onlineCount: dashboard.overview.onlineCount,
            userCount: dashboard.overview.userCount
          })}
        </div>
      ) : null}
    </div>
  );
};

export default HomeHeader;
