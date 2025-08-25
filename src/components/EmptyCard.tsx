export const EmptyCard = ({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) => {
  return (
    <div
      className={`${className} h-640 w-360 rounded-xl bg-white/10 shadow-xl`}
    >
      {children}
    </div>
  );
};
