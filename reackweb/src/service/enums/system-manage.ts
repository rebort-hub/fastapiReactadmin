/** System manage enums */

/**
 * User gender
 *
 * - "1": male
 * - "2": female
 */
export enum UserGender {
  /** Male */
  MALE = '1',
  /** Female */
  FEMALE = '2'
}

export type UserGenderValue = `${UserGender}`;

/**
 * Menu type
 *
 * - "1": directory
 * - "2": menu
 */
export enum MenuType {
  /** Directory */
  DIRECTORY = '1',
  /** Menu */
  MENU = '2'
}

export type MenuTypeValue = `${MenuType}`;

/**
 * Icon type
 *
 * - "1": iconify icon
 * - "2": local icon
 */
export enum IconType {
  /** Iconify icon */
  ICONIFY = '1',
  /** Local icon */
  LOCAL = '2'
}

export type IconTypeValue = `${IconType}`;
