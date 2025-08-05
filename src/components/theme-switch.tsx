import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import Button from "./ui/button";
import { Moon, Sun } from "lucide-react";

export default function ThemeSwitch() {
    const [mounted, setMounted] = useState(false);
    const { theme, setTheme } = useTheme();

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null;
    }


    if (theme === "dark") {
        return <Moon size={20} className="cursor-pointer hover:opacity-80 transition-opacity" onClick={() => setTheme("light")} />
    }

    // For light theme or system theme that resolves to light
    return <Sun size={20} className="cursor-pointer hover:opacity-80 transition-opacity" onClick={() => setTheme("dark")} />
}