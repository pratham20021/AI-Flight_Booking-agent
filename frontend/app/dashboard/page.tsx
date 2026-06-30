"use client";
import { motion } from "framer-motion";
import { Plane, TrendingDown, Clock, CheckCircle, ArrowRight, Sparkles, MapPin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useBookingStore, useUserStore, useFlightStore } from "@/store";
import { formatCurrency, formatDate } from "@/lib/utils";
import Link from "next/link";

const statCards = [
  { label: "Total Flights Booked", value: "10", icon: Plane, color: "text-blue-400", bg: "bg-blue-500/10" },
  { label: "Money Saved", value: "₹12,450", icon: TrendingDown, color: "text-green-400", bg: "bg-green-500/10" },
  { label: "Upcoming Flights", value: "3", icon: Clock, color: "text-orange-400", bg: "bg-orange-500/10" },
  { label: "Completed Trips", value: "7", icon: CheckCircle, color: "text-purple-400", bg: "bg-purple-500/10" },
];

const quickRoutes = [
  { from: "Pune", to: "Delhi", price: "₹3,280", airline: "Akasa Air", tag: "Cheapest" },
  { from: "Mumbai", to: "Bangalore", price: "₹3,040", airline: "IndiGo", tag: "Popular" },
  { from: "Delhi", to: "Goa", price: "₹4,200", airline: "IndiGo", tag: "Trending" },
  { from: "Hyderabad", to: "Delhi", price: "₹3,822", airline: "IndiGo", tag: "Best Deal" },
];

export default function DashboardPage() {
  const { bookings } = useBookingStore();
  const { profile } = useUserStore();
  const { flights } = useFlightStore();
  const upcoming = bookings.filter((b) => b.status === "confirmed").slice(0, 3);

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Welcome */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Good morning, {profile.name.split(" ")[0]} 👋
          </h1>
          <p className="text-muted-foreground text-sm mt-1">Where would you like to fly today?</p>
        </div>
        <Link href="/dashboard/search">
          <Button size="lg" className="gap-2">
            <Sparkles className="h-4 w-4" /> New AI Search
          </Button>
        </Link>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
            <Card className="hover:border-white/20 transition-all">
              <CardContent className="p-4">
                <div className={`inline-flex p-2 rounded-lg ${s.bg} mb-3`}>
                  <s.icon className={`h-5 w-5 ${s.color}`} />
                </div>
                <p className="text-2xl font-bold text-foreground">{s.value}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming Bookings */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="lg:col-span-2">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Upcoming Flights</CardTitle>
                <Link href="/dashboard/bookings">
                  <Button variant="ghost" size="sm" className="gap-1 text-xs">View All <ArrowRight className="h-3 w-3" /></Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {upcoming.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Plane className="h-10 w-10 mx-auto mb-3 opacity-30" />
                  <p className="text-sm">No upcoming flights</p>
                </div>
              ) : upcoming.map((booking, i) => (
                <motion.div key={booking.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + i * 0.1 }}
                  className="flex items-center gap-4 p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600/20 text-blue-400 font-bold text-xs">
                    {booking.flight.airlineCode}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-foreground">{booking.flight.originCode} → {booking.flight.destinationCode}</p>
                      <Badge variant="success" className="text-[10px]">Confirmed</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">{booking.flight.airline} · {booking.flight.flightNumber} · {formatDate(booking.flight.departureTime)}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-bold text-foreground">{formatCurrency(booking.totalPrice)}</p>
                    <p className="text-xs text-muted-foreground">PNR: {booking.pnr}</p>
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Routes */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Popular Routes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {quickRoutes.map((r, i) => (
                <motion.div key={i} whileHover={{ x: 2 }}
                  className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all cursor-pointer">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-3.5 w-3.5 text-blue-400 shrink-0" />
                    <div>
                      <p className="text-xs font-semibold text-foreground">{r.from} → {r.to}</p>
                      <p className="text-[10px] text-muted-foreground">{r.airline}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-foreground">{r.price}</p>
                    <Badge variant="secondary" className="text-[10px] mt-0.5">{r.tag}</Badge>
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* AI Chat CTA */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <Card className="bg-gradient-to-r from-blue-600/20 via-purple-600/10 to-blue-600/20 border-blue-500/30">
          <CardContent className="p-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="font-bold text-foreground">Try AI-Powered Search</p>
                <p className="text-sm text-muted-foreground">Type naturally: "Book cheapest flight from Pune to Delhi tomorrow after 6PM"</p>
              </div>
            </div>
            <Link href="/dashboard/search" className="shrink-0">
              <Button size="lg" className="gap-2">
                <Sparkles className="h-4 w-4" /> Start Chatting
              </Button>
            </Link>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
