import clsx from 'clsx';

import DarkModeContainer from '@/components/DarkModeContainer.tsx';
import { GLOBAL_SIDER_MENU_ID } from '@/constants/app';
import { ThemeContext, getSiderMenuAppearance, getThemeSettings } from '@/features/theme';

import '@/styles/css/darkMode.css';

import GlobalLogo from './GlobalLogo';

interface Props {
  headerHeight: number;
  isHorizontalMix: boolean;
  isVerticalMix: boolean;
  siderCollapse: boolean;
}

const GlobalSider: FC<Props> = memo(({ headerHeight, isHorizontalMix, isVerticalMix, siderCollapse }) => {
  const { darkMode } = useContext(ThemeContext);
  const themeSettings = useAppSelector(getThemeSettings);

  const showLogo = !isVerticalMix && !isHorizontalMix;

  const { siderClassName, siderInverted, siderMenuContainerClassName } = getSiderMenuAppearance(
    themeSettings.sider,
    darkMode
  );
  const darkMenu = !darkMode && !isHorizontalMix && siderInverted;

  return (
    <DarkModeContainer
      className={clsx('size-full flex-col-stretch shadow-sider', siderClassName)}
      inverted={darkMenu}
    >
      {showLogo && (
        <GlobalLogo
          showTitle={!siderCollapse}
          style={{ height: `${headerHeight}px` }}
        />
      )}
      <div
        className={clsx(showLogo ? 'flex-1-hidden' : 'h-full', siderMenuContainerClassName)}
        id={GLOBAL_SIDER_MENU_ID}
      />
    </DarkModeContainer>
  );
});

export default GlobalSider;
