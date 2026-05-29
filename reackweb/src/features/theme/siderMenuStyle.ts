export type SiderMenuAppearance = {
  menuStyle: UnionKey.ThemeMenuStyle;
  siderClassName?: string;
  siderInverted: boolean;
  /** Class for menu portal container (#GLOBAL_SIDER_MENU_ID) */
  siderMenuContainerClassName?: string;
};

/** Resolve sider menu appearance from theme settings */
export function getSiderMenuAppearance(sider: App.Theme.ThemeSetting['sider'], darkMode: boolean): SiderMenuAppearance {
  const menuStyle = sider.menuStyle ?? (sider.inverted ? 'dark' : 'light');
  const siderInverted = !darkMode && menuStyle === 'dark';

  let siderMenuContainerClassName: string | undefined;
  if (siderInverted) {
    siderMenuContainerClassName = 'sider-menu-container--dark';
  } else if (!darkMode && menuStyle === 'layout') {
    siderMenuContainerClassName = 'sider-menu-container--layout';
  }

  return {
    menuStyle,
    siderClassName: !darkMode && menuStyle === 'layout' ? 'bg-layout! shadow-none' : undefined,
    siderInverted,
    siderMenuContainerClassName
  };
}

/** Whether the current layout has a vertical sider menu */
export function hasVerticalSiderMenu(layoutMode: UnionKey.ThemeLayoutMode) {
  return layoutMode !== 'horizontal';
}
