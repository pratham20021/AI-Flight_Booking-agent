"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { MapPin, Calendar, Users, ArrowLeftRight, Search, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useFlightStore } from "@/store";
import { mockFlights } from "@/data/mock-data";
import { sleep } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";

const schema = z.object({
  origin: z.string().min(2, "Enter origin city"),
  destination: z.string().min(2, "Enter destination city"),
  departureDate: z.string().min(1, "Select departure date"),
  returnDate: z.string().optional(),
  passengers: z.number().min(1).max(9),
  travelClass: z.enum(["Economy", "Business", "First"]),
  preferredAirline: z.string().optional(),
  nonStopOnly: z.boolean(),
  minPrice: z.number(),
  maxPrice: z.number(),
  tripType: z.enum(["one-way", "round-trip"]),
});

type FormValues = z.infer<typeof schema>;

const cities = ["Pune", "Delhi", "Mumbai", "Bangalore", "Hyderabad", "Chennai", "Kolkata", "Goa", "Jaipur", "Ahmedabad"];
const airlines = ["Any", "IndiGo", "Air India", "SpiceJet", "Vistara", "Akasa Air"];
const classes = ["Economy", "Business", "First"];

export function SearchForm() {
  const { setFlights, setFiltered, setSearching } = useFlightStore();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      passengers: 1, travelClass: "Economy", nonStopOnly: false,
      minPrice: 0, maxPrice: 20000, tripType: "one-way",
    },
  });

  const tripType = watch("tripType");
  const nonStop = watch("nonStopOnly");
  const travelClass = watch("travelClass");

  const onSubmit = async (data: FormValues) => {
    setLoading(true);
    setSearching(true);
    await sleep(1500);
    let results = mockFlights.filter((f) => {
      if (data.nonStopOnly && f.stops > 0) return false;
      if (data.preferredAirline && data.preferredAirline !== "Any" && f.airline !== data.preferredAirline) return false;
      if (data.travelClass !== "Economy" && f.travelClass !== data.travelClass) return false;
      if (f.finalPrice > data.maxPrice) return false;
      return true;
    });
    if (results.length === 0) results = mockFlights.slice(0, 10);
    setFlights(results);
    setFiltered(results);
    setSearching(false);
    setLoading(false);
    toast({ title: `Found ${results.length} flights!`, description: `${data.origin} → ${data.destination}` });
    router.push("/dashboard/bookings");
  };

  const swapCities = () => {
    const o = watch("origin"), d = watch("destination");
    setValue("origin", d); setValue("destination", o);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <Card className="overflow-hidden">
        {/* Trip type tabs */}
        <div className="flex border-b border-white/10">
          {(["one-way", "round-trip"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setValue("tripType", t)}
              className={`flex-1 py-3 text-sm font-medium transition-all ${tripType === t ? "bg-blue-600/20 text-blue-400 border-b-2 border-blue-500" : "text-muted-foreground hover:text-foreground hover:bg-white/5"}`}
            >
              {t === "one-way" ? "One Way" : "Round Trip"}
            </button>
          ))}
        </div>

        <CardContent className="p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Origin / Destination */}
            <div className="grid grid-cols-1 md:grid-cols-[1fr,auto,1fr] gap-2 items-end">
              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-xs text-muted-foreground">
                  <MapPin className="h-3 w-3" /> From
                </Label>
                <div className="relative">
                  <Input list="cities-from" {...register("origin")} placeholder="Pune, Mumbai..." className="h-12 text-base" />
                  <datalist id="cities-from">{cities.map((c) => <option key={c} value={c} />)}</datalist>
                </div>
                {errors.origin && <p className="text-xs text-red-400">{errors.origin.message}</p>}
              </div>

              <motion.button type="button" whileHover={{ rotate: 180 }} transition={{ duration: 0.3 }} onClick={swapCities}
                className="h-12 w-12 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer shrink-0 mb-0 md:mb-0 self-end">
                <ArrowLeftRight className="h-4 w-4 text-muted-foreground" />
              </motion.button>

              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-xs text-muted-foreground">
                  <MapPin className="h-3 w-3" /> To
                </Label>
                <div className="relative">
                  <Input list="cities-to" {...register("destination")} placeholder="Delhi, Bangalore..." className="h-12 text-base" />
                  <datalist id="cities-to">{cities.map((c) => <option key={c} value={c} />)}</datalist>
                </div>
                {errors.destination && <p className="text-xs text-red-400">{errors.destination.message}</p>}
              </div>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3" /> Departure Date
                </Label>
                <Input type="date" {...register("departureDate")} className="h-12" />
                {errors.departureDate && <p className="text-xs text-red-400">{errors.departureDate.message}</p>}
              </div>
              {tripType === "round-trip" && (
                <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="space-y-2">
                  <Label className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" /> Return Date
                  </Label>
                  <Input type="date" {...register("returnDate")} className="h-12" />
                </motion.div>
              )}
            </div>

            {/* Passengers & Class */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Users className="h-3 w-3" /> Passengers
                </Label>
                <Input type="number" min={1} max={9} {...register("passengers", { valueAsNumber: true })} className="h-12" />
              </div>
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Class</Label>
                <select
                  value={travelClass}
                  onChange={(e) => setValue("travelClass", e.target.value as "Economy" | "Business" | "First")}
                  className="h-12 w-full rounded-xl border border-white/10 bg-white/5 px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {classes.map((c) => <option key={c} value={c} className="bg-gray-900">{c}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Airline</Label>
                <select
                  {...register("preferredAirline")}
                  className="h-12 w-full rounded-xl border border-white/10 bg-white/5 px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {airlines.map((a) => <option key={a} value={a} className="bg-gray-900">{a}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Max Price</Label>
                <Input type="number" {...register("maxPrice", { valueAsNumber: true })} className="h-12" placeholder="20000" />
              </div>
            </div>

            {/* Non-stop toggle */}
            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
              <Switch checked={nonStop} onCheckedChange={(v) => setValue("nonStopOnly", v)} id="nonstop" />
              <Label htmlFor="nonstop" className="cursor-pointer text-sm">Non-stop flights only</Label>
              {nonStop && <Badge variant="success" className="ml-auto text-[10px]">Active</Badge>}
            </div>

            <Button type="submit" size="lg" className="w-full h-12 text-base gap-2" disabled={loading}>
              {loading ? (
                <><Loader2 className="h-5 w-5 animate-spin" /> Searching flights...</>
              ) : (
                <><Search className="h-5 w-5" /> Search Flights</>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
