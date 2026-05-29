import { LangSwitch } from '@/features/lang';
import { ThemeSchemaSwitch } from '@/features/theme';

const LoginLayoutToolbar = memo(() => {
  return (
    <div className="absolute right-24px top-24px z-5 flex-y-center gap-8px">
      <ThemeSchemaSwitch
        className="text-20px"
        showTooltip={false}
      />
      <LangSwitch showTooltip={false} />
    </div>
  );
});

export default LoginLayoutToolbar;
