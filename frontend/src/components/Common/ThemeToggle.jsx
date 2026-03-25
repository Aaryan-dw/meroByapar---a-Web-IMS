import { useEffect, useState } from "react";

function ThemeToggle() {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <div className="flex items-center gap-6">
      <button
        onClick={toggleTheme}
        className="px-5 py-2 rounded-full shadow-lg bg-gray-800 text-white dark:bg-white dark:text-black transition-all duration-300"
      >
        {theme === "light" ? "🌙 Dark Mode" : "☀️ Light Mode"}
      </button>
    </div>
  );
}

export default ThemeToggle;