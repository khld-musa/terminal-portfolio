import React, { createContext, useState, useEffect } from "react";
import type { Theme } from "../types/theme";
import { themes } from "../types/theme";

interface ThemeContextType {
  currentTheme: Theme;
  themeName: string;
  setTheme: (themeName: string) => void;
  availableThemes: string[];
}

export const ThemeContext = createContext<ThemeContextType | undefined>(
  undefined
);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [themeName, setThemeName] = useState<string>(() => {
    return localStorage.getItem("terminal-theme") || "ubuntu";
  });

  const currentTheme = themes[themeName] || themes.ubuntu;

  const setTheme = (newTheme: string) => {
    if (themes[newTheme]) {
      setThemeName(newTheme);
      localStorage.setItem("terminal-theme", newTheme);
    }
  };

  useEffect(() => {
    // Apply theme colors to CSS variables
    const colors = currentTheme.colors;
    document.documentElement.style.setProperty("--theme-bg", colors.background);
    document.documentElement.style.setProperty("--theme-fg", colors.foreground);
    document.documentElement.style.setProperty("--theme-cursor", colors.cursor);
    document.documentElement.style.setProperty(
      "--theme-selection",
      colors.selection
    );
    document.documentElement.style.setProperty("--theme-black", colors.black);
    document.documentElement.style.setProperty("--theme-red", colors.red);
    document.documentElement.style.setProperty("--theme-green", colors.green);
    document.documentElement.style.setProperty("--theme-yellow", colors.yellow);
    document.documentElement.style.setProperty("--theme-blue", colors.blue);
    document.documentElement.style.setProperty(
      "--theme-magenta",
      colors.magenta
    );
    document.documentElement.style.setProperty("--theme-cyan", colors.cyan);
    document.documentElement.style.setProperty("--theme-white", colors.white);
    document.documentElement.style.setProperty("--theme-window", colors.window);
    document.documentElement.style.setProperty(
      "--theme-window-border",
      colors.windowBorder
    );
    document.documentElement.style.setProperty(
      "--theme-titlebar",
      colors.titleBar
    );
    document.documentElement.style.setProperty(
      "--theme-titlebar-text",
      colors.titleBarText
    );
  }, [currentTheme]);

  const availableThemes = Object.keys(themes);

  return (
    <ThemeContext.Provider
      value={{ currentTheme, themeName, setTheme, availableThemes }}
    >
      {children}
    </ThemeContext.Provider>
  );
};
