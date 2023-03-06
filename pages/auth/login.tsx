import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import { getProviders, signIn } from "next-auth/react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../api/auth/[...nextauth]";
import { FcGoogle } from "react-icons/fc";
export default function Login({
  providers,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <section className="flex min-h-screen flex-col items-center justify-center bg-zinc-100">
      <div className="flex max-w-[50ch] flex-col items-center justify-center gap-8 rounded-xl bg-white p-8 py-16 shadow-2xl">
        <div className="mb-4">
          <h1 className="text-center text-3xl font-bold">Join the community</h1>
          <p className="text-center text-zinc-500">Sign in to create one</p>
        </div>
        <div className="w-full">
          {Object.values(providers).map((provider) => (
            <button
              key={provider.name}
              onClick={() => signIn(provider.id)}
              className="flex w-full flex-row items-center justify-center gap-4 rounded-xl p-4 px-16 text-lg font-medium text-[#757575] outline outline-zinc-200 transition-shadow duration-200 hover:shadow-lg"
            >
              <FcGoogle className="text-2xl" />
              <span>
                Continue with{" "}
                <strong className="font-bold">{provider.name}</strong>
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (session) return { redirect: { destination: "/" } };

  const providers = await getProviders();

  return {
    props: { providers: providers ?? [] },
  };
}
