"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { SlidersHorizontal, GitCompare, X, ArrowUpDown, Plane } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { FlightCard } from "@/components/flights/flight-card";
import { useFlightStore } from "@/store";
import { formatCurrency } from "@/lib/utils";
import { useRouter } from "next/navigation";

const sortOptions = ["Price: Low to High", "Price: High to Low", "Duration", "Departure Time", "Rating"];
const filterAirlines = ["All", "IndiGo", "Air India", "SpiceJet", "Vistara", "Akasa Air"];

export default function BookingsPage() {
  const { filteredFlights, selectedFlights, clearSelected, setFiltered, flights } = useFlightStore();
  const [sort, setSort] = useState("Price: Low to High");
  const [airline, setAirline] = useState("All");
  const [showFilters, setShowFilters] = useState(false);
  const router = useRouter();

  const sorted = [...filteredFlights].sort((a, b) => {
    if (sort === "Price: Low to High") return a.finalPrice - b.finalPrice;
    if (sort === "Price: High to Low") return b.finalPrice - a.finalPrice;
    if (sort === "Duration") return a.duration - b.duration;
    if (sort === "Rating") return b.rating - a.rating;
    return new Date(a.departureTime).getTime() - new Date(b.departureTime).getTime();
  });

  const filtered = airline === "All" ? sorted : sorted.filter((f) => f.airline === airline);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl font-bold text-foreground">Flight Results</h1>
          <p className="text-sm text-muted-foreground">{filtered.length} flights found</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {selectedFlights.length > 0 && (
            <Button onClick={() => router.push("/dashboard/comparison")} className="gap-2" size="sm">
              <GitCompare className="h-4 w-4" />Compare {selectedFlights.length} flights
            </Button>
          )}
          <Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)} className="gap-2">
            <SlidersHorizontal className="h-4 w-4" />Filters
          </Button>
        </div>
      </motion.div>

      {/* Filters */}
      {showFilters && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mb-6">
          <Card>
            <CardContent className="p-4 flex flex-wrap gap-4 items-center">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs text-muted-foreground font-medium">Airline:</span>
                {filterAirlines.map((a) => (
                  <button key={a} onClick={() => setAirline(a)}
                    className={`px-3 py-1 rounded-full text-xs border transition-all cursor-pointer ${airline === a ? "bg-blue-600 border-blue-600 text-white" : "border-white/10 text-muted-foreground hover:border-white/30"}`}>
                    {a}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2 flex-wrap ml-auto">
                <span className="text-xs text-muted-foreground font-medium">Sort:</span>
                <select value={sort} onChange={(e) => setSort(e.target.value)}
                  className="bg-white/5 border border-white/10 rounded-lg px-3 py-1 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-blue-500">
                  {sortOptions.map((s) => <option key={s} value={s} className="bg-gray-900">{s}</option>)}
                </select>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Compare Bar */}
      {selectedFlights.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 flex items-center gap-4 bg-gray-900 border border-white/20 rounded-2xl px-6 py-3 shadow-2xl">
          <p className="text-sm font-medium">{selectedFlights.length} selected</p>
          <div className="flex gap-2">
            {selectedFlights.map((f) => (
              <Badge key={f.id} variant="default" className="text-xs">{f.airline} · {formatCurrency(f.finalPrice)}</Badge>
            ))}
          </div>
          <Button size="sm" onClick={() => router.push("/dashboard/comparison")} className="gap-1">
            <GitCompare className="h-3 w-3" />Compare
          </Button>
          <Button size="icon-sm" variant="ghost" onClick={clearSelected}><X className="h-4 w-4" /></Button>
        </motion.div>
      )}

      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <Plane className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-30" />
          <p className="text-muted-foreground">No flights match your filters</p>
          <Button variant="outline" className="mt-4" onClick={() => { setAirline("All"); setFiltered(flights); }}>Clear Filters</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((flight, i) => <FlightCard key={flight.id} flight={flight} index={i} />)}
        </div>
      )}
    </div>
  );
}
