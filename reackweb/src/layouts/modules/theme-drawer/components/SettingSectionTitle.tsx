type Props = {
  title: string;
};

const SettingSectionTitle = ({ title }: Props) => {
  return (
    <div className="my-20px flex-y-center gap-12px">
      <div className="h-1px flex-1 bg-#e5e6eb dark:bg-#3f3f46" />
      <span className="shrink-0 text-14px text-base-text font-medium">{title}</span>
      <div className="h-1px flex-1 bg-#e5e6eb dark:bg-#3f3f46" />
    </div>
  );
};

export default SettingSectionTitle;
