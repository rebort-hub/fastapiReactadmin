import defaultAvatar from '@/assets/imgs/fastapireactadmin.png';

export { defaultAvatar };

/** Resolve avatar URL from API (absolute or relative). Empty returns undefined. */
export function resolveAvatarUrl(avatar?: string | null) {
  if (!avatar?.trim()) {
    return undefined;
  }

  const value = avatar.trim();
  if (/^https?:\/\//i.test(value)) {
    return value;
  }

  const base = (import.meta.env.VITE_SERVICE_BASE_URL || '').replace(/\/$/, '');
  if (base) {
    return value.startsWith('/') ? `${base}${value}` : `${base}/${value}`;
  }

  return value.startsWith('/') ? `${window.location.origin}${value}` : `${window.location.origin}/${value}`;
}
