import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";

interface ThemeContextType {
  isLightTheme: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [isLightTheme, setIsLightTheme] = useState(true);

  const toggleTheme = () => setIsLightTheme((prev) => !prev);

  useEffect(() => {
    document.body.setAttribute("data-theme", isLightTheme ? "light" : "dark");
  }, [isLightTheme]);

  return (
    <ThemeContext.Provider value={{ isLightTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
