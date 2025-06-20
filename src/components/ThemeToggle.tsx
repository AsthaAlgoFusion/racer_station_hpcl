"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function ThemeToggle() {
  const { setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
            variant="outline" 
            size="icon" 
            className="border-slate-300 text-slate-700 hover:bg-slate-200/80 hover:text-slate-900
                       dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-700/80 dark:hover:text-white"
        >
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="bg-white border-slate-200 text-slate-900
                   dark:bg-slate-950 dark:border-slate-800 dark:text-slate-50"
      >
        <DropdownMenuItem 
            onClick={() => setTheme("light")} 
            className="hover:!bg-slate-100 focus:!bg-slate-100 
                       dark:hover:!bg-slate-800 dark:focus:!bg-slate-800"
        >
          Light
        </DropdownMenuItem>
        <DropdownMenuItem 
            onClick={() => setTheme("dark")} 
            className="hover:!bg-slate-100 focus:!bg-slate-100
                       dark:hover:!bg-slate-800 dark:focus:!bg-slate-800"
        >
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem 
            onClick={() => setTheme("system")} 
            className="hover:!bg-slate-100 focus:!bg-slate-100
                       dark:hover:!bg-slate-800 dark:focus:!bg-slate-800"
        >
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
