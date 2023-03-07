import { Icon, NavBtn, Navbar, NoteCard } from "@/components";
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

      {notes.length ? (
        <section className="mx-auto max-w-7xl grow p-4 py-8 lg:p-20">
          <h1 className="text-[rgba(var(--red))]">CIao</h1>
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
