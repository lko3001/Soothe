interface IconProps {
  icon: React.ReactNode;
  className?: string;
  handleClick?: () => void;
  notHover?: boolean;
}
export default function Icon({
  icon,
  className,
  handleClick,
  notHover,
}: IconProps) {
  return (
    <div
      className={`flex cursor-pointer items-center justify-center rounded-full p-3 text-xl text-r-black transition-colors duration-300 dark:text-r-darkBlack ${
        notHover
          ? "pointer-events-none"
          : "hover:bg-r-lightGray dark:hover:bg-r-darkLightGray"
      } ${className}`}
      onClick={handleClick}
    >
      {icon}
    </div>
  );
}
