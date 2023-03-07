import { Icon, Loading, NavBtn, Navbar, NoteCard } from "@/components";
import { useCallback, useEffect, useState } from "react";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import { getServerSession } from "next-auth/next";
import type { GetServerSidePropsContext } from "next";
import { authOptions } from "./api/auth/[...nextauth]";
import { Note, User } from "../components/types";
import { generateHTML } from "@tiptap/react";
import Link from "next/link";
import { tipTapExtensions } from "@/components";
import { useNotesContext } from "@/context/NotesContext";
import Head from "next/head";

export default function Home({
  serverNotes,
}: {
  user: User;
  serverNotes: Note[];
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [open, setOpen] = useState(false);

  const { notes, user, isDone } = useNotesContext();

  return (
    <>
      <Head>
        <title>The Soothe</title>
        <meta property="og:title" content="The Soothe" />
        <meta
          name="description"
          content="Start writing your notes and have fun!"
        />
        <meta
          property="og:description"
          content="Start writing your notes and have fun!"
        />

        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:type" content="website" />
        <link rel="shortcut icon" href="/soothe.ico" />
        <meta property="og:image" content="https://i.imgur.com/Q5ZLNOM.png" />
        <meta property="og:url" content="https://soothe.vercel.app/" />
      </Head>
      {(notes.length ? (
        <section className="mx-auto max-w-7xl grow p-4 py-8 lg:p-20">
          <Loading />
          <div className="mb-4 flex flex-row items-center justify-start gap-2 lg:mb-8">
            <NavBtn />
            <input
              type="text"
              className="w-full bg-transparent text-2xl font-bold text-r-black placeholder:text-r-gray focus:outline-none active:outline-none dark:text-r-darkBlack dark:placeholder:text-r-darkGray lg:text-4xl"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <ResponsiveMasonry
            columnsCountBreakPoints={{ 350: 1, 750: 2, 900: 3 }}
          >
            <Masonry gutter="1rem">
              {notes
                .filter(
                  (note) =>
                    note.title
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase()) ||
                    note.content
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase())
                )
                .map((note) => (
                  <NoteCard
                    key={note.id}
                    title={note.title}
                    id={note.id}
                    content={generateHTML(
                      JSON.parse(note.content),
                      tipTapExtensions
                    )}
                  />
                ))}
            </Masonry>
          </ResponsiveMasonry>
        </section>
      ) : (
        isDone && (
          <section className="flex grow flex-col items-center justify-center gap-8 p-4 py-8 lg:p-20">
            <div>
              <h1 className="mb-2 text-center text-xl font-extrabold text-r-black dark:text-r-darkBlack lg:text-3xl">
                Your note-taking journey begins here
              </h1>
              <p className="text-center text-sm text-r-gray dark:text-r-darkGray lg:text-base">
                Create your first note to begin
              </p>
            </div>
            <Link href={"/editor"} passHref>
              <button className="rounded-lg bg-rose-500 px-6 py-4 font-bold capitalize text-white transition-shadow duration-300 hover:shadow-md hover:shadow-rose-400">
                Create new note
              </button>
            </Link>
          </section>
        )
      )) || (
        <div className="fixed top-0 left-0 z-[100] flex h-screen w-screen items-center justify-center bg-r-white dark:bg-r-darkWhite">
          <svg
            className="-ml-1 mr-3 h-8 w-8 animate-spin text-r-accentWarm dark:text-r-darkAccentWarm"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        </div>
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
