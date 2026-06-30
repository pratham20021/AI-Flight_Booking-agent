"use client";
import { motion } from "framer-motion";
import { useUserStore } from "@/store";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Users, Plus, Trash2, Camera, Save } from "lucide-react";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

export default function ProfilePage() {
  const { profile, updateProfile, savedTravelers, removeTraveler } = useUserStore();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(profile);

  const handleSave = () => {
    updateProfile(form);
    setEditing(false);
    toast({ title: "Profile updated!", description: "Your changes have been saved." });
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-xl font-bold text-foreground">User Profile</h1>
        <p className="text-sm text-muted-foreground">Manage your personal information and preferences</p>
      </motion.div>

      {/* Profile Card */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <div className="relative">
                <Avatar className="h-20 w-20 ring-4 ring-blue-500/30">
                  <AvatarFallback className="text-xl bg-gradient-to-br from-blue-600 to-purple-600">
                    {profile.name.split(" ").map((n) => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <button className="absolute -bottom-1 -right-1 h-7 w-7 rounded-full bg-blue-600 flex items-center justify-center border-2 border-gray-950 cursor-pointer hover:bg-blue-700 transition-colors">
                  <Camera className="h-3 w-3 text-white" />
                </button>
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-foreground">{profile.name}</h2>
                <p className="text-sm text-muted-foreground">{profile.email}</p>
                <div className="flex gap-2 mt-2">
                  <Badge variant="default" className="text-xs">Premium Member</Badge>
                  <Badge variant="secondary" className="text-xs">10 Bookings</Badge>
                </div>
              </div>
              <Button variant={editing ? "default" : "outline"} onClick={() => editing ? handleSave() : setEditing(true)} className="gap-2">
                <Save className="h-4 w-4" />{editing ? "Save Changes" : "Edit Profile"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Personal Info */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
          <Card>
            <CardHeader><CardTitle className="text-base">Personal Information</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {[
                { label: "Full Name", key: "name", type: "text" },
                { label: "Email", key: "email", type: "email" },
                { label: "Phone", key: "phone", type: "tel" },
              ].map(({ label, key, type }) => (
                <div key={key} className="space-y-1.5">
                  <Label className="text-xs">{label}</Label>
                  <Input type={type} value={(form as any)[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                    disabled={!editing} className="h-9" />
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Preferences */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
          <Card>
            <CardHeader><CardTitle className="text-base">Travel Preferences</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {[
                { label: "Preferred Airline", key: "preferredAirline", options: ["IndiGo", "Air India", "SpiceJet", "Vistara", "Akasa Air"] },
                { label: "Seat Preference", key: "preferredSeat", options: ["window", "aisle", "middle"] },
                { label: "Meal Preference", key: "mealPreference", options: ["veg", "non-veg", "vegan", "jain"] },
                { label: "Currency", key: "currency", options: ["INR", "USD", "EUR", "GBP"] },
                { label: "Language", key: "language", options: ["English", "Hindi", "Marathi", "Tamil"] },
              ].map(({ label, key, options }) => (
                <div key={key} className="space-y-1.5">
                  <Label className="text-xs">{label}</Label>
                  <select value={(form as any)[key] || ""} onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                    disabled={!editing}
                    className="h-9 w-full rounded-xl border border-white/10 bg-white/5 px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60">
                    {options.map((o) => <option key={o} value={o} className="bg-gray-900 capitalize">{o}</option>)}
                  </select>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Saved Travelers */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-base"><Users className="h-4 w-4" />Saved Travelers</CardTitle>
              <Button size="sm" variant="outline" className="gap-1 text-xs" onClick={() => toast({ title: "Coming soon", description: "Add traveler feature" })}>
                <Plus className="h-3 w-3" />Add
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {savedTravelers.map((t, i) => (
                <motion.div key={t.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.08 }}
                  className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all group">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="text-xs bg-gradient-to-br from-blue-600 to-purple-600">
                      {t.name.split(" ").map((n) => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.relation} · {t.age}y</p>
                    <div className="flex gap-1 mt-1">
                      <Badge variant="secondary" className="text-[10px] capitalize">{t.mealPreference}</Badge>
                      <Badge variant="outline" className="text-[10px] capitalize">{t.seatPreference}</Badge>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon-sm" onClick={() => removeTraveler(t.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-red-400 hover:text-red-300">
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
