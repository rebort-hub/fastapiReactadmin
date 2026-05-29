import { transformRecordToOption } from '@/utils/common';

/** 后端用户状态：0 启用，1 禁用 */
export const backendUserStatusRecord: Record<Api.SystemModule.UserStatus, App.I18n.I18nKey> = {
  '0': 'page.manage.common.status.enable',
  '1': 'page.manage.common.status.disable'
};

export const backendUserStatusOptions = transformRecordToOption(backendUserStatusRecord);

export const BACKEND_USER_STATUS_TAG_MAP: Record<Api.SystemModule.UserStatus, string> = {
  '0': 'success',
  '1': 'default'
};

/** 后端性别：0 男，1 女，2 未知 */
export const backendUserGenderRecord: Record<Api.SystemModule.UserGender, App.I18n.I18nKey> = {
  '0': 'page.manage.user.gender.male',
  '1': 'page.manage.user.gender.female',
  '2': 'page.manage.user.gender.unknown'
};

export const backendUserGenderOptions = transformRecordToOption(backendUserGenderRecord);

export const BACKEND_USER_GENDER_TAG_MAP: Record<Api.SystemModule.UserGender, string> = {
  '0': 'processing',
  '1': 'error',
  '2': 'default'
};
