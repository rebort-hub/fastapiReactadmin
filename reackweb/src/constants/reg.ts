/** 与后端 username_validator 一致：字母开头，3-32 位，仅含字母/数字/_ . - */
export const REG_USER_NAME = /^[A-Za-z][A-Za-z0-9_.-]{2,31}$/;

/** Phone reg — 与后端 mobile_validator 一致 */
export const REG_PHONE =
  /^1(3\d|4[4-9]|5[0-35-9]|6[67]|7[013-8]|8[0-9]|9[0-9])\d{8}$/;

/** 与后端 password_plain_validator 一致：6-128 位 */
export const PASSWORD_MIN_LEN = 6;
export const PASSWORD_MAX_LEN = 128;

/** Email reg */
export const REG_EMAIL = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;

/** Six digit code reg */
export const REG_CODE_SIX = /^\d{6}$/;

/** Four digit code reg */
export const REG_CODE_FOUR = /^\d{4}$/;

/** Url reg */
export const REG_URL =
  /(((^https?:(?:\/\/)?)(?:[-;:&=+$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=+$,\w]+@)[A-Za-z0-9.-]+)((?:\/[+~%/.\w-_]*)?\??(?:[-+=&;%@.\w_]*)#?(?:[\w]*))?)$/;

/** 与后端 validate_required_code 一致：字母开头，2-16 位字母/数字/下划线 */
export const REG_CODE = /^[A-Za-z][A-Za-z0-9_]{1,15}$/;

/** 与后端 dict_type 校验一致：小写字母开头，小写字母/数字/下划线 */
export const REG_DICT_TYPE = /^[a-z][a-z0-9_]*$/;
