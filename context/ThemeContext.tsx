import { Children, Theme } from "@/components/types";
import { createContext, useEffect, useContext, useState, useRef } from "react";

interface ThemeTypes {
  isDone: boolean;
  defaultTheme: Theme;
  userTheme: Theme | null;
  changeTheme: (finalTheme?: Theme) => void;
  toggleDarkMode: () => void;
}

const ThemeContext = createContext({} as ThemeTypes);

export function useThemeContext() {
  return useContext(ThemeContext);
}

export default function ThemeProvider({ children }: Children) {
  const [isDone, setIsDone] = useState(false);
  const [userTheme, setUserTheme] = useState({} as Theme);
  const [isDark, setIsDark] = useState("false");

  const defaultTheme = useRef({
    // LIGHT MODE
    white: "255, 255, 255",
    black: "34, 34, 34",
    lightGray: "232, 232, 232",
    grayHover: "202, 202, 202",
    gray: "137, 137, 137",
    accentWarm: "255, 87, 34",
    warmHover: "255, 141, 83",
    accentCold: "237, 35, 102",
    coldHover: "224, 118, 143",
    // DARK MODE
    darkWhite: "20, 20, 20",
    darkBlack: "255, 255, 255",
    darkLightGray: "25, 25, 25",
    darkGrayHover: "94, 94, 94",
    darkGray: "137, 137, 137",
    darkAccentWarm: "255, 87, 34",
    darkWarmHover: "255, 141, 83",
    darkAccentCold: "237, 35, 102",
    darkColdHover: "224, 118, 143",
  });

  useEffect(() => {
    setIsDark(localStorage.getItem("isDark") || "false");
    fetch("/api/getTheme")
      .then((res) => res.json())
      .then((data) => {
        if (data.theme) {
          setUserTheme(JSON.parse(data.theme));
        } else {
          changeTheme();
        }
        setIsDone(true);
      });
  }, []);

  useEffect(() => {
    if (userTheme.white) {
      changeTheme();
    }
  }, [userTheme]);

  const changeTheme = (finalTheme?: Theme) => {
    const docStyle = document.documentElement.style;

    const whichObj =
      finalTheme || (userTheme.white ? userTheme : defaultTheme.current);

    Object.entries(whichObj).forEach(([colorName, colorValue]) => {
      docStyle.setProperty(`--${colorName}`, colorValue);
    });
  };

  const toggleDarkMode = () => {
    if (isDark === "false") {
      setIsDark("true");
      localStorage.setItem("isDark", "true");
    } else {
      setIsDark("false");
      localStorage.setItem("isDark", "false");
    }
  };

  return (
    <ThemeContext.Provider
      value={{
        changeTheme,
        toggleDarkMode,
        isDone,
        defaultTheme: defaultTheme.current,
        userTheme: userTheme.white ? userTheme : null,
      }}
    >
      <div className={isDark === "true" ? "dark" : ""}>{children}</div>
    </ThemeContext.Provider>
  );
}
