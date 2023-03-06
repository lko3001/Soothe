import { useNavbarContext } from "@/context/NavbarContext";
import { Icon } from "@/components";
import { MdMenu } from "react-icons/md";

export default function NavBtn() {
  const { handleOpen } = useNavbarContext();

  return (
    <Icon
      icon={<MdMenu />}
      className="text-r-black dark:text-r-darkBlack md:hidden"
      handleClick={handleOpen}
    />
  );
}
