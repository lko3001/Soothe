import { GetServerSidePropsContext } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./api/auth/[...nextauth]";
import { useRef, useState } from "react";
import { useThemeContext } from "@/context/ThemeContext";
import { NavBtn } from "@/components";
import Link from "next/link";
import Head from "next/head";

export default function Profile() {
  const { defaultTheme, userTheme, changeTheme } = useThemeContext();
  const [customTheme, setCustomTheme] = useState(userTheme || defaultTheme);

  function hexToRgb(hex: string) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? [
          parseInt(result[1], 16),
          parseInt(result[2], 16),
          parseInt(result[3], 16),
        ].join(", ")
      : "128, 128, 128";
  }

  function handleSave() {
    const finalTheme = customTheme;

    for (let prop in customTheme) {
      if (customTheme.hasOwnProperty(prop)) {
        if (finalTheme[prop][0] === "#") {
          finalTheme[prop] = hexToRgb(customTheme[prop]);
        }
      }
    }

    fetch("/api/addTheme", {
      method: "POST",
      body: JSON.stringify({ theme: JSON.stringify(finalTheme) }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error !== "ERROR") {
          changeTheme(finalTheme);
        }
      });
  }

  function resetTheme() {
    setCustomTheme(defaultTheme);
    localStorage.setItem("theme", JSON.stringify(defaultTheme));
    changeTheme();
  }

  return (
    <>
      <Head>
        <title>Profile</title>
        <meta property="og:title" content="Profile" />
        <meta name="description" content="Check My Profile" />
        <meta property="og:description" content="Check My Profile" />

        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:type" content="website" />
        <link rel="shortcut icon" href="/soothe.ico" />
        <meta property="og:image" content="https://i.imgur.com/Q5ZLNOM.png" />
        <meta property="og:url" content="https://soothe.vercel.app/" />
      </Head>

      <section className="mx-auto max-w-7xl grow p-4 py-8 text-r-black dark:text-r-darkBlack lg:p-20">
        <div className="flex flex-row items-start gap-4">
          <NavBtn />
          <h1 className="mb-4 text-3xl font-extrabold lg:mb-8 lg:text-5xl">
            Customize your theme
          </h1>
        </div>
        <div className="mb-4 grid grid-cols-1 gap-4 lg:mb-8 lg:grid-cols-3">
          {Object.entries(defaultTheme).map(([colorName, colorValue]) => {
            const spacedName = colorName.replace(/([a-z])([A-Z])/g, "$1 $2");

            return (
              <div
                className="flex flex-col items-start justify-between gap-2 lg:gap-4"
                key={colorName}
              >
                <span className="text-xl font-bold capitalize lg:text-2xl">
                  {spacedName}
                </span>
                <label
                  htmlFor={colorName}
                  className="flex h-full w-full cursor-pointer items-center justify-center rounded-lg p-8 font-roboto_mono font-bold shadow-lg shadow-r-black/10 dark:shadow-r-darkWhite/10"
                  style={{
                    backgroundColor:
                      customTheme[colorName][0] === "#"
                        ? customTheme[colorName]
                        : `rgb(${customTheme[colorName]})`,
                  }}
                >
                  <input
                    type="color"
                    value={customTheme[colorName]}
                    id={colorName}
                    onChange={(e) => {
                      setCustomTheme({
                        ...customTheme,
                        [colorName]: e.target.value,
                      });
                    }}
                    className="invisible absolute h-0 w-0"
                  />
                </label>
              </div>
            );
          })}
        </div>
        <div className="flex flex-row items-center justify-between">
          <div className="[&>*]:mr-4">
            <button
              className="rounded-lg bg-r-accentWarm px-4 py-2 text-base font-bold uppercase text-r-white transition-colors duration-300 hover:bg-r-warmHover dark:bg-r-darkAccentWarm dark:text-r-darkWhite dark:hover:bg-r-darkWarmHover lg:text-lg"
              onClick={handleSave}
            >
              Save
            </button>
            <button
              className="rounded-lg bg-r-accentCold px-4 py-2 text-base font-bold uppercase text-r-white transition-colors duration-300 hover:bg-r-coldHover dark:bg-r-darkAccentCold dark:text-r-darkWhite dark:hover:bg-r-darkColdHover lg:text-lg"
              onClick={resetTheme}
            >
              Reset
            </button>
          </div>
          <Link href={"/auth/logout"}>
            <button className="rounded-lg bg-r-accentCold px-4 py-2 text-base font-bold uppercase text-r-white transition-colors duration-300 hover:bg-r-coldHover dark:bg-r-darkAccentCold dark:text-r-darkWhite dark:hover:bg-r-darkColdHover lg:text-lg">
              Logout
            </button>
          </Link>
        </div>
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
