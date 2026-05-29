import { useRequest } from 'ahooks';

import { BACKEND_USER_STATUS_TAG_MAP, backendUserStatusRecord } from '@/constants/backend-user';
import { useRoute } from '@/features/router';
import { fetchGetRoleDetail } from '@/service/api';

const RoleDetail = () => {
  const { t } = useTranslation();
  const { params } = useRoute<null, null, { slug: string[] }>();

  const roleId = Number(params?.slug?.[0]);

  const { data, loading } = useRequest(() => fetchGetRoleDetail(roleId), {
    ready: Number.isFinite(roleId) && roleId > 0,
    refreshDeps: [roleId]
  });

  return (
    <ACard
      className="h-full"
      loading={loading}
      title={t('page.manage.role.title')}
    >
      {data ? (
        <ADescriptions
          bordered
          column={1}
        >
          <ADescriptions.Item label={t('page.manage.role.roleName')}>{data.name}</ADescriptions.Item>
          <ADescriptions.Item label={t('page.manage.role.roleCode')}>{data.code}</ADescriptions.Item>
          <ADescriptions.Item label={t('page.manage.role.roleStatus')}>
            {data.status ? (
              <ATag color={BACKEND_USER_STATUS_TAG_MAP[data.status]}>{t(backendUserStatusRecord[data.status])}</ATag>
            ) : (
              '-'
            )}
          </ADescriptions.Item>
          <ADescriptions.Item label={t('page.manage.role.roleDesc')}>{data.description || '-'}</ADescriptions.Item>
          <ADescriptions.Item label="数据范围">{data.data_scope ?? 1}</ADescriptions.Item>
          <ADescriptions.Item label="菜单权限数">{data.menus?.length ?? 0}</ADescriptions.Item>
        </ADescriptions>
      ) : (
        <AEmpty description={t('common.noData')} />
      )}
    </ACard>
  );
};

export default RoleDetail;
