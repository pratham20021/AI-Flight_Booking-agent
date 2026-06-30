"use client";
import { motion } from "framer-motion";
import { ArrowLeft, Star, Check, X, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useFlightStore } from "@/store";
import { useBookingStore } from "@/store";
import { formatCurrency, formatDuration, formatTime } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { mockFlights } from "@/data/mock-data";

export default function ComparisonPage() {
  const { selectedFlights, clearSelected } = useFlightStore();
  const { setCurrentBooking } = useBookingStore();
  const router = useRouter();
  const flights = selectedFlights.length > 0 ? selectedFlights : mockFlights.slice(0, 3);
  const best = [...flights].sort((a, b) => a.finalPrice - b.finalPrice)[0];

  const rows = [
    { label: "Website", key: (f: typeof flights[0]) => f.website },
    { label: "Airline", key: (f: typeof flights[0]) => f.airline },
    { label: "Flight", key: (f: typeof flights[0]) => f.flightNumber },
    { label: "Aircraft", key: (f: typeof flights[0]) => f.aircraft },
    { label: "Departure", key: (f: typeof flights[0]) => formatTime(f.departureTime) },
    { label: "Arrival", key: (f: typeof flights[0]) => formatTime(f.arrivalTime) },
    { label: "Duration", key: (f: typeof flights[0]) => formatDuration(f.duration) },
    { label: "Stops", key: (f: typeof flights[0]) => f.stops === 0 ? "Non-stop" : `${f.stops} stop` },
    { label: "Class", key: (f: typeof flights[0]) => f.travelClass },
    { label: "Baggage", key: (f: typeof flights[0]) => f.baggage },
    { label: "Meal", key: (f: typeof flights[0]) => f.meal ? "✅ Included" : "❌ Not included" },
    { label: "Refundable", key: (f: typeof flights[0]) => f.refundable ? "✅ Yes" : "❌ No" },
    { label: "Base Price", key: (f: typeof flights[0]) => formatCurrency(f.basePrice) },
    { label: "Discount", key: (f: typeof flights[0]) => `${f.discount}%` },
    { label: "Final Price", key: (f: typeof flights[0]) => formatCurrency(f.finalPrice), highlight: true },
    { label: "Rating", key: (f: typeof flights[0]) => `${f.rating}/5 ⭐` },
    { label: "Coupon", key: (f: typeof flights[0]) => f.couponCode || "–" },
    { label: "Seats Left", key: (f: typeof flights[0]) => `${f.seatsLeft} seats` },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="icon-sm" onClick={() => router.back()} className="rounded-xl">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-xl font-bold text-foreground">Compare Flights</h1>
          <p className="text-sm text-muted-foreground">Side-by-side comparison of {flights.length} flights</p>
        </div>
      </motion.div>

      <div className="overflow-x-auto">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
          {/* Header */}
          <div className={`grid gap-4 mb-4`} style={{ gridTemplateColumns: `200px repeat(${flights.length}, 1fr)` }}>
            <div />
            {flights.map((f) => (
              <Card key={f.id} className={f.id === best.id ? "ring-2 ring-green-500 bg-green-500/5" : ""}>
                <CardContent className="p-4 text-center">
                  {f.id === best.id && (
                    <div className="flex items-center justify-center gap-1 mb-2">
                      <Trophy className="h-3 w-3 text-yellow-400" />
                      <span className="text-[10px] font-bold text-yellow-400">BEST DEAL</span>
                    </div>
                  )}
                  <div className="text-2xl font-bold text-foreground">{formatCurrency(f.finalPrice)}</div>
                  <div className="text-xs text-muted-foreground mt-1">{f.airline}</div>
                  <div className="text-xs text-muted-foreground">{f.website}</div>
                  <Button size="sm" className="mt-3 w-full text-xs" onClick={() => { setCurrentBooking({ flight: f, flightId: f.id }); router.push("/dashboard/booking-details"); }}>
                    Book Now
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Rows */}
          {rows.map((row, i) => (
            <motion.div key={row.label} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }}
              className={`grid gap-4 mb-2 items-center`} style={{ gridTemplateColumns: `200px repeat(${flights.length}, 1fr)` }}>
              <div className={`px-3 py-2.5 rounded-lg text-xs font-medium ${row.highlight ? "text-foreground bg-blue-500/10" : "text-muted-foreground"}`}>
                {row.label}
              </div>
              {flights.map((f) => (
                <div key={f.id} className={`px-3 py-2.5 rounded-lg text-xs text-center ${row.highlight ? "font-bold text-foreground bg-white/5 text-base" : "text-foreground bg-white/5"} ${f.id === best.id && row.highlight ? "bg-green-500/10 text-green-400" : ""}`}>
                  {row.key(f)}
                </div>
              ))}
            </motion.div>
          ))}

          {/* Pros & Cons */}
          <div className={`grid gap-4 mt-6`} style={{ gridTemplateColumns: `200px repeat(${flights.length}, 1fr)` }}>
            <div className="text-xs font-medium text-muted-foreground px-3">Pros</div>
            {flights.map((f) => (
              <Card key={f.id} className={f.id === best.id ? "bg-green-500/5 border-green-500/30" : ""}>
                <CardContent className="p-3 space-y-1">
                  {f.pros.map((p) => (
                    <div key={p} className="flex items-center gap-1.5 text-xs text-green-400">
                      <Check className="h-3 w-3 shrink-0" />{p}
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
          <div className={`grid gap-4 mt-3`} style={{ gridTemplateColumns: `200px repeat(${flights.length}, 1fr)` }}>
            <div className="text-xs font-medium text-muted-foreground px-3">Cons</div>
            {flights.map((f) => (
              <Card key={f.id}>
                <CardContent className="p-3 space-y-1">
                  {f.cons.map((c) => (
                    <div key={c} className="flex items-center gap-1.5 text-xs text-red-400">
                      <X className="h-3 w-3 shrink-0" />{c}
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
