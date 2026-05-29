import type { MenuProps } from 'antd';
import { useQuery } from '@tanstack/react-query';

import { selectToken } from '@/features/auth/authStore';
import { useRoute, useRouter } from '@/features/router';
import { fetchGetCurrentUserProfile } from '@/service/api';
import { useUserInfo } from '@/service/hooks';
import { QUERY_KEYS } from '@/service/keys';
import { GITHUB_REPO_URL } from '@/constants/github';
import { resolveAvatarUrl } from '@/utils/avatar';

const UserAvatar = memo(() => {
  const token = useAppSelector(selectToken);

  const { data: userInfo } = useUserInfo();

  const { data: profile } = useQuery({
    enabled: Boolean(token),
    queryFn: fetchGetCurrentUserProfile,
    queryKey: QUERY_KEYS.USER_CENTER.PROFILE
  });

  const avatarSrc = resolveAvatarUrl(profile?.avatar);
  const displayName = profile?.name || userInfo?.userName;

  const { t } = useTranslation();

  const { navigate, push } = useRouter();

  const { fullPath } = useRoute();

  function logout() {
    window?.$modal?.confirm({
      cancelText: t('common.cancel'),
      content: t('common.logoutConfirm'),
      okText: t('common.confirm'),
      onOk: () => {
        push('/login-out', { query: { redirect: fullPath } });
      },
      title: t('common.tip')
    });
  }

  function onClick({ key }: { key: string }) {
    if (key === 'logout') {
      logout();
    } else if (key === 'github') {
      window.open(GITHUB_REPO_URL, '_blank', 'noopener,noreferrer');
    } else if (key === 'user-center') {
      navigate('/user-center');
    }
  }

  function loginOrRegister() {
    navigate('/login');
  }

  const menuAvatar = (
    <AAvatar
      className="flex-shrink-0"
      size={20}
      src={avatarSrc}
    >
      {displayName?.slice(0, 1)}
    </AAvatar>
  );

  const items: MenuProps['items'] = [
    {
      key: 'user-center',
      label: (
        <div className="flex-center gap-8px">
          {menuAvatar}
          {t('common.userCenter')}
        </div>
      )
    },
    {
      key: 'github',
      label: (
        <div className="flex-center gap-8px">
          <SvgIcon
            className="text-icon"
            icon="mdi:github"
          />
          {t('page.userCenter.github')}
        </div>
      )
    },
    {
      type: 'divider'
    },
    {
      key: 'logout',
      label: (
        <div className="flex-center gap-8px">
          <SvgIcon
            className="text-icon"
            icon="ph:sign-out"
          />
          {t('common.logout')}
        </div>
      )
    }
  ];

  return token ? (
    <ADropdown
      menu={{ items, onClick }}
      placement="bottomRight"
      trigger={['click']}
    >
      <div>
        <ButtonIcon className="px-12px">
          <AAvatar
            size={28}
            src={avatarSrc}
          >
            {displayName?.slice(0, 1)}
          </AAvatar>
          <span className="text-16px font-medium">{displayName}</span>
        </ButtonIcon>
      </div>
    </ADropdown>
  ) : (
    <AButton onClick={loginOrRegister}>{t('page.login.common.loginOrRegister')}</AButton>
  );
});

export default UserAvatar;
