import { Link } from "@tanstack/react-router";
import { Moon, SquarePen, Sun } from "lucide-react";
import { useEffect, type ReactNode } from "react";

import { AppSidebar } from "@/components/chat/app-sidebar";
import { Button } from "@/components/ui/button";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useChatStore } from "@/lib/chat/store";
import { MODELS } from "@/lib/chat/types";

function ThemeToggle() {
  const theme = useChatStore((s) => s.theme);
  const setTheme = useChatStore((s) => s.setTheme);
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          aria-label="Toggle theme"
          className="text-muted-foreground hover:text-foreground"
        >
          {theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
        </Button>
      </TooltipTrigger>
      <TooltipContent>Toggle theme</TooltipContent>
    </Tooltip>
  );
}

export function ChatShell({ children }: { children: ReactNode }) {
  const theme = useChatStore((s) => s.theme);
  const model = useChatStore((s) => s.model);

  // Rehydrate persisted state on the client only (avoids SSR mismatch).
  useEffect(() => {
    void useChatStore.persist.rehydrate();
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  const modelName = MODELS.find((m) => m.id === model)?.name ?? "";

  return (
    <TooltipProvider delayDuration={200}>
      <SidebarProvider>
        <div className="flex min-h-svh w-full">
          <AppSidebar />
          <SidebarInset className="flex h-svh min-w-0 flex-col bg-background">
            <header className="flex h-12 shrink-0 items-center gap-1 border-b border-border px-2 sm:px-3">
              <Tooltip>
                <TooltipTrigger asChild>
                  <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
                </TooltipTrigger>
                <TooltipContent>Toggle sidebar</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    asChild
                    variant="ghost"
                    size="icon-sm"
                    className="text-muted-foreground hover:text-foreground md:hidden"
                  >
                    <Link to="/" aria-label="New chat">
                      <SquarePen className="size-4" />
                    </Link>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>New chat</TooltipContent>
              </Tooltip>
              <div className="ml-1 flex min-w-0 items-center gap-2">
                <span className="text-sm font-semibold tracking-tight">Nova</span>
                <span className="hidden rounded-md border border-border px-1.5 py-0.5 text-[11px] text-muted-foreground sm:inline">
                  {modelName}
                </span>
              </div>
              <div className="ml-auto flex items-center gap-1">
                <ThemeToggle />
              </div>
            </header>
            {children}
          </SidebarInset>
        </div>
      </SidebarProvider>
    </TooltipProvider>
  );
}
