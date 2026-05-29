import clsx from 'clsx';

import { themeMenuStyleRecord } from '@/constants/app';
import { getThemeSettings, hasVerticalSiderMenu, setMenuStyle } from '@/features/theme';

import style from './menuStyle.module.scss';

const MENU_STYLES: UnionKey.ThemeMenuStyle[] = ['light', 'dark', 'layout'];

const MenuStylePreview = ({ menuStyle }: { menuStyle: UnionKey.ThemeMenuStyle }) => (
  <div className={style['menu-style-preview']}>
    <div className={clsx(style['menu-style-sider'], style[menuStyle])} />
    <div className={style['menu-style-content']}>
      <div className={style.header} />
      <div className={style.body} />
    </div>
  </div>
);

const MenuStyle = memo(() => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const themeSettings = useAppSelector(getThemeSettings);
  const menuStyle = themeSettings.sider.menuStyle ?? (themeSettings.sider.inverted ? 'dark' : 'light');
  const show = hasVerticalSiderMenu(themeSettings.layout.mode);

  function handleChange(value: UnionKey.ThemeMenuStyle) {
    dispatch(setMenuStyle(value));
  }

  if (!show) return null;

  return (
    <div className="grid grid-cols-3 justify-items-center gap-x-12px gap-y-8px">
      {MENU_STYLES.map(item => (
        <div
          className="flex-col-center cursor-pointer gap-8px"
          key={item}
          onClick={() => handleChange(item)}
        >
          <div
            className={clsx(
              style['menu-style-card'],
              'border-2px border-transparent hover:border-primary',
              menuStyle === item && 'border-primary!'
            )}
          >
            <MenuStylePreview menuStyle={item} />
          </div>
          <span className="text-12px text-base-text">{t(themeMenuStyleRecord[item])}</span>
        </div>
      ))}
    </div>
  );
});

export default MenuStyle;
