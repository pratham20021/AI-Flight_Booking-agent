"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Download, Eye, X, ChevronLeft, ChevronRight, Plane } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useBookingStore } from "@/store";
import { formatCurrency, formatDate } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";

const statusVariants: Record<string, "success" | "warning" | "destructive" | "secondary"> = {
  confirmed: "success", pending: "warning", cancelled: "destructive", completed: "secondary",
};

const ITEMS_PER_PAGE = 5;

export default function HistoryPage() {
  const { bookings, cancelBooking } = useBookingStore();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState("all");
  const router = useRouter();

  const filtered = bookings.filter((b) => {
    const matchSearch = b.pnr.toLowerCase().includes(search.toLowerCase()) ||
      b.flight.airline.toLowerCase().includes(search.toLowerCase()) ||
      b.flight.originCode.toLowerCase().includes(search.toLowerCase()) ||
      b.flight.destinationCode.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filter === "all" || b.status === filter;
    return matchSearch && matchStatus;
  });

  const total = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl font-bold text-foreground">Booking History</h1>
          <p className="text-sm text-muted-foreground">{bookings.length} total bookings</p>
        </div>
      </motion.div>

      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col md:flex-row gap-3 items-start md:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} placeholder="Search by PNR, airline, route..." className="pl-9 h-9" />
            </div>
            <div className="flex gap-2 flex-wrap">
              {["all", "confirmed", "completed", "pending", "cancelled"].map((s) => (
                <button key={s} onClick={() => { setFilter(s); setPage(1); }}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer capitalize ${filter === s ? "bg-blue-600 text-white" : "bg-white/5 text-muted-foreground hover:bg-white/10 border border-white/10"}`}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {paginated.length === 0 ? (
            <div className="text-center py-12">
              <Plane className="h-10 w-10 mx-auto mb-3 text-muted-foreground opacity-30" />
              <p className="text-muted-foreground text-sm">No bookings found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10">
                    {["Date", "PNR", "Airline", "Route", "Website", "Price", "Status", "Actions"].map((h) => (
                      <th key={h} className="text-left py-3 px-3 text-xs font-medium text-muted-foreground whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {paginated.map((b, i) => (
                    <motion.tr key={b.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                      className="hover:bg-white/5 transition-colors">
                      <td className="py-3 px-3 text-xs text-muted-foreground whitespace-nowrap">{formatDate(b.bookingDate)}</td>
                      <td className="py-3 px-3"><span className="font-mono text-xs font-bold text-blue-400">{b.pnr}</span></td>
                      <td className="py-3 px-3 text-xs font-medium whitespace-nowrap">{b.flight.airline}</td>
                      <td className="py-3 px-3 text-xs whitespace-nowrap">{b.flight.originCode} → {b.flight.destinationCode}</td>
                      <td className="py-3 px-3 text-xs text-muted-foreground">{b.flight.website}</td>
                      <td className="py-3 px-3 text-xs font-bold text-foreground">{formatCurrency(b.totalPrice)}</td>
                      <td className="py-3 px-3">
                        <Badge variant={statusVariants[b.status]} className="text-[10px] capitalize">{b.status}</Badge>
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="icon-sm" title="View" onClick={() => toast({ title: `PNR: ${b.pnr}`, description: `${b.flight.airline} ${b.flight.flightNumber}` })}>
                            <Eye className="h-3.5 w-3.5" />
                          </Button>
                          <Button variant="ghost" size="icon-sm" title="Download" onClick={() => toast({ title: "Downloading...", description: "Ticket PDF ready!" })}>
                            <Download className="h-3.5 w-3.5" />
                          </Button>
                          {b.status === "confirmed" && (
                            <Button variant="ghost" size="icon-sm" title="Cancel" onClick={() => { cancelBooking(b.id); toast({ title: "Booking cancelled", description: `PNR: ${b.pnr} has been cancelled.` }); }}>
                              <X className="h-3.5 w-3.5 text-red-400" />
                            </Button>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {total > 1 && (
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/10">
              <p className="text-xs text-muted-foreground">Showing {(page - 1) * ITEMS_PER_PAGE + 1}–{Math.min(page * ITEMS_PER_PAGE, filtered.length)} of {filtered.length}</p>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon-sm" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}><ChevronLeft className="h-3 w-3" /></Button>
                {Array.from({ length: total }, (_, i) => i + 1).map((p) => (
                  <button key={p} onClick={() => setPage(p)}
                    className={`h-8 w-8 rounded-lg text-xs font-medium transition-all cursor-pointer ${page === p ? "bg-blue-600 text-white" : "bg-white/5 text-muted-foreground hover:bg-white/10"}`}>
                    {p}
                  </button>
                ))}
                <Button variant="outline" size="icon-sm" onClick={() => setPage(p => Math.min(total, p + 1))} disabled={page === total}><ChevronRight className="h-3 w-3" /></Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
