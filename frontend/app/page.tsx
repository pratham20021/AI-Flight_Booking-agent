"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { Plane, MessageSquare, Search, Zap, Shield, Globe, ChevronRight, Star, ArrowRight, Check, Sparkles, Brain, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ThemeSwitch } from "@/components/common/theme-switch";

const features = [
  { icon: Brain, title: "AI-Powered Search", desc: "Type naturally and let our AI find the best flights for you across all major platforms.", color: "text-blue-400", bg: "bg-blue-500/10" },
  { icon: Search, title: "Multi-Platform Search", desc: "Simultaneously searches MakeMyTrip, Goibibo, EaseMyTrip, Booking.com and more.", color: "text-purple-400", bg: "bg-purple-500/10" },
  { icon: Zap, title: "Instant Comparison", desc: "Compare prices, airlines, and amenities side-by-side in seconds.", color: "text-yellow-400", bg: "bg-yellow-500/10" },
  { icon: Shield, title: "Best Price Guarantee", desc: "We scan 200+ sources to ensure you always get the lowest price available.", color: "text-green-400", bg: "bg-green-500/10" },
  { icon: Globe, title: "Global Coverage", desc: "Search flights to over 500 destinations worldwide with real-time availability.", color: "text-orange-400", bg: "bg-orange-500/10" },
  { icon: Clock, title: "24/7 Assistance", desc: "AI agent is available round the clock to help with bookings and queries.", color: "text-pink-400", bg: "bg-pink-500/10" },
];

const steps = [
  { step: "01", title: "Describe Your Trip", desc: "Just type naturally: where you want to go, when, how many passengers.", icon: MessageSquare },
  { step: "02", title: "AI Searches Everything", desc: "Our AI instantly searches 20+ platforms and hundreds of airlines.", icon: Search },
  { step: "03", title: "Compare & Choose", desc: "See all options side by side with prices, ratings, and AI recommendations.", icon: Zap },
  { step: "04", title: "Book in Seconds", desc: "Complete your booking in under 2 minutes with saved passenger details.", icon: Check },
];

const testimonials = [
  { name: "Priya Sharma", role: "Frequent Traveler", text: "Found a flight 40% cheaper than what I usually pay. The AI understood exactly what I needed!", avatar: "PS" },
  { name: "Rahul Mehta", role: "Business Traveler", text: "The natural language search is incredible. I just type like I'm talking and it finds perfect flights.", avatar: "RM" },
  { name: "Anjali Kumar", role: "Travel Blogger", text: "The comparison feature is a game changer. I can see all airlines and booking sites in one place.", avatar: "AK" },
];

const airlines = ["IndiGo", "Air India", "SpiceJet", "Vistara", "Akasa Air", "GoFirst"];
const websites = ["MakeMyTrip", "Goibibo", "EaseMyTrip", "Booking.com", "Cleartrip", "Yatra"];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-white overflow-x-hidden">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-gray-950/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg">
              <Plane className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold text-white">AI Travel Agent</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-gray-400">
            {["Features", "How it Works", "Technology", "Pricing"].map((item) => (
              <a key={item} href={`#${item.toLowerCase().replace(/ /g, "-")}`} className="hover:text-white transition-colors cursor-pointer">{item}</a>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <ThemeSwitch />
            <Link href="/dashboard">
              <Button size="sm" className="gap-2">
                <Sparkles className="h-3.5 w-3.5" />Launch App
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-blue-600/10 blur-3xl" />
          <div className="absolute top-1/3 right-1/4 h-80 w-80 rounded-full bg-purple-600/10 blur-3xl" />
          <div className="absolute bottom-1/4 left-1/2 h-64 w-64 rounded-full bg-blue-500/5 blur-3xl" />
        </div>

        <div className="relative max-w-5xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Badge variant="secondary" className="mb-6 px-4 py-1.5 text-xs gap-2 border border-blue-500/30 bg-blue-500/10 text-blue-300">
              <Sparkles className="h-3 w-3" /> AI-Powered Flight Booking
            </Badge>
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight tracking-tight mb-6">
            Book Flights with
            <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-blue-600 bg-clip-text text-transparent">
              Natural Language
            </span>
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto mb-8">
            Just tell our AI where you want to go. It searches all major platforms, compares prices, and books the best flight for you.
          </motion.p>

          {/* Example prompt */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}
            className="flex items-center gap-3 max-w-2xl mx-auto mb-10 p-4 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-purple-600 to-blue-600">
              <Plane className="h-4 w-4 text-white" />
            </div>
            <div className="flex-1 text-left">
              <p className="text-xs text-gray-500 mb-0.5">Try saying...</p>
              <p className="text-sm text-white">"Book the cheapest flight from Pune to Delhi tomorrow after 6 PM"</p>
            </div>
            <ArrowRight className="h-4 w-4 text-blue-400 shrink-0" />
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/dashboard/search">
              <Button size="xl" className="gap-2 shadow-2xl shadow-blue-500/25">
                <Sparkles className="h-5 w-5" />Try AI Search Free
                <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button size="xl" variant="outline" className="gap-2 border-white/20">
                View Dashboard
              </Button>
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
            className="grid grid-cols-3 gap-6 max-w-sm sm:max-w-md mx-auto mt-16">
            {[["500+", "Destinations"], ["20+", "Booking Sites"], ["₹40K+", "Avg. Savings/Year"]].map(([val, label]) => (
              <div key={label} className="text-center">
                <p className="text-2xl font-bold text-white">{val}</p>
                <p className="text-xs text-gray-500 mt-0.5">{label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Airlines & Websites marquee */}
      <section className="py-10 border-y border-white/5 bg-white/2 overflow-hidden">
        <p className="text-center text-xs text-gray-500 mb-6 uppercase tracking-widest">Searches across all major platforms</p>
        <div className="flex gap-8 flex-wrap justify-center px-6">
          {[...airlines, ...websites].map((name) => (
            <span key={name} className="text-gray-500 text-sm font-medium hover:text-gray-300 transition-colors cursor-default whitespace-nowrap">{name}</span>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4 border border-white/10">Features</Badge>
            <h2 className="text-4xl font-bold mb-4">Everything you need to travel smart</h2>
            <p className="text-gray-400 max-w-xl mx-auto">Powered by AI, built for modern travelers who want the best prices without the hassle.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div key={f.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                whileHover={{ y: -4 }}
                className="p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm hover:border-white/20 hover:bg-white/8 transition-all">
                <div className={`inline-flex p-3 rounded-xl ${f.bg} mb-4`}><f.icon className={`h-6 w-6 ${f.color}`} /></div>
                <h3 className="text-lg font-semibold mb-2">{f.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-24 px-4 sm:px-6 bg-white/2">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4 border border-white/10">How it Works</Badge>
            <h2 className="text-4xl font-bold mb-4">Book in 4 simple steps</h2>
            <p className="text-gray-400">From search to boarding pass in under 3 minutes.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {steps.map((s, i) => (
              <motion.div key={s.step} initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }}
                className="flex gap-5 p-6 rounded-2xl border border-white/10 bg-white/5">
                <div className="shrink-0">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 font-bold text-sm">{s.step}</div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2 flex items-center gap-2"><s.icon className="h-4 w-4 text-blue-400" />{s.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{s.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Technology */}
      <section id="technology" className="py-24 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto text-center">
          <Badge variant="secondary" className="mb-4 border border-white/10">Technology</Badge>
          <h2 className="text-4xl font-bold mb-4">Built with cutting-edge tech</h2>
          <p className="text-gray-400 max-w-xl mx-auto mb-12">A modern, production-quality stack built for performance and scale.</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {["Next.js 15", "React 19", "TypeScript", "Tailwind CSS", "Framer Motion", "Zustand", "shadcn/ui", "Zod"].map((tech, i) => (
              <motion.div key={tech} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}
                className="p-4 rounded-xl border border-white/10 bg-white/5 hover:border-blue-500/30 hover:bg-blue-500/5 transition-all cursor-default">
                <p className="font-semibold text-sm text-white">{tech}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-4 sm:px-6 bg-white/2">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Loved by travelers</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div key={t.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }}
                className="p-6 rounded-2xl border border-white/10 bg-white/5">
                <div className="flex gap-1 mb-4">{[...Array(5)].map((_, j) => <Star key={j} className="h-4 w-4 text-yellow-400 fill-yellow-400" />)}</div>
                <p className="text-gray-300 text-sm leading-relaxed mb-4">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-xs font-bold">{t.avatar}</div>
                  <div><p className="text-sm font-semibold">{t.name}</p><p className="text-xs text-gray-500">{t.role}</p></div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4 sm:px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center p-12 rounded-3xl border border-blue-500/20 bg-gradient-to-br from-blue-600/10 via-purple-600/5 to-blue-600/10 backdrop-blur-sm">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-2xl mx-auto mb-6">
            <Sparkles className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-4xl font-bold mb-4">Ready to travel smarter?</h2>
          <p className="text-gray-400 mb-8 max-w-md mx-auto">Join thousands of travelers saving time and money with AI-powered flight search.</p>
          <Link href="/dashboard">
            <Button size="xl" className="gap-2 shadow-2xl shadow-blue-500/30">
              <Sparkles className="h-5 w-5" />Get Started Free
              <ChevronRight className="h-4 w-4" />
            </Button>
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600">
              <Plane className="h-3.5 w-3.5 text-white" />
            </div>
            <span className="font-bold text-sm">AI Travel Agent</span>
          </div>
          <p className="text-xs text-gray-500">© 2025 AI Travel Agent. Built with ❤️ for travelers. All data is mock.</p>
          <div className="flex gap-6 text-xs text-gray-500">
            {["Privacy", "Terms", "Contact"].map((l) => <a key={l} href="#" className="hover:text-gray-300 transition-colors">{l}</a>)}
          </div>
        </div>
      </footer>
    </div>
  );
}
