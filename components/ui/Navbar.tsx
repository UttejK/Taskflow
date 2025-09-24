"use client";

import React from "react";
import Link from "next/link";

// shadcn/ui wrappers — adjust the paths if you use a different structure
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
  return (
    // Use `sticky top-4` to make it "float" slightly from the viewport top
    // Use a container to center and limit width (max-w-6xl)
    <div className="sticky top-4 z-50 pointer-events-none">
      {/* pointer-events-none on outer container prevents blocking clicks on content edges;
          inner bar uses pointer-events-auto so it still accepts interactions. */}
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
              <div className="h-8 w-8 rounded-md bg-gradient-to-br from-indigo-500 to-violet-500" />
              <span className="font-medium text-slate-900 dark:text-slate-100">
                TaskFlow
              </span>
            </Link>
            {/* simple nav links (hidden on small screens) */}
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
