import type { TooltipProps } from 'antd';
import { Tooltip } from 'antd';
import clsx from 'clsx';

import { LAYOUT_MODE_ORDER, themeLayoutModeRecord } from '@/constants/app';
import { setLayoutMode } from '@/features/theme';
import { getIsMobile } from '@/layouts/appStore';

type LayoutConfig = Record<
  UnionKey.ThemeLayoutMode,
  {
    placement: TooltipProps['placement'];
  }
>;

const LAYOUT_CONFIG: LayoutConfig = {
  horizontal: { placement: 'top' },
  'horizontal-mix': { placement: 'top' },
  vertical: { placement: 'top' },
  'vertical-mix': { placement: 'top' }
};

interface Props extends Record<UnionKey.ThemeLayoutMode, React.ReactNode> {
  mode: UnionKey.ThemeLayoutMode;
}

const LayoutModeCard: FC<Props> = ({ mode, ...rest }: Props) => {
  const isMobile = useAppSelector(getIsMobile);
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  function handleChangeMode(modeType: UnionKey.ThemeLayoutMode) {
    if (isMobile) return;

    dispatch(setLayoutMode(modeType));
  }

  return (
    <div className="grid grid-cols-2 justify-items-center gap-x-24px gap-y-16px">
      {LAYOUT_MODE_ORDER.map(key => {
        const item = LAYOUT_CONFIG[key];

        return (
          <div
            className="flex-col-center cursor-pointer gap-8px"
            key={key}
            onClick={() => handleChangeMode(key)}
          >
            <Tooltip
              placement={item.placement}
              title={t(themeLayoutModeRecord[key])}
            >
              <div
                className={clsx(
                  'rd-8px bg-container p-8px shadow-sm transition-300 border-2px border-transparent hover:border-primary',
                  mode === key && 'border-primary!'
                )}
              >
                <div
                  className={clsx(
                    'h-64px w-96px gap-6px rd-6px p-6px bg-layout',
                    key.includes('vertical') ? 'flex' : 'flex-col'
                  )}
                >
                  {rest[key]}
                </div>
              </div>
            </Tooltip>
            <span className="text-12px text-base-text">{t(themeLayoutModeRecord[key])}</span>
          </div>
        );
      })}
    </div>
  );
};

export default LayoutModeCard;
