
import { useState, useEffect } from "react";
import { Sun, Moon } from "lucide-react";
import BottomNav from "./BottomNav";

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {
  const [darkMode, setDarkMode] = useState(false);

  // Initialize dark mode from localStorage, defaulting to user preference
  useEffect(() => {
    const savedDarkMode = localStorage.getItem("darkMode");
    if (savedDarkMode !== null) {
      setDarkMode(JSON.parse(savedDarkMode));
    } else {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setDarkMode(prefersDark);
    }
  }, []);

  // Update document class and localStorage when darkMode changes
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full">
        <div className="container flex items-center justify-between h-16 px-4">
          <h1 className="text-xl font-bold neuro-gradient-text">NeuroNest X</h1>
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full bg-muted"
            aria-label="Toggle dark mode"
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
      </header>
      
      <main className="flex-1 container px-4 py-6 pb-24">
        {children}
      </main>
      
      <BottomNav />
    </div>
  );
};

export default AppLayout;
