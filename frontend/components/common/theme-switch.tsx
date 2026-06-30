"use client";
import { Moon, Sun, Monitor } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export function ThemeSwitch() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return <div className="h-10 w-10 rounded-xl bg-white/5" />;

  const icons = { light: Sun, dark: Moon, system: Monitor };
  const next = theme === "dark" ? "light" : theme === "light" ? "system" : "dark";
  const Icon = icons[(theme as keyof typeof icons) || "dark"];

  return (
    <Button variant="ghost" size="icon" onClick={() => setTheme(next)} className="rounded-xl" title={`Switch to ${next} mode`}>
      <Icon className="h-4 w-4" />
    </Button>
  );
}
