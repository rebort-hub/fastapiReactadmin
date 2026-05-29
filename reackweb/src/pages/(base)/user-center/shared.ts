import type { TFunction } from 'i18next';

export { GITHUB_REPO_URL } from '@/constants/github';

export function getTimeGreeting(t: TFunction) {
  const hour = new Date().getHours();

  if (hour >= 6 && hour < 9) {
    return t('page.userCenter.greeting.morning');
  }
  if (hour >= 9 && hour < 11) {
    return t('page.userCenter.greeting.forenoon');
  }
  if (hour >= 11 && hour < 13) {
    return t('page.userCenter.greeting.noon');
  }
  if (hour >= 13 && hour < 18) {
    return t('page.userCenter.greeting.afternoon');
  }
  if (hour >= 18 && hour < 24) {
    return t('page.userCenter.greeting.evening');
  }
  return t('page.userCenter.greeting.night');
}

export function validateAvatarFile(file: File) {
  const isImage = file.type.startsWith('image/');
  const isLt2M = file.size / 1024 / 1024 < 2;
  return { isImage, isLt2M };
}
