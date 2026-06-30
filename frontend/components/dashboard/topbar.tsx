"use client";
import { Bell, Search, Menu, Plane } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ThemeSwitch } from "@/components/common/theme-switch";
import { useNotificationStore } from "@/store";
import { useUserStore } from "@/store";
import Link from "next/link";
import { motion } from "framer-motion";
import { useState } from "react";

interface TopbarProps {
  onMenuClick: () => void;
}

export function Topbar({ onMenuClick }: TopbarProps) {
  const { profile } = useUserStore();
  const { notifications } = useNotificationStore();
  const unread = notifications.filter((n) => !n.read).length;
  const [showNotifs, setShowNotifs] = useState(false);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b border-white/10 bg-gray-950/80 backdrop-blur-xl px-4 lg:px-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={onMenuClick} className="lg:hidden rounded-xl">
          <Menu className="h-5 w-5" />
        </Button>
        <div className="hidden lg:flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600">
            <Plane className="h-4 w-4 text-white" />
          </div>
          <span className="font-bold text-sm text-foreground">AI Travel Agent</span>
        </div>
      </div>

      <div className="hidden md:flex flex-1 max-w-md mx-4">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search flights, bookings..." className="pl-10 h-9 bg-white/5 border-white/10" />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <ThemeSwitch />

        {/* Notifications */}
        <div className="relative">
          <Button variant="ghost" size="icon" className="rounded-xl relative" onClick={() => setShowNotifs(!showNotifs)}>
            <Bell className="h-4 w-4" />
            {unread > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                {unread}
              </span>
            )}
          </Button>
          {showNotifs && (
            <motion.div
              initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
              className="absolute right-0 top-12 w-80 rounded-2xl border border-white/10 bg-gray-950 shadow-2xl z-50 overflow-hidden"
            >
              <div className="p-4 border-b border-white/10 flex items-center justify-between">
                <p className="font-semibold text-sm">Notifications</p>
                <Badge variant="default">{unread} new</Badge>
              </div>
              <div className="max-h-64 overflow-y-auto divide-y divide-white/5">
                {notifications.slice(0, 5).map((n) => (
                  <div key={n.id} className={`p-3 text-xs hover:bg-white/5 cursor-pointer ${!n.read ? "bg-blue-500/5" : ""}`}>
                    <p className="font-medium text-foreground">{n.title}</p>
                    <p className="text-muted-foreground mt-0.5">{n.message}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>

        <Link href="/dashboard/profile">
          <Avatar className="h-8 w-8 cursor-pointer ring-2 ring-blue-500/30 hover:ring-blue-500/60 transition-all">
            <AvatarFallback className="text-xs">{profile.name.split(" ").map((n) => n[0]).join("")}</AvatarFallback>
          </Avatar>
        </Link>
      </div>
    </header>
  );
}
