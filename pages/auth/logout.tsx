import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import { getProviders, signOut } from "next-auth/react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../api/auth/[...nextauth]";
import { MdOutlineLogout } from "react-icons/md";
import { Icon } from "@/components";
import Link from "next/link";

export default function Logout() {
  return (
    <section className="flex min-h-screen flex-col items-center justify-center bg-zinc-100">
      <div className="flex max-w-[50ch] flex-col items-center justify-center gap-8 rounded-xl bg-white p-8 py-16 shadow-2xl">
        <div className="mb-4">
          <h1 className="text-center text-3xl font-bold">
            Thanks for using our service
          </h1>
          <p className="text-center text-zinc-500">
            Log out to end your session
          </p>
        </div>
        <div className="w-full">
          <button
            onClick={() => signOut({ callbackUrl: "/auth/login" })}
            className="mb-4 flex w-full flex-row items-center justify-center gap-3 rounded-xl bg-red-500 p-4 text-lg font-medium text-white transition-shadow duration-200 hover:shadow-lg hover:shadow-red-300"
          >
            <MdOutlineLogout className="-scale-x-100 text-xl" />
            Logout
          </button>
          <Link href={"/"} passHref>
            <button className="flex w-full flex-row items-center justify-center gap-3 rounded-xl p-4 text-lg font-medium outline outline-zinc-200 transition-shadow duration-200 hover:shadow-lg">
              Annulla
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (!session) return { redirect: { destination: "/auth/login" } };

  return {
    props: {},
  };
}
