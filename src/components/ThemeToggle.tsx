"use client";

import { motion } from "framer-motion";
import { useTheme } from "./ThemeProvider";
import { HiSun, HiMoon } from "react-icons/hi";

export default function ThemeToggle() {
    const { theme, toggleTheme } = useTheme();

    return (
        <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleTheme}
            className="relative w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
        >
            <motion.div
                initial={false}
                animate={{ rotate: theme === "dark" ? 0 : 180 }}
                transition={{ duration: 0.3 }}
            >
                {theme === "dark" ? (
                    <HiSun className="w-5 h-5 text-gym-gold" />
                ) : (
                    <HiMoon className="w-5 h-5 text-gym-black" />
                )}
            </motion.div>
        </motion.button>
    );
}
