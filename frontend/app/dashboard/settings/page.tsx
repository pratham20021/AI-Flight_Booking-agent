"use client";
import { motion } from "framer-motion";
import { Bell, Lock, Globe, CreditCard, Link, Moon, Sun } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useSettingsStore } from "@/store";
import { useTheme } from "next-themes";
import { toast } from "@/hooks/use-toast";

const connectedSites = [
  { name: "MakeMyTrip", connected: true, color: "bg-red-500" },
  { name: "Goibibo", connected: true, color: "bg-blue-500" },
  { name: "EaseMyTrip", connected: false, color: "bg-green-500" },
  { name: "Booking.com", connected: false, color: "bg-blue-700" },
  { name: "Cleartrip", connected: true, color: "bg-yellow-500" },
];

const savedCards = [
  { type: "Visa", last4: "4242", expiry: "12/26", bank: "HDFC Bank" },
  { type: "Mastercard", last4: "5678", expiry: "08/25", bank: "ICICI Bank" },
];

export default function SettingsPage() {
  const { notifications, privacy, toggleNotification, togglePrivacy, language, currency, setLanguage, setCurrency } = useSettingsStore();
  const { theme, setTheme } = useTheme();

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-xl font-bold text-foreground">Settings</h1>
        <p className="text-sm text-muted-foreground">Manage your preferences and account settings</p>
      </motion.div>

      {/* Theme */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card>
          <CardHeader><CardTitle className="text-base flex items-center gap-2"><Moon className="h-4 w-4" />Appearance</CardTitle></CardHeader>
          <CardContent>
            <div className="flex gap-3">
              {(["light", "dark", "system"] as const).map((t) => (
                <button key={t} onClick={() => setTheme(t)}
                  className={`flex-1 flex flex-col items-center gap-2 p-4 rounded-xl border transition-all cursor-pointer ${theme === t ? "border-blue-500 bg-blue-500/10 text-blue-400" : "border-white/10 bg-white/5 text-muted-foreground hover:bg-white/10"}`}>
                  {t === "light" ? <Sun className="h-5 w-5" /> : t === "dark" ? <Moon className="h-5 w-5" /> : <Globe className="h-5 w-5" />}
                  <span className="text-xs font-medium capitalize">{t}</span>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Notifications */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
        <Card>
          <CardHeader><CardTitle className="text-base flex items-center gap-2"><Bell className="h-4 w-4" />Notifications</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {[
              { key: "email", label: "Email Notifications", desc: "Receive booking confirmations and updates via email" },
              { key: "sms", label: "SMS Notifications", desc: "Get text messages for important flight updates" },
              { key: "push", label: "Push Notifications", desc: "Browser push notifications for real-time alerts" },
              { key: "priceAlerts", label: "Price Alerts", desc: "Get notified when prices drop on your saved routes" },
            ].map(({ key, label, desc }) => (
              <div key={key} className="flex items-start justify-between gap-4">
                <div>
                  <Label className="text-sm font-medium">{label}</Label>
                  <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
                </div>
                <Switch checked={notifications[key as keyof typeof notifications]} onCheckedChange={() => toggleNotification(key)} />
              </div>
            ))}
          </CardContent>
        </Card>
      </motion.div>

      {/* Language & Currency */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Card>
          <CardHeader><CardTitle className="text-base flex items-center gap-2"><Globe className="h-4 w-4" />Language & Region</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs">Language</Label>
              <select value={language} onChange={(e) => setLanguage(e.target.value)}
                className="h-10 w-full rounded-xl border border-white/10 bg-white/5 px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500">
                {["English", "Hindi", "Marathi", "Tamil", "Telugu", "Gujarati"].map((l) => <option key={l} value={l} className="bg-gray-900">{l}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Currency</Label>
              <select value={currency} onChange={(e) => setCurrency(e.target.value)}
                className="h-10 w-full rounded-xl border border-white/10 bg-white/5 px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500">
                {["INR", "USD", "EUR", "GBP", "AED", "SGD"].map((c) => <option key={c} value={c} className="bg-gray-900">{c}</option>)}
              </select>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Privacy */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
        <Card>
          <CardHeader><CardTitle className="text-base flex items-center gap-2"><Lock className="h-4 w-4" />Privacy</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {[
              { key: "shareData", label: "Share Usage Data", desc: "Help improve the product by sharing anonymised data" },
              { key: "analytics", label: "Analytics Cookies", desc: "Allow analytics to improve your experience" },
            ].map(({ key, label, desc }) => (
              <div key={key} className="flex items-start justify-between gap-4">
                <div>
                  <Label className="text-sm font-medium">{label}</Label>
                  <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
                </div>
                <Switch checked={privacy[key as keyof typeof privacy]} onCheckedChange={() => togglePrivacy(key)} />
              </div>
            ))}
          </CardContent>
        </Card>
      </motion.div>

      {/* Connected Websites */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <Card>
          <CardHeader><CardTitle className="text-base flex items-center gap-2"><Link className="h-4 w-4" />Connected Websites</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {connectedSites.map((site) => (
              <div key={site.name} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10">
                <div className="flex items-center gap-3">
                  <div className={`h-8 w-8 rounded-lg ${site.color} flex items-center justify-center text-white text-xs font-bold`}>
                    {site.name[0]}
                  </div>
                  <span className="text-sm font-medium">{site.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={site.connected ? "success" : "secondary"} className="text-[10px]">
                    {site.connected ? "Connected" : "Not Connected"}
                  </Badge>
                  <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => toast({ title: site.connected ? "Disconnected" : "Connected!", description: `${site.name} ${site.connected ? "disconnected" : "connected"} successfully.` })}>
                    {site.connected ? "Disconnect" : "Connect"}
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </motion.div>

      {/* Saved Payment Methods */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2"><CreditCard className="h-4 w-4" />Saved Payment Methods</CardTitle>
              <Button size="sm" variant="outline" className="text-xs" onClick={() => toast({ title: "Coming soon" })}>+ Add Card</Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {savedCards.map((card) => (
              <div key={card.last4} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-12 rounded-lg bg-gradient-to-r from-gray-600 to-gray-700 flex items-center justify-center text-white text-[10px] font-bold">{card.type}</div>
                  <div>
                    <p className="text-sm font-medium">•••• {card.last4}</p>
                    <p className="text-xs text-muted-foreground">{card.bank} · Expires {card.expiry}</p>
                  </div>
                </div>
                <Button size="sm" variant="ghost" className="text-xs text-red-400 hover:text-red-300" onClick={() => toast({ title: "Card removed" })}>Remove</Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
