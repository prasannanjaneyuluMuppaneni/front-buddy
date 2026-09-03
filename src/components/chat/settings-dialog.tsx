import { useNavigate } from "@tanstack/react-router";
import { Moon, Sun, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useChatStore } from "@/lib/chat/store";
import { cn } from "@/lib/utils";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SettingsDialog({ open, onOpenChange }: Props) {
  const theme = useChatStore((s) => s.theme);
  const setTheme = useChatStore((s) => s.setTheme);
  const userName = useChatStore((s) => s.userName);
  const setUserName = useChatStore((s) => s.setUserName);
  const clearAll = useChatStore((s) => s.clearAll);
  const navigate = useNavigate();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>Personalise your Nova experience.</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 pt-2">
          <div className="space-y-2">
            <Label htmlFor="display-name">Display name</Label>
            <Input
              id="display-name"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Your name"
            />
          </div>

          <div className="space-y-2">
            <Label>Appearance</Label>
            <div className="grid grid-cols-2 gap-2">
              {(
                [
                  { id: "dark", label: "Dark", icon: Moon },
                  { id: "light", label: "Light", icon: Sun },
                ] as const
              ).map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTheme(t.id)}
                  className={cn(
                    "flex items-center justify-center gap-2 rounded-lg border px-3 py-2.5 text-sm transition-colors",
                    theme === t.id
                      ? "border-primary bg-primary/10 text-foreground"
                      : "border-border text-muted-foreground hover:bg-accent hover:text-foreground",
                  )}
                >
                  <t.icon className="size-4" />
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2 rounded-lg border border-destructive/30 p-3">
            <p className="text-sm font-medium">Clear all chats</p>
            <p className="text-xs text-muted-foreground">
              Permanently removes every conversation stored on this device.
            </p>
            <Button
              variant="outline"
              size="sm"
              className="mt-1 gap-2 border-destructive/40 text-destructive hover:bg-destructive/10 hover:text-destructive"
              onClick={() => {
                clearAll();
                onOpenChange(false);
                navigate({ to: "/" });
              }}
            >
              <Trash2 className="size-4" /> Clear all chats
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
