import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Loading() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const handleStart = () => setLoading(true);
    const handleComplete = () => setLoading(false);
    router.events.on("routeChangeStart", handleStart);
    router.events.on("routeChangeComplete", handleComplete);
    router.events.on("routeChangeError", handleComplete);

    return () => {
      router.events.off("routeChangeStart", handleStart);
      router.events.off("routeChangeComplete", handleComplete);
      router.events.off("routeChangeError", handleComplete);
    };
  }, []);
  return (
    <>
      {loading && (
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
