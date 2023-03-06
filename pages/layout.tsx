import { Navbar } from "@/components";
import { GetServerSidePropsContext } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./api/auth/[...nextauth]";
import { useNotesContext } from "@/context/NotesContext";
import { useThemeContext } from "@/context/ThemeContext";
import { useRouter } from "next/router";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user } = useNotesContext();
  const { isDone } = useThemeContext();
  const router = useRouter();

  return (
    <>
      {router.asPath === "/auth/logout" || router.asPath === "/auth/login" ? (
        <>{children}</>
      ) : (
        isDone && (
          <div className="flex min-h-screen bg-r-lightGray dark:bg-r-darkLightGray">
            <Navbar user={user} />
            {children}
          </div>
        )
      )}
    </>
  );
}
export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions);
  if (!session) {
    return { redirect: { destination: "/auth/login" } };
  }

  return {
    props: { session: session },
  };
}
