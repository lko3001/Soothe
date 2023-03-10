import { MdNightlight, MdAdd, MdHome, MdDeleteForever } from "react-icons/md";
import { Icon } from "@/components";
import { useRouter } from "next/router";
import { useRef } from "react";
import Link from "next/link";
import { User } from "./types";
import { useNavbarContext } from "@/context/NavbarContext";
import { useThemeContext } from "@/context/ThemeContext";
import { useNotesContext } from "@/context/NotesContext";
import { toast } from "react-hot-toast";

export default function Navbar({ user }: { user?: User }) {
  const router = useRouter();
  const path = router.asPath;
  const toastId = useRef<string>("");
  const { open, handleOpen } = useNavbarContext();
  const { toggleDarkMode } = useThemeContext();
  const { fetchNotes } = useNotesContext();

  function deleteNote() {
    toastId.current = toast.loading("Deleting note...", {
      id: toastId.current,
      position: "top-right",
    });
    const pathArr = path.split("/");
    const id = pathArr[pathArr.length - 1];

    return fetch("/api/deleteNote", {
      method: "POST",
      body: JSON.stringify({ id: id }),
    })
      .then((res) => res.json())
      .then((data) => {
        fetchNotes();
        toast.success("Note has been deleted!", {
          id: toastId.current,
          position: "top-right",
          duration: 300,
        });
        setTimeout(() => {
          router.push("/");
        }, 500);
      });
  }

  return (
    <>
      <div
        className={`pointer-events-none fixed top-0 left-0 z-10 h-screen w-screen transition-colors duration-300 md:hidden ${
          open
            ? "pointer-events-auto bg-r-black/30 dark:bg-r-darkBlack/30"
            : "bg-transparent"
        }`}
        onClick={() => handleOpen()}
      ></div>
      <nav
        className={`fixed left-0 top-0 z-20 flex h-screen flex-col items-center justify-center gap-4 p-2 transition-transform duration-300 md:sticky [&>*]:shadow-lg [&>*]:shadow-r-black/5 [&>*]:dark:shadow-r-darkWhite/5 ${
          open ? "" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <Icon
          icon={<MdAdd />}
          className="w-fit rotate-45 bg-r-black text-r-white !transition-all hover:scale-105 hover:bg-r-black/90 dark:bg-r-darkBlack dark:text-r-darkWhite dark:hover:bg-r-darkBlack/90 md:hidden"
          handleClick={handleOpen}
        />
        <div className="flex h-full flex-col items-center justify-between gap-4 rounded-full bg-r-white p-2 dark:bg-r-darkWhite">
          <div>
            {/* New Note Button */}
            {path !== "/editor" && (
              <Link passHref href={"/editor"}>
                <Icon
                  icon={<MdAdd />}
                  className="mb-4 w-fit bg-r-accentWarm text-r-white !transition-all hover:scale-105 hover:bg-r-warmHover hover:shadow-md hover:shadow-r-accentWarm/50 dark:bg-r-darkAccentWarm dark:text-r-darkWhite dark:hover:!bg-r-darkWarmHover"
                />
              </Link>
            )}
            {/* Home Button */}
            {path !== "/" && (
              <Link passHref href={"/"}>
                <Icon
                  icon={<MdHome />}
                  className="mb-4 w-fit bg-r-accentCold text-r-white !transition-all hover:scale-105 hover:!bg-r-coldHover hover:shadow-md hover:shadow-r-accentCold/50 dark:bg-r-darkAccentCold dark:text-r-darkWhite dark:hover:!bg-r-darkColdHover dark:hover:shadow-r-darkAccentCold/50"
                />
              </Link>
            )}
            {/* Delete Note Button */}
            {path.includes("/note/") && (
              <Icon
                icon={<MdDeleteForever />}
                className="mb-4 w-fit bg-red-500 text-r-white !transition-all hover:scale-105 hover:!bg-red-400 hover:shadow-md hover:shadow-red-500/50 dark:text-r-darkWhite"
                handleClick={deleteNote}
              />
            )}
          </div>
          <div className="flex flex-col gap-4">
            <Icon icon={<MdNightlight />} handleClick={toggleDarkMode} />
            <Link href={"/profile"}>
              <div className="group h-11 w-11 cursor-pointer rounded-full bg-r-accentWarm dark:bg-r-darkAccentWarm">
                <img
                  src={user?.image || "https://i.imgur.com/AMXv0rn.png"}
                  className="h-full w-full rounded-full transition-transform duration-300 group-hover:scale-75"
                />
              </div>
            </Link>
          </div>
        </div>
      </nav>
    </>
  );
}
