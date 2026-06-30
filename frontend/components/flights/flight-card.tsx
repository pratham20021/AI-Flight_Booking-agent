"use client";
import { motion } from "framer-motion";
import { Clock, Zap, Luggage, Utensils, RotateCcw, Star, BookmarkPlus, GitCompare, ArrowRight } from "lucide-react";
import { Flight } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn, formatCurrency, formatDuration, formatTime } from "@/lib/utils";
import { useFlightStore } from "@/store";
import { useRouter } from "next/navigation";
import { useBookingStore } from "@/store";
import { toast } from "@/hooks/use-toast";

interface FlightCardProps {
  flight: Flight;
  index?: number;
  showCompare?: boolean;
}

const airlineGradients: Record<string, string> = {
  IndiGo: "from-blue-600 to-blue-800",
  "Air India": "from-red-600 to-red-800",
  SpiceJet: "from-red-500 to-orange-600",
  Vistara: "from-purple-600 to-purple-800",
  "Akasa Air": "from-orange-500 to-amber-600",
};

export function FlightCard({ flight, index = 0, showCompare = true }: FlightCardProps) {
  const { selectedFlights, toggleSelect } = useFlightStore();
  const { setCurrentBooking } = useBookingStore();
  const router = useRouter();
  const isSelected = selectedFlights.some((f) => f.id === flight.id);

  const handleBook = () => {
    setCurrentBooking({ flight, flightId: flight.id });
    router.push("/dashboard/booking-details");
  };

  const handleSave = () => toast({ title: "Saved!", description: `${flight.airline} ${flight.flightNumber} saved to favorites.` });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      whileHover={{ y: -2 }}
    >
      <Card className={cn("overflow-hidden transition-all duration-300", isSelected && "ring-2 ring-blue-500", flight.isRecommended && "ring-1 ring-green-500/50")}>
        {flight.isRecommended && (
          <div className="bg-gradient-to-r from-green-600/20 to-emerald-600/20 px-4 py-1.5 border-b border-green-500/20 flex items-center gap-2">
            <Star className="h-3 w-3 text-green-400 fill-green-400" />
            <span className="text-xs font-semibold text-green-400">AI Recommended – Best Value</span>
          </div>
        )}

        <div className="p-4">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br text-white text-xs font-bold", airlineGradients[flight.airline] || "from-gray-600 to-gray-800")}>
                {flight.airlineCode}
              </div>
              <div>
                <p className="font-semibold text-sm text-foreground">{flight.airline}</p>
                <p className="text-xs text-muted-foreground">{flight.flightNumber} · {flight.aircraft}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1 justify-end">
                <span className="text-2xl font-bold text-foreground">{formatCurrency(flight.finalPrice)}</span>
              </div>
              {flight.discount > 0 && (
                <div className="flex items-center gap-2 justify-end mt-0.5">
                  <span className="text-xs text-muted-foreground line-through">{formatCurrency(flight.basePrice)}</span>
                  <Badge variant="success" className="text-[10px]">{flight.discount}% OFF</Badge>
                </div>
              )}
            </div>
          </div>

          {/* Flight Times */}
          <div className="flex items-center justify-between mb-4">
            <div className="text-center">
              <p className="text-xl font-bold text-foreground">{formatTime(flight.departureTime)}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{flight.originCode}</p>
            </div>

            <div className="flex-1 px-4">
              <div className="flex items-center gap-2">
                <div className="h-[1px] flex-1 bg-white/20" />
                <div className="flex flex-col items-center gap-1">
                  <p className="text-xs text-muted-foreground">{formatDuration(flight.duration)}</p>
                  <div className="flex items-center gap-1">
                    <ArrowRight className="h-3 w-3 text-blue-400" />
                  </div>
                  <p className="text-[10px] text-muted-foreground">{flight.stops === 0 ? "Non-stop" : `${flight.stops} stop`}</p>
                </div>
                <div className="h-[1px] flex-1 bg-white/20" />
              </div>
            </div>

            <div className="text-center">
              <p className="text-xl font-bold text-foreground">{formatTime(flight.arrivalTime)}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{flight.destinationCode}</p>
            </div>
          </div>

          {/* Tags */}
          <div className="flex items-center gap-2 flex-wrap mb-4">
            <Badge variant="secondary" className="text-[10px] gap-1">
              <Clock className="h-2.5 w-2.5" />{formatDuration(flight.duration)}
            </Badge>
            <Badge variant="secondary" className="text-[10px] gap-1">
              <Luggage className="h-2.5 w-2.5" />{flight.baggage}
            </Badge>
            {flight.meal && <Badge variant="secondary" className="text-[10px] gap-1"><Utensils className="h-2.5 w-2.5" />Meal</Badge>}
            {flight.refundable && <Badge variant="secondary" className="text-[10px] gap-1"><RotateCcw className="h-2.5 w-2.5" />Refundable</Badge>}
            {flight.travelClass !== "Economy" && <Badge variant="default" className="text-[10px]">{flight.travelClass}</Badge>}
            <Badge variant="outline" className="text-[10px]">{flight.website}</Badge>
            {flight.couponCode && (
              <Badge variant="warning" className="text-[10px] gap-1"><Zap className="h-2.5 w-2.5" />USE: {flight.couponCode}</Badge>
            )}
          </div>

          {/* Seats Left */}
          {flight.seatsLeft <= 10 && (
            <p className="text-xs text-orange-400 font-medium mb-3">⚡ Only {flight.seatsLeft} seats left!</p>
          )}

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Button onClick={handleBook} size="sm" className="flex-1">Book Now</Button>
            {showCompare && (
              <Button
                variant={isSelected ? "default" : "outline"}
                size="sm"
                onClick={() => toggleSelect(flight)}
                className="gap-1"
              >
                <GitCompare className="h-3 w-3" />
                {isSelected ? "Added" : "Compare"}
              </Button>
            )}
            <Button variant="ghost" size="icon-sm" onClick={handleSave}>
              <BookmarkPlus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
