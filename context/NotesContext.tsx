import { Note, Children, User } from "@/components/types";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { createContext, useEffect, useContext, useState } from "react";
import { GetServerSidePropsContext } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

interface FullValue {
  notes: Note[];
  user: User;
  isDone: boolean;
  fetchNotes: () => void;
}

const NotesContext = createContext({} as FullValue);

export function useNotesContext() {
  return useContext(NotesContext);
}

export default function NotesProvider({ children }: Children) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [user, setUser] = useState({} as User);
  const [isDone, setIsDone] = useState(false);

  const session = useSession();
  const router = useRouter();
  useEffect(() => {
    if (!isDone) {
      if (session.status === "authenticated") {
        setUser(session.data.user as User);
        fetchNotes();
      } else if (session.status === "unauthenticated") {
      }
    }
  }, [session]);

  const fetchNotes = () => {
    if (
      session.status === "authenticated" &&
      router.asPath !== "/auth/logout" &&
      router.asPath !== "/auth/login"
    ) {
      fetch(`/api/getNotes`, {
        method: "POST",
        body: JSON.stringify(session.data.user),
      })
        .then((res) => res.json())
        .then((data) => {
          const sortedNotes = data.sort((a: Note, b: Note) => {
            return (
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
          });
          setNotes(sortedNotes);
          setIsDone(true);
        });
    }
  };

  return (
    <NotesContext.Provider value={{ notes, user, fetchNotes, isDone }}>
      {children}
    </NotesContext.Provider>
  );
}
