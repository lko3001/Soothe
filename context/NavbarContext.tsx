import { Children } from "@/components/types";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { createContext, useEffect, useContext, useState } from "react";

interface NavTypes {
  open: boolean;
  handleOpen: () => void;
}

const NavbarContext = createContext({} as NavTypes);

export function useNavbarContext() {
  return useContext(NavbarContext);
}

export default function NavbarProvider({ children }: Children) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (open) {
      setOpen(false);
    }
  }, [router.asPath]);

  const handleOpen = () => setOpen((prev) => !prev);
  return (
    <NavbarContext.Provider value={{ open, handleOpen }}>
      {children}
    </NavbarContext.Provider>
  );
}
