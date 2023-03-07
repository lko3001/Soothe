import { EditorShortcuts, NavBtn } from "@/components";
import { useState, useRef, useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import { GetServerSidePropsContext } from "next";
import { getServerSession } from "next-auth/next";
import { tipTapExtensions } from "@/components";
import { authOptions } from "./api/auth/[...nextauth]";
import { Note } from "../components/types";
import toast, { Toaster } from "react-hot-toast";
import { useNotesContext } from "@/context/NotesContext";
import { FloatingMenu } from "@tiptap/react";
import { useRouter } from "next/router";
import Head from "next/head";

export default function Editor({ note }: { note: Note }) {
  const [id, setId] = useState("");
  const [title, setTitle] = useState("");
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const router = useRouter();

  const { fetchNotes } = useNotesContext();

  const toastId = useRef<string>("");
  const titleInput = useRef<HTMLInputElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const editor = useEditor({
    extensions: tipTapExtensions,
    content: note && JSON.parse(note.content),
    editorProps: {
      attributes: {
        class: "proseClass",
      },
    },
  });

  useEffect(() => {
    if (note && note.id) {
      setId(note.id);
      setTitle(note.title);
    }
  }, []);

  useEffect(() => {
    if (editor) {
      editor.on("update", ({ editor }) => {
        debouncer(JSON.stringify(editor.getJSON()));
        unsaved();
      });
    }
  }, [editor, id]);

  useEffect(() => {
    const warningText =
      "You have unsaved changes. Are you sure you wish to leave this page?";
    const handleWindowClose = (e: BeforeUnloadEvent) => {
      if (!unsavedChanges) return;
      e.preventDefault();
      return (e.returnValue = warningText);
    };
    const handleBrowseAway = () => {
      if (!unsavedChanges) return;
      if (window.confirm(warningText)) return;
      router.events.emit("routeChangeError");
      throw "routeChange aborted.";
    };
    window.addEventListener("beforeunload", handleWindowClose);
    router.events.on("routeChangeStart", handleBrowseAway);
    return () => {
      window.removeEventListener("beforeunload", handleWindowClose);
      router.events.off("routeChangeStart", handleBrowseAway);
    };
  }, [unsavedChanges]);

  function debouncer(editorOutput: string) {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      if (
        titleInput?.current?.value !== "" ||
        JSON.stringify(editor?.getJSON()) !==
          `{"type":"doc","content":[{"type":"paragraph"}]}`
      ) {
        toastId.current = toast.loading("Saving...", {
          id: toastId.current,
          position: "top-right",
        });
        fetch("/api/addNote", {
          method: "POST",
          body: JSON.stringify({
            id: id,
            title: titleInput.current?.value,
            content: editorOutput,
          }),
        })
          .then((res) => res.json())
          .then((data) => {
            setId(data.createdNote.id);
            fetchNotes();
            toast.success("Note successfully saved", {
              id: toastId.current,
              position: "top-right",
            });
            setUnsavedChanges(false);
          });
      }
    }, 2000);
  }

  function unsaved() {
    if (
      titleInput?.current?.value === "" ||
      JSON.stringify(editor?.getJSON()) ===
        `{"type":"doc","content":[{"type":"paragraph"}]}`
    ) {
      setUnsavedChanges(false);
    } else setUnsavedChanges(true);
  }

  return (
    <>
      <Head>
        <title>Note Editor | {id || "Null"}</title>
        <meta property="og:title" content="Note Editor" />
        <meta name="description" content="Start Writing your note" />
        <meta property="og:description" content="Start Writing your note" />

        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:type" content="website" />
        <link rel="shortcut icon" href="/soothe.ico" />
        <meta property="og:image" content="https://i.imgur.com/Q5ZLNOM.png" />
        <meta property="og:url" content="https://soothe.vercel.app/" />
      </Head>

      <Toaster />
      <section className="mx-auto max-w-7xl grow p-4 py-8 lg:p-20">
        <div className="mb-4 flex flex-row items-center justify-start gap-4 lg:mb-8">
          <p>{id || "Null"}</p>
          {id && <p>Id exists</p>}
          <NavBtn />
          <input
            type="text"
            className="w-full bg-transparent text-2xl font-bold !leading-[3rem] text-r-black placeholder:text-r-gray focus:outline-none active:outline-none dark:text-r-darkBlack dark:placeholder:text-r-darkGray lg:text-4xl"
            placeholder="Title..."
            value={title}
            ref={titleInput}
            autoFocus
            onChange={(e) => {
              setTitle(e.target.value);
              unsaved();
              return debouncer(
                JSON.stringify(editor?.getJSON()) ||
                  JSON.stringify({
                    type: "doc",
                    content: [{ type: "paragraph" }],
                  })
              );
            }}
          />
        </div>
        {editor && (
          <FloatingMenu
            editor={editor}
            className="mt-6 flex translate-y-1/2 -translate-x-2 flex-col gap-3 rounded-md bg-r-white p-2 dark:bg-r-darkWhite"
          >
            <EditorShortcuts editor={editor} />
          </FloatingMenu>
        )}
        <EditorContent editor={editor} spellCheck={false} />
      </section>
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
