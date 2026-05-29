import { GITHUB_REPO_URL, getTimeGreeting, validateAvatarFile } from '../shared';
import { fetchUploadCurrentUserAvatar } from '@/service/api';
import { resolveAvatarUrl } from '@/utils/avatar';
type Props = {
  avatar?: string | null;
  disabled?: boolean;
  loading?: boolean;
  onAvatarChange: (url: string) => void;
  profile: Api.SystemModule.CurrentUserProfile | null;
};

const ProfileCard: FC<Props> = memo(({ avatar, disabled, loading, onAvatarChange, profile }) => {
  const { t } = useTranslation();
  const [uploading, setUploading] = useState(false);

  const roleNames = (profile?.roles ?? []).map(item => item.name).filter(Boolean);
  const avatarSrc = resolveAvatarUrl(avatar);
  async function handleAvatarUpload(file: File) {
    const { isImage, isLt2M } = validateAvatarFile(file);
    if (!isImage) {
      window.$message?.error(t('page.userCenter.avatarTypeError'));
      return false;
    }
    if (!isLt2M) {
      window.$message?.error(t('page.userCenter.avatarSizeError'));
      return false;
    }

    try {
      setUploading(true);
      const result = await fetchUploadCurrentUserAvatar(file);
      if (result.file_url) {
        onAvatarChange(result.file_url);
        window.$message?.success(t('page.userCenter.avatarUploadSuccess'));
      }
    } finally {
      setUploading(false);
    }

    return false;
  }

  return (
    <ACard
      className="overflow-hidden text-center"
      loading={loading}
    >
      <div
        className="relative mb-16px h-120px overflow-hidden rounded-t-8px"
        style={{
          background:
            'linear-gradient(135deg, rgb(var(--primary-400-color)) 0%, rgb(var(--info-500-color)) 100%)'
        }}
      />

      <div className="-mt-48px flex flex-col items-center px-24px pb-24px">
        <div className="relative">
          <AAvatar
            className="border-2 border-white"
            size={80}
            src={avatarSrc}
          >
            {profile?.name?.slice(0, 1)}
          </AAvatar>
          <AUpload
            accept="image/*"
            beforeUpload={handleAvatarUpload}
            disabled={disabled || uploading}
            showUploadList={false}
          >
            <AButton
              className="absolute bottom-0 right-0"
              disabled={disabled}
              icon={<IconIcRoundUpload />}
              loading={uploading}
              shape="circle"
              size="small"
              type="primary"
            />
          </AUpload>
        </div>

        <p className="mt-12px text-sm text-gray-500">{getTimeGreeting(t)}</p>
        <h2 className="mt-4px text-xl font-medium">{profile?.name || '—'}</h2>
        <p className="mt-4px text-sm text-gray-500">{roleNames.join('、') || '—'}</p>

        <div className="mt-24px w-full max-w-280px text-left text-sm">
          <div className="mt-8px">
            <span className="text-gray-500">{t('page.manage.user.userEmail')}：</span>
            <span className="break-all">{profile?.email || '—'}</span>
          </div>
          <div className="mt-8px">
            <span className="text-gray-500">{t('page.manage.user.userName')}：</span>
            <span>{profile?.username || '—'}</span>
          </div>
          <div className="mt-8px">
            <span className="text-gray-500">{t('page.userCenter.dept')}：</span>
            <span>{profile?.dept_name || profile?.dept?.name || '—'}</span>
          </div>
          <div className="mt-8px">
            <span className="text-gray-500">{t('page.manage.user.userPosition')}：</span>
            <span>{(profile?.positions ?? []).map(item => item.name).join('、') || '—'}</span>
          </div>
          <div className="mt-8px flex flex-wrap items-center gap-4px">
            <span className="text-gray-500">{t('page.userCenter.github')}：</span>
            <a
              className="inline-flex items-center gap-4px break-all text-primary hover:underline"
              href={GITHUB_REPO_URL}
              rel="noopener noreferrer"
              target="_blank"
            >
              <SvgIcon
                className="text-16px"
                icon="mdi:github"
              />
              {t('page.userCenter.githubLink')}
            </a>
          </div>
        </div>

        {roleNames.length > 0 ? (
          <div className="mt-24px w-full">
            <h3 className="text-sm font-medium">{t('page.userCenter.roles')}</h3>
            <div className="mt-12px flex flex-wrap justify-center gap-8px">
              {roleNames.map(name => (
                <ATag key={name}>{name}</ATag>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </ACard>
  );
});

export default ProfileCard;
