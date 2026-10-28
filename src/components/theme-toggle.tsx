import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

type Theme = "dark" | "light";

export const themeInitScript = `(function(){try{if(localStorage.getItem("theme")==="light")document.documentElement.classList.remove("dark");}catch(e){}})();`;

export function ThemeToggle({ className = "" }: { className?: string }) {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    setTheme(document.documentElement.classList.contains("dark") ? "dark" : "light");
  }, []);

  const toggleTheme = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.classList.toggle("dark", next === "dark");
    localStorage.setItem("theme", next);
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={theme === "dark" ? "التبديل إلى الوضع النهاري" : "التبديل إلى الوضع الليلي"}
      title="التبديل بين الوضع النهاري والليلي"
      className={`glass neon-box grid size-10 place-items-center rounded-full text-neon transition hover:scale-110 ${className}`}
    >
      {theme === "dark" ? <Sun className="size-5" /> : <Moon className="size-5" />}
    </button>
  );
}
