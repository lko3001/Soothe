import { UserNote } from "../../components/types";
import Editor from "../editor";
import { GetServerSidePropsContext } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../api/auth/[...nextauth]";
import Head from "next/head";

export default function NoteSlug({ user, note }: UserNote) {
  return (
    <>
      <Head>
        <title>{note.title}</title>
        <meta property="og:title" content={note.title} />
        <meta
          name="description"
          content={`Hey! Read the note: ${note.title}`}
        />
        <meta
          property="og:description"
          content={`Hey! Read the note: ${note.title}`}
        />

        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:type" content="website" />
        <link rel="shortcut icon" href="/soothe.ico" />
        <meta property="og:image" content="https://i.imgur.com/Q5ZLNOM.png" />
        <meta property="og:url" content="https://soothe.vercel.app/" />
      </Head>
      <Editor note={note} />
    </>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions);
  if (!session) {
    return { redirect: { destination: "/auth/login" } };
  }

  const { req, res: response, ...redContext } = context;
  const merged = { session, redContext };

  const res = await fetch(`${process.env.NEXTAUTH_URL}/api/getNote`, {
    method: "POST",
    body: JSON.stringify(merged),
  });
  const data = await res.json();

  if (res.status === 404) {
    return { redirect: { destination: "/editor" } };
  }

  const user = session?.user;

  return {
    props: { user: user, note: data },
  };
}
