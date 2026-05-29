import { createPortal } from 'react-dom';

import { GLOBAL_HEADER_MENU_ID } from '@/constants/app';

import HorizontalMenu from '../components/HorizontalMenu';
import { HorizontalMenuMode } from '../types';

import { useGetElementById } from './hook';

interface Props {
  /** 水平菜单显示模式 */
  readonly mode?: HorizontalMenuMode;
}

const Horizontal = ({ mode = HorizontalMenuMode.All }: Props) => {
  const container = useGetElementById(GLOBAL_HEADER_MENU_ID);

  if (!container) return null;

  return createPortal(<HorizontalMenu mode={mode} />, container);
};

export default Horizontal;
