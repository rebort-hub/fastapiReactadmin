type Props = {
  subtitle?: string;
  title: string;
};

const LoginPageHeader = ({ subtitle, title }: Props) => {
  return (
    <header className="mb-32px">
      <h1 className="text-28px text-#1d2129 font-600 leading-tight dark:text-white:88">{title}</h1>
      {subtitle ? <p className="mt-8px text-14px text-#86909c dark:text-white:65">{subtitle}</p> : null}
    </header>
  );
};

export default LoginPageHeader;
