import { ThemeMode } from 'ahooks/lib/useTheme';
import type { ThemeModeType } from 'ahooks/lib/useTheme';
import type { SegmentedOptions } from 'antd/es/segmented';
import { useContext } from 'react';

import style from './ThemeSchemaSegmented.module.scss';
import { ThemeContext, icons } from './themeContext';

const OPTIONS = Object.values(ThemeMode).map(item => {
  const key = item as ThemeModeType;
  return {
    label: (
      <div className="h-36px w-full flex-center">
        <SvgIcon
          className="h-22px text-icon"
          icon={icons[key]}
        />
      </div>
    ),
    value: item
  };
}) satisfies SegmentedOptions;

const ThemeSchemaSegmented = () => {
  const { setThemeScheme, themeScheme } = useContext(ThemeContext);

  return (
    <ASegmented
      block
      className={style['theme-schema-segmented']}
      options={OPTIONS}
      value={themeScheme}
      onChange={setThemeScheme}
    />
  );
};

export default ThemeSchemaSegmented;
