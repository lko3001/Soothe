import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Hanken_Grotesk, Roboto_Mono } from "@next/font/google";
import { SessionProvider } from "next-auth/react";
import { Loading } from "@/components";
import NotesProvider from "@/context/NotesContext";
import NavbarProvider from "@/context/NavbarContext";
import Layout from "./layout";
import ThemeProvider from "@/context/ThemeContext";
const hanken_grotesk = Hanken_Grotesk({
  subsets: ["latin"],
  variable: "--hanken_grotesk",
  display: "swap",
});
const roboto_mono = Roboto_Mono({
  subsets: ["latin"],
  variable: "--roboto_mono",
  display: "swap",
});

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <SessionProvider session={session}>
      <ThemeProvider>
        <NavbarProvider>
          <NotesProvider>
            <main
              className={` ${roboto_mono.variable} ${hanken_grotesk.variable} font-hanken_grotesk`}
            >
              <Layout>
                <Loading />
                <Component {...pageProps} />
              </Layout>
            </main>
          </NotesProvider>
        </NavbarProvider>
      </ThemeProvider>
    </SessionProvider>
  );
}
