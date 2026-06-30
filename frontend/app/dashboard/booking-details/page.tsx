"use client";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, Plane, User, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useBookingStore, useFlightStore } from "@/store";
import { formatCurrency, formatTime, formatDuration, generatePNR } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { sleep } from "@/lib/utils";
import { Booking } from "@/types";
import { toast } from "@/hooks/use-toast";

const schema = z.object({
  name: z.string().min(2, "Enter full name"),
  age: z.number().min(1).max(120),
  gender: z.enum(["male", "female", "other"]),
  email: z.string().email("Enter valid email"),
  phone: z.string().min(10, "Enter valid phone"),
  passport: z.string().optional(),
  mealPreference: z.enum(["veg", "non-veg", "vegan", "jain"]),
  seatPreference: z.enum(["window", "aisle", "middle"]),
  specialAssistance: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export default function BookingDetailsPage() {
  const { currentBooking, setCurrentBooking, addBooking } = useBookingStore();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const flight = currentBooking?.flight;

  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { age: 25, gender: "male", mealPreference: "veg", seatPreference: "window" },
  });

  const onSubmit = async (data: FormValues) => {
    if (!flight) return;
    setLoading(true);
    await sleep(2000);
    const booking: Booking = {
      id: Date.now().toString(),
      pnr: generatePNR(),
      flightId: flight.id,
      flight,
      passenger: { id: Date.now().toString(), ...data },
      status: "confirmed",
      bookingDate: new Date().toISOString().split("T")[0],
      totalPrice: flight.finalPrice,
      seat: `${Math.floor(Math.random() * 30) + 1}${["A", "B", "C", "D", "E", "F"][Math.floor(Math.random() * 6)]}`,
      gate: `G${Math.floor(Math.random() * 20) + 1}`,
      boardingTime: new Date(new Date(flight.departureTime).getTime() - 45 * 60000).toISOString(),
      terminal: `T${Math.floor(Math.random() * 3) + 1}`,
    };
    addBooking(booking);
    setCurrentBooking(booking);
    setLoading(false);
    toast({ title: "Booking Confirmed! 🎉", description: `PNR: ${booking.pnr}` });
    router.push("/dashboard/confirmation");
  };

  if (!flight) return (
    <div className="p-6 text-center">
      <p className="text-muted-foreground">No flight selected. <button onClick={() => router.push("/dashboard/bookings")} className="text-blue-400 underline">Browse flights</button></p>
    </div>
  );

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3 mb-6">
        <Button variant="ghost" size="icon-sm" onClick={() => router.back()} className="rounded-xl"><ArrowLeft className="h-4 w-4" /></Button>
        <div>
          <h1 className="text-xl font-bold text-foreground">Passenger Details</h1>
          <p className="text-sm text-muted-foreground">Fill in details to complete your booking</p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-2">
          <form onSubmit={handleSubmit(onSubmit)}>
            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2 text-base"><User className="h-4 w-4" />Passenger Information</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs">Full Name *</Label>
                    <Input {...register("name")} placeholder="As on passport/ID" className="h-10" />
                    {errors.name && <p className="text-xs text-red-400">{errors.name.message}</p>}
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Age *</Label>
                    <Input type="number" {...register("age", { valueAsNumber: true })} className="h-10" />
                    {errors.age && <p className="text-xs text-red-400">{errors.age.message}</p>}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs">Gender *</Label>
                  <div className="flex gap-3">
                    {["male", "female", "other"].map((g) => (
                      <label key={g} className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" value={g} {...register("gender")} className="accent-blue-500" />
                        <span className="text-sm capitalize text-foreground">{g}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs">Email *</Label>
                    <Input type="email" {...register("email")} placeholder="you@example.com" className="h-10" />
                    {errors.email && <p className="text-xs text-red-400">{errors.email.message}</p>}
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Phone *</Label>
                    <Input {...register("phone")} placeholder="+91 98765 43210" className="h-10" />
                    {errors.phone && <p className="text-xs text-red-400">{errors.phone.message}</p>}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs">Passport Number (Optional)</Label>
                  <Input {...register("passport")} placeholder="For international flights" className="h-10" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs">Meal Preference</Label>
                    <select {...register("mealPreference")} className="h-10 w-full rounded-xl border border-white/10 bg-white/5 px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500">
                      {["veg", "non-veg", "vegan", "jain"].map((m) => <option key={m} value={m} className="bg-gray-900 capitalize">{m}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Seat Preference</Label>
                    <select {...register("seatPreference")} className="h-10 w-full rounded-xl border border-white/10 bg-white/5 px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500">
                      {["window", "aisle", "middle"].map((s) => <option key={s} value={s} className="bg-gray-900 capitalize">{s}</option>)}
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs">Special Assistance (Optional)</Label>
                  <Input {...register("specialAssistance")} placeholder="Wheelchair, visual impairment, etc." className="h-10" />
                </div>

                <Button type="submit" size="lg" className="w-full gap-2" disabled={loading}>
                  {loading ? <><Loader2 className="h-5 w-5 animate-spin" />Confirming Booking...</> : <>Confirm & Book · {formatCurrency(flight.finalPrice)}</>}
                </Button>
              </CardContent>
            </Card>
          </form>
        </motion.div>

        {/* Flight Summary */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2 text-base"><Plane className="h-4 w-4" />Flight Summary</CardTitle></CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600/20 text-blue-400 font-bold text-xs">{flight.airlineCode}</div>
                <div>
                  <p className="font-semibold">{flight.airline}</p>
                  <p className="text-xs text-muted-foreground">{flight.flightNumber}</p>
                </div>
              </div>
              <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl">
                <div className="text-center"><p className="text-lg font-bold">{formatTime(flight.departureTime)}</p><p className="text-xs text-muted-foreground">{flight.originCode}</p></div>
                <div className="text-center text-xs text-muted-foreground"><p>{formatDuration(flight.duration)}</p><p>{flight.stops === 0 ? "Non-stop" : `${flight.stops} stop`}</p></div>
                <div className="text-center"><p className="text-lg font-bold">{formatTime(flight.arrivalTime)}</p><p className="text-xs text-muted-foreground">{flight.destinationCode}</p></div>
              </div>
              <div className="space-y-2">
                {[["Class", flight.travelClass], ["Baggage", flight.baggage], ["Meal", flight.meal ? "Included" : "Not included"], ["Refundable", flight.refundable ? "Yes" : "No"]].map(([k, v]) => (
                  <div key={k} className="flex justify-between text-xs"><span className="text-muted-foreground">{k}</span><span className="font-medium">{v}</span></div>
                ))}
              </div>
              <div className="border-t border-white/10 pt-3 space-y-1">
                <div className="flex justify-between text-xs"><span className="text-muted-foreground">Base Fare</span><span>{formatCurrency(flight.basePrice)}</span></div>
                <div className="flex justify-between text-xs text-green-400"><span>Discount ({flight.discount}%)</span><span>-{formatCurrency(flight.basePrice - flight.finalPrice)}</span></div>
                <div className="flex justify-between font-bold mt-2"><span>Total</span><span>{formatCurrency(flight.finalPrice)}</span></div>
              </div>
              {flight.couponCode && <Badge variant="warning" className="w-full justify-center text-xs">Use code: {flight.couponCode}</Badge>}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
