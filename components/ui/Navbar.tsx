"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ModeToggle } from "./dark-mode-toggle";

export default function Navbar() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="sticky top-4 z-50 pointer-events-none">
      <div className="mx-auto max-w-6xl px-4">
        <nav
          className="pointer-events-auto mx-auto flex w-full items-center justify-between gap-4 rounded-xl
                     bg-white/75 px-4 py-2 shadow-lg backdrop-blur-sm backdrop-saturate-125
                     dark:bg-slate-900/70 border border-slate-200/60 dark:border-slate-800/60"
          aria-label="Main navigation"
        >
          {/* Left: brand */}
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-3">
              {/* Placeholder until mounted to prevent hydration mismatch */}
              {!mounted ? (
                <div className="h-8 w-8 rounded-md bg-slate-200 dark:bg-slate-700" />
              ) : resolvedTheme === "dark" ? (
                <Image
                  alt="logo"
                  src="/Taskflow-white.png"
                  width={32}
                  height={32}
                  className="h-8 w-8 rounded-md"
                  priority
                />
              ) : (
                <Image
                  alt="logo"
                  src="/Taskflow-dark.png"
                  width={32}
                  height={32}
                  className="h-8 w-8 rounded-md"
                  priority
                />
              )}

              <span className="font-medium text-slate-900 dark:text-slate-100">
                TaskFlow
              </span>
            </Link>

            {/* Nav links (hidden on small screens) */}
            <ul className="ml-4 hidden items-center gap-3 sm:flex">
              <li>
                <Link
                  href="/projects"
                  className="text-sm font-medium text-slate-700 hover:text-slate-900 dark:text-slate-300"
                >
                  Projects
                </Link>
              </li>
              <li>
                <Link
                  href="/calendar"
                  className="text-sm font-medium text-slate-700 hover:text-slate-900 dark:text-slate-300"
                >
                  Calendar
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard"
                  className="text-sm font-medium text-slate-700 hover:text-slate-900 dark:text-slate-300"
                >
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Right: actions */}
          <div className="flex items-center gap-3">
            <Button size="sm" variant="ghost" className="hidden sm:inline-flex">
              New Task
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  aria-label="Open user menu"
                  className="flex items-center gap-2 rounded-md px-2 py-1 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <Avatar>
                    <div className="h-8 w-8 rounded-full bg-slate-400" />
                  </Avatar>
                  <span className="hidden text-sm font-medium sm:inline-block text-slate-800 dark:text-slate-100">
                    Uttej
                  </span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href="/profile">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings">Settings</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <ModeToggle />
          </div>
        </nav>
      </div>
    </div>
  );
}
