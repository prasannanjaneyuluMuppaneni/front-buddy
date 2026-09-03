import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  BookOpenCheck,
  ClipboardList,
  MessageSquare,
  MoreHorizontal,
  Pencil,
  Search,
  Settings,
  SquarePen,
  Trash2,
} from "lucide-react";
import { useMemo, useState } from "react";

import logo from "@/assets/nova-logo.png";
import { SettingsDialog } from "@/components/chat/settings-dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useChatStore } from "@/lib/chat/store";
import type { Chat } from "@/lib/chat/types";
import { cn } from "@/lib/utils";

const QUICK_ACTIONS = [
  {
    label: "Practice questions",
    icon: BookOpenCheck,
    prompt: "Give me a set of practice questions to work through.",
  },
  {
    label: "Mock test",
    icon: ClipboardList,
    prompt: "Start a timed mock test for me.",
  },
];

function groupChats(chats: Chat[], now: number) {
  const day = 86_400_000;
  const startOfToday = new Date(now).setHours(0, 0, 0, 0);
  const buckets: Record<string, Chat[]> = {
    Today: [],
    Yesterday: [],
    "Previous 7 days": [],
    "Previous 30 days": [],
    Older: [],
  };
  for (const c of chats) {
    const t = c.updatedAt;
    if (t >= startOfToday) buckets.Today!.push(c);
    else if (t >= startOfToday - day) buckets.Yesterday!.push(c);
    else if (t >= startOfToday - 7 * day) buckets["Previous 7 days"]!.push(c);
    else if (t >= startOfToday - 30 * day) buckets["Previous 30 days"]!.push(c);
    else buckets.Older!.push(c);
  }
  return Object.entries(buckets).filter(([, v]) => v.length > 0);
}

export function AppSidebar() {
  const chats = useChatStore((s) => s.chats);
  const hydrated = useChatStore((s) => s.hydrated);
  const userName = useChatStore((s) => s.userName);
  const createChat = useChatStore((s) => s.createChat);
  const sendMessage = useChatStore((s) => s.sendMessage);
  const renameChat = useChatStore((s) => s.renameChat);
  const deleteChat = useChatStore((s) => s.deleteChat);
  const navigate = useNavigate();
  const { isMobile, setOpenMobile } = useSidebar();
  const currentPath = useRouterState({ select: (s) => s.location.pathname });

  const [query, setQuery] = useState("");
  const [renaming, setRenaming] = useState<Chat | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const [settingsOpen, setSettingsOpen] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const sorted = [...chats].sort((a, b) => b.updatedAt - a.updatedAt);
    return q ? sorted.filter((c) => c.title.toLowerCase().includes(q)) : sorted;
  }, [chats, query]);

  // Group by "now" only after hydration so SSR and client markup agree.
  const groups = useMemo(
    () => groupChats(filtered, hydrated ? Date.now() : Date.UTC(2026, 8, 3, 15)),
    [filtered, hydrated],
  );

  const closeMobile = () => {
    if (isMobile) setOpenMobile(false);
  };

  const startQuick = (prompt: string) => {
    const id = createChat();
    navigate({ to: "/c/$chatId", params: { chatId: id } });
    sendMessage(id, prompt);
    closeMobile();
  };

  const onDelete = (chat: Chat) => {
    deleteChat(chat.id);
    if (currentPath === `/c/${chat.id}`) navigate({ to: "/" });
  };

  return (
    <>
      <Sidebar collapsible="offcanvas" className="border-r border-sidebar-border">
        <SidebarHeader className="gap-3 px-3 pt-3">
          <div className="flex items-center gap-2 px-1">
            <img src={logo} alt="Nova" width={512} height={512} className="size-6" />
            <span className="text-sm font-semibold tracking-tight">Nova</span>
          </div>
          <Button
            asChild
            variant="outline"
            className="h-9 w-full justify-start gap-2 border-sidebar-border bg-sidebar-accent/40 hover:bg-sidebar-accent"
          >
            <Link to="/" onClick={closeMobile}>
              <SquarePen className="size-4" />
              New chat
            </Link>
          </Button>
          <div className="grid grid-cols-2 gap-2">
            {QUICK_ACTIONS.map((a) => (
              <button
                key={a.label}
                type="button"
                onClick={() => startQuick(a.prompt)}
                className="flex items-center gap-1.5 rounded-lg border border-sidebar-border bg-sidebar px-2 py-1.5 text-xs font-medium text-sidebar-foreground/90 transition-colors hover:border-primary/40 hover:bg-primary/10 hover:text-foreground"
              >
                <a.icon className="size-3.5 text-primary" />
                {a.label}
              </button>
            ))}
          </div>
          <div className="relative">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search chats"
              className="h-8 border-sidebar-border bg-transparent pl-8 text-sm shadow-none focus-visible:ring-primary/40"
            />
          </div>
        </SidebarHeader>

        <SidebarContent className="px-1">
          {groups.length === 0 && (
            <p className="px-4 py-8 text-center text-xs text-muted-foreground">
              {query ? "No chats match your search." : "No chats yet. Start a new one!"}
            </p>
          )}
          {groups.map(([label, items]) => (
            <SidebarGroup key={label} className="py-1">
              <SidebarGroupLabel className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground/80">
                {label}
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {items.map((chat) => {
                    const active = currentPath === `/c/${chat.id}`;
                    return (
                      <SidebarMenuItem key={chat.id} className="group/item">
                        <SidebarMenuButton
                          asChild
                          isActive={active}
                          className={cn(
                            "h-9 rounded-lg pr-8 text-[13px] transition-colors",
                            active && "bg-sidebar-accent font-medium",
                          )}
                        >
                          <Link to="/c/$chatId" params={{ chatId: chat.id }} onClick={closeMobile}>
                            <MessageSquare className="size-3.5 shrink-0 text-muted-foreground" />
                            <span className="truncate">{chat.title}</span>
                          </Link>
                        </SidebarMenuButton>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <SidebarMenuAction
                              showOnHover
                              className="rounded-md hover:bg-sidebar-accent"
                              aria-label="Chat options"
                            >
                              <MoreHorizontal className="size-4" />
                            </SidebarMenuAction>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent side="right" align="start" className="w-40">
                            <DropdownMenuItem
                              onSelect={() => {
                                setRenaming(chat);
                                setRenameValue(chat.title);
                              }}
                            >
                              <Pencil className="size-4" /> Rename
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-destructive focus:text-destructive"
                              onSelect={() => onDelete(chat)}
                            >
                              <Trash2 className="size-4" /> Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          ))}
        </SidebarContent>

        <SidebarFooter className="border-t border-sidebar-border p-2">
          <button
            type="button"
            onClick={() => setSettingsOpen(true)}
            className="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left transition-colors hover:bg-sidebar-accent"
          >
            <Avatar className="size-8">
              <AvatarFallback className="bg-primary/15 text-xs font-semibold text-primary">
                {userName.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{userName}</p>
              <p className="truncate text-xs text-muted-foreground">Free plan</p>
            </div>
            <Settings className="size-4 text-muted-foreground" />
          </button>
        </SidebarFooter>
      </Sidebar>

      <SettingsDialog open={settingsOpen} onOpenChange={setSettingsOpen} />

      <Dialog open={!!renaming} onOpenChange={(o) => !o && setRenaming(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Rename chat</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (renaming) renameChat(renaming.id, renameValue);
              setRenaming(null);
            }}
            className="space-y-4"
          >
            <Input value={renameValue} onChange={(e) => setRenameValue(e.target.value)} autoFocus />
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => setRenaming(null)}>
                Cancel
              </Button>
              <Button type="submit">Save</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
