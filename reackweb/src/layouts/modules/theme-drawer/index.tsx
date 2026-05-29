import { SimpleScrollbar } from '@sa/materials';

import { cacheThemeSettings } from '@/features/theme';
import { closeThemeDrawer, getThemeDrawerVisible } from '@/layouts/appStore';

import SettingSectionTitle from './components/SettingSectionTitle';
import ConfigOperation from './modules/ConfigOperation';
import DarkMode from './modules/DarkMode';
import LayoutMode from './modules/LayoutMode';
import MenuStyle from './modules/MenuStyle';
import PageFun from './modules/PageFun';
import ThemeColor from './modules/ThemeColor';

const ThemeDrawer = memo(() => {
  const { t } = useTranslation();

  const dispatch = useAppDispatch();

  const themeDrawerVisible = useAppSelector(getThemeDrawerVisible);

  function close() {
    dispatch(closeThemeDrawer());
  }

  useMount(() => {
    const saveThemeSettings = () => {
      dispatch(cacheThemeSettings());
    };

    window.addEventListener('beforeunload', saveThemeSettings);

    return () => {
      window.removeEventListener('beforeunload', saveThemeSettings);
    };
  });

  return (
    <ADrawer
      closeIcon={false}
      footer={<ConfigOperation />}
      open={themeDrawerVisible}
      styles={{ body: { padding: 0 } }}
      title={t('theme.themeDrawerTitle')}
      extra={
        <ButtonIcon
          className="h-28px"
          icon="ant-design:close-outlined"
          onClick={close}
        />
      }
      onClose={close}
    >
      <SimpleScrollbar>
        <div className="overflow-x-hidden px-24px pb-24px pt-8px">
          <SettingSectionTitle title={t('theme.themeSchema.title')} />
          <DarkMode showThemeModeOnly />
          <SettingSectionTitle title={t('theme.layoutMode.title')} />
          <LayoutMode />
          <SettingSectionTitle title={t('theme.menuStyle.title')} />
          <MenuStyle />
          <div className="mt-16px">
            <DarkMode />
          </div>
          <SettingSectionTitle title={t('theme.themeColor.title')} />
          <ThemeColor />
          <SettingSectionTitle title={t('theme.pageFunTitle')} />
          <PageFun />
        </div>
      </SimpleScrollbar>
    </ADrawer>
  );
});

export default ThemeDrawer;
