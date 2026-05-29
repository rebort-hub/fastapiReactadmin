import { createPortal } from 'react-dom';

import { GLOBAL_SIDER_MENU_ID } from '@/constants/app';

import FirstLevelMenu from '../components/FirstLevelMenu';
import { HorizontalMenuMode } from '../types';

import Horizontal from './Horizontal';
import { useGetElementById } from './hook';

const HorizontalMix = () => {
  const container = useGetElementById(GLOBAL_SIDER_MENU_ID);

  if (!container) return null;

  return [
    <Horizontal
      key="horizontal"
      mode={HorizontalMenuMode.Child}
    />,
    createPortal(<FirstLevelMenu key="first-level-menu" />, container)
  ];
};

export default HorizontalMix;
