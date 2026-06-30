"use client";
import { motion } from "framer-motion";
import { CheckCircle, Download, Share2, Plane, Clock, MapPin, QrCode, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useBookingStore } from "@/store";
import { formatCurrency, formatTime, formatDate, formatDuration } from "@/lib/utils";
import Link from "next/link";
import { toast } from "@/hooks/use-toast";

export default function ConfirmationPage() {
  const { currentBooking } = useBookingStore();
  const booking = currentBooking as any;
  const flight = booking?.flight;

  if (!booking || !flight) return (
    <div className="p-6 text-center">
      <p className="text-muted-foreground">No booking found. <Link href="/dashboard" className="text-blue-400 underline">Go to dashboard</Link></p>
    </div>
  );

  const handleDownload = () => toast({ title: "Downloading ticket...", description: "Your boarding pass PDF is ready!" });
  const handleShare = () => toast({ title: "Link copied!", description: "Booking link copied to clipboard." });

  return (
    <div className="p-6 max-w-2xl mx-auto">
      {/* Success Banner */}
      <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", duration: 0.6 }} className="text-center mb-8">
        <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-green-500/20 border-4 border-green-500/40 mb-4">
          <CheckCircle className="h-10 w-10 text-green-400" />
        </div>
        <h1 className="text-2xl font-bold text-foreground">Booking Confirmed! 🎉</h1>
        <p className="text-muted-foreground mt-2">Your ticket has been booked successfully</p>
        <Badge variant="success" className="mt-3 text-sm px-4 py-1">PNR: {booking.pnr}</Badge>
      </motion.div>

      {/* Ticket Card */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Card className="overflow-hidden">
          {/* Ticket Header */}
          <div className="bg-gradient-to-r from-blue-600/30 to-purple-600/30 p-6 border-b border-white/10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600/30 text-blue-400 font-bold">{flight.airlineCode}</div>
                <div>
                  <p className="font-bold text-foreground">{flight.airline}</p>
                  <p className="text-xs text-muted-foreground">{flight.flightNumber} · {flight.aircraft}</p>
                </div>
              </div>
              <Badge variant="success">Confirmed</Badge>
            </div>

            {/* Route */}
            <div className="flex items-center justify-between">
              <div className="text-center">
                <p className="text-3xl font-bold text-foreground">{formatTime(flight.departureTime)}</p>
                <p className="text-lg font-semibold text-foreground mt-1">{flight.originCode}</p>
                <p className="text-xs text-muted-foreground">{flight.origin}</p>
                <p className="text-xs text-muted-foreground mt-1">{formatDate(flight.departureTime)}</p>
              </div>
              <div className="flex-1 px-4 text-center">
                <div className="flex items-center gap-2 justify-center mb-1">
                  <div className="h-px flex-1 bg-white/20" />
                  <Plane className="h-4 w-4 text-blue-400" />
                  <div className="h-px flex-1 bg-white/20" />
                </div>
                <p className="text-xs text-muted-foreground">{formatDuration(flight.duration)}</p>
                <p className="text-xs text-muted-foreground">{flight.stops === 0 ? "Non-stop" : `${flight.stops} stop`}</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-foreground">{formatTime(flight.arrivalTime)}</p>
                <p className="text-lg font-semibold text-foreground mt-1">{flight.destinationCode}</p>
                <p className="text-xs text-muted-foreground">{flight.destination}</p>
                <p className="text-xs text-muted-foreground mt-1">{formatDate(flight.arrivalTime)}</p>
              </div>
            </div>
          </div>

          {/* Ticket Body */}
          <CardContent className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {[
                { label: "Passenger", value: booking.passenger?.name || "Passenger" },
                { label: "Seat", value: booking.seat || "To be assigned" },
                { label: "Gate", value: booking.gate || "–" },
                { label: "Terminal", value: booking.terminal || "–" },
              ].map(({ label, value }) => (
                <div key={label} className="text-center p-3 bg-white/5 rounded-xl">
                  <p className="text-xs text-muted-foreground mb-1">{label}</p>
                  <p className="font-bold text-foreground text-sm">{value}</p>
                </div>
              ))}
            </div>

            {/* Boarding Time */}
            <div className="flex items-center gap-3 p-4 bg-orange-500/10 border border-orange-500/20 rounded-xl mb-6">
              <Clock className="h-5 w-5 text-orange-400 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-foreground">Boarding Time</p>
                <p className="text-xs text-muted-foreground">{formatTime(booking.boardingTime)} · Please be at the gate 30 minutes before boarding</p>
              </div>
            </div>

            {/* Mock QR Code */}
            <div className="flex items-center justify-center mb-6">
              <div className="p-4 bg-white rounded-xl">
                <div className="grid grid-cols-8 gap-0.5">
                  {Array.from({ length: 64 }, (_, i) => (
                    <div key={i} className={`h-3 w-3 ${Math.random() > 0.5 ? "bg-black" : "bg-white"}`} />
                  ))}
                </div>
                <p className="text-black text-xs text-center mt-2 font-mono">PNR: {booking.pnr}</p>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl mb-4">
              <span className="text-sm text-muted-foreground">Total Paid</span>
              <span className="text-xl font-bold text-green-400">{formatCurrency(booking.totalPrice)}</span>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <Button size="lg" className="flex-1 gap-2" onClick={handleDownload}>
                <Download className="h-4 w-4" />Download Ticket
              </Button>
              <Button variant="outline" size="lg" className="gap-2" onClick={handleShare}>
                <Share2 className="h-4 w-4" />Share
              </Button>
              <Link href="/dashboard">
                <Button variant="ghost" size="icon" className="rounded-xl h-12 w-12">
                  <Home className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
