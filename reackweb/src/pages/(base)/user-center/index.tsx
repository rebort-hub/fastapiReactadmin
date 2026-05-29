import { useQuery, useQueryClient } from '@tanstack/react-query';

import { fetchGetUserInfo } from '@/service/api/auth';
import {
  fetchChangeCurrentUserPassword,
  fetchGetCurrentUserProfile,
  fetchUpdateCurrentUserProfile
} from '@/service/api';
import { QUERY_KEYS } from '@/service/keys';
import { localStg } from '@/utils/storage';

import BasicSettings from './modules/basic-settings';
import PasswordSettings from './modules/password-settings';
import ProfileCard from './modules/profile-card';

const UserCenter = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const { data: profile, isLoading, refetch } = useQuery({
    queryFn: fetchGetCurrentUserProfile,
    queryKey: QUERY_KEYS.USER_CENTER.PROFILE
  });

  const [avatar, setAvatar] = useState<string | undefined>(profile?.avatar ?? undefined);

  useEffect(() => {
    setAvatar(profile?.avatar ?? undefined);
  }, [profile?.avatar]);

  const basicInitialValues = useMemo(() => {
    if (!profile) {
      return undefined;
    }

    return {
      avatar: profile.avatar ?? undefined,
      dept_name: profile.dept_name || profile.dept?.name,
      email: profile.email ?? undefined,
      gender: profile.gender ?? undefined,
      mobile: profile.mobile ?? undefined,
      name: profile.name,
      username: profile.username
    };
  }, [profile]);

  async function refreshUserCaches() {
    await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USER_CENTER.PROFILE });
    await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.AUTH.USER_INFO });
    const userInfo = await fetchGetUserInfo();
    localStg.set('userInfo', userInfo);
    await refetch();
  }

  async function handleBasicSubmit(values: Api.SystemModule.CurrentUserProfileForm) {
    await fetchUpdateCurrentUserProfile({
      ...values,
      avatar: avatar || values.avatar
    });
    window.$message?.success(t('page.userCenter.profileSaveSuccess'));
    await refreshUserCaches();
  }

  async function handlePasswordSubmit(values: Api.SystemModule.ChangePasswordForm) {
    await fetchChangeCurrentUserPassword(values);
  }

  function handleAvatarChange(url: string) {
    setAvatar(url);
  }

  return (
    <div className="h-full min-h-500px overflow-auto p-16px">
      <ARow gutter={[16, 16]}>
        <ACol
          lg={8}
          span={24}
          xl={7}
        >
          <ProfileCard
            avatar={avatar}
            disabled={Boolean(profile?.is_superuser)}
            loading={isLoading}
            profile={profile ?? null}
            onAvatarChange={handleAvatarChange}
          />
        </ACol>

        <ACol
          lg={16}
          span={24}
          xl={17}
        >
          <div className="flex flex-col gap-16px">
            <BasicSettings
              disabled={Boolean(profile?.is_superuser)}
              initialValues={basicInitialValues}
              loading={isLoading}
              onSubmit={handleBasicSubmit}
            />
            <PasswordSettings onSubmit={handlePasswordSubmit} />
          </div>
        </ACol>
      </ARow>
    </div>
  );
};

export default UserCenter;
