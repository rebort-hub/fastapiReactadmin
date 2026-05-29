import type { DescriptionsProps } from 'antd';
import { type LoaderFunctionArgs, useLoaderData } from 'react-router-dom';

import LookForward from '@/components/LookForward';
import {
  backendUserGenderRecord,
  backendUserStatusRecord
} from '@/constants/backend-user';
import { fetchGetUserDetail } from '@/service/api';

const UserDetail = () => {
  const data = useLoaderData() as Api.SystemModule.User | null;
  const { t } = useTranslation();

  if (!data) return <LookForward />;

  const items: DescriptionsProps['items'] = [
    { children: data.username, key: 'username', label: t('page.manage.user.userName') },
    { children: data.name, key: 'name', label: t('page.manage.user.nickName') },
    {
      children: data.gender ? t(backendUserGenderRecord[data.gender]) : '-',
      key: 'gender',
      label: t('page.manage.user.userGender')
    },
    { children: data.mobile || '-', key: 'mobile', label: t('page.manage.user.userPhone') },
    { children: data.email || '-', key: 'email', label: t('page.manage.user.userEmail') },
    {
      children: data.status ? t(backendUserStatusRecord[data.status]) : '-',
      key: 'status',
      label: t('page.manage.user.userStatus')
    },
    { children: data.dept_name || data.dept?.name || '-', key: 'dept', label: '部门' },
    {
      children: data.roles?.map(item => item.name).join('、') || '-',
      key: 'roles',
      label: t('page.manage.user.userRole')
    },
    {
      children: data.positions?.map(item => item.name).join('、') || '-',
      key: 'positions',
      label: t('page.manage.user.userPosition')
    },
    { children: data.created_time || '-', key: 'created_time', label: '创建时间' },
    { children: data.last_login || '-', key: 'last_login', label: '最后登录' }
  ];

  return (
    <ACard
      className="h-full"
      title={t('page.manage.user.title')}
    >
      <ADescriptions
        bordered
        column={2}
        items={items}
      />
    </ACard>
  );
};

export async function loader({ params }: LoaderFunctionArgs) {
  const id = Number(params.id);
  if (!id) return null;

  try {
    return await fetchGetUserDetail(id);
  } catch {
    return null;
  }
}

export default UserDetail;
