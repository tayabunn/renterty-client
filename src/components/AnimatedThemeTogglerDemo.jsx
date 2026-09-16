"use client"

import { useTheme } from "next-themes"

import { AnimatedThemeToggler } from "@/registry/magicui/animated-theme-toggler"

export function AnimatedThemeTogglerNextThemesDemo() {
  const { resolvedTheme, setTheme } = useTheme()

  return (
    <div className="flex justify-center p-6">
      <AnimatedThemeToggler
        theme={resolvedTheme === "dark" ? "dark" : "light"}
        onThemeChange={setTheme}
        className="p-3 bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 rounded-xl transition-colors duration-200 flex items-center justify-center"
      />
    </div>
  )
}
