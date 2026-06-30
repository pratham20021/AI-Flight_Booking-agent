"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Mic, Paperclip, Plane, User, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ChatMessage } from "@/types";
import { useChatStore } from "@/store";
import { useFlightStore } from "@/store";
import { mockFlights, suggestedPrompts } from "@/data/mock-data";
import { FlightCard } from "@/components/flights/flight-card";
import { cn } from "@/lib/utils";
import { sleep } from "@/lib/utils";

const searchSteps = [
  "🔍 Searching MakeMyTrip...",
  "🔍 Searching Goibibo...",
  "🔍 Searching EaseMyTrip...",
  "🔍 Searching Booking.com...",
  "⚡ Comparing prices across 40+ airlines...",
  "🤖 Analyzing best options with AI...",
];

function TypingDots() {
  return (
    <div className="flex items-center gap-1 px-1">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="h-2 w-2 rounded-full bg-blue-400"
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
        />
      ))}
    </div>
  );
}

function MessageBubble({ msg }: { msg: ChatMessage }) {
  const isUser = msg.role === "user";
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn("flex gap-3 mb-6", isUser && "flex-row-reverse")}
    >
      <Avatar className={cn("h-8 w-8 shrink-0 ring-2", isUser ? "ring-blue-500/30" : "ring-purple-500/30")}>
        <AvatarFallback className={cn("text-xs", isUser ? "bg-blue-600" : "bg-gradient-to-br from-purple-600 to-blue-600")}>
          {isUser ? <User className="h-4 w-4" /> : <Plane className="h-4 w-4" />}
        </AvatarFallback>
      </Avatar>

      <div className={cn("flex-1 max-w-[80%]", isUser && "items-end flex flex-col")}>
        <div className={cn(
          "rounded-2xl px-4 py-3 text-sm leading-relaxed",
          isUser
            ? "bg-blue-600 text-white rounded-tr-sm"
            : "bg-white/5 border border-white/10 text-foreground rounded-tl-sm"
        )}>
          {msg.isTyping ? (
            <TypingDots />
          ) : (
            <div className="whitespace-pre-wrap">{msg.content}</div>
          )}
        </div>
        {!msg.isTyping && (
          <p className="text-[10px] text-muted-foreground mt-1 px-1">
            {new Date(msg.timestamp).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
          </p>
        )}
        {msg.searchResults && msg.searchResults.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-4 w-full space-y-3">
            <p className="text-xs text-muted-foreground px-1">Showing top results:</p>
            {msg.searchResults.slice(0, 3).map((f, i) => (
              <FlightCard key={f.id} flight={f} index={i} />
            ))}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

export function ChatInterface() {
  const { messages, isTyping, addMessage, setTyping, clearMessages } = useChatStore();
  const { setSearching } = useFlightStore();
  const [input, setInput] = useState("");
  const [searchProgress, setSearchProgress] = useState<string[]>([]);
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping, searchProgress]);

  const simulateSearch = useCallback(async (userMsg: string) => {
    setTyping(true);
    setSearching(true);
    const steps: string[] = [];

    for (const step of searchSteps) {
      await sleep(600);
      steps.push(step);
      setSearchProgress([...steps]);
    }

    await sleep(500);
    setSearchProgress([]);
    setTyping(false);
    setSearching(false);

    const isFlightQuery = /flight|book|search|fly|travel|cheap|from|to/i.test(userMsg);
    const results = isFlightQuery ? mockFlights.slice(0, 5) : [];

    const responseText = isFlightQuery
      ? `✅ Found **${mockFlights.length} flights** across all major platforms!\n\nHere are the best options based on price, reliability, and ratings. The top recommendation is marked with ⭐.\n\nWould you like me to compare them or proceed with booking?`
      : "I can help you search for flights! Just tell me your origin, destination, and travel dates. For example:\n\n*\"Book the cheapest flight from Pune to Delhi tomorrow after 6 PM\"*";

    addMessage({
      id: Date.now().toString(),
      role: "assistant",
      content: responseText,
      timestamp: new Date(),
      searchResults: results,
    });
  }, [addMessage, setTyping, setSearching]);

  const handleSend = useCallback(async () => {
    if (!input.trim()) return;
    const userMsg = input.trim();
    setInput("");
    addMessage({ id: Date.now().toString(), role: "user", content: userMsg, timestamp: new Date() });
    await simulateSearch(userMsg);
  }, [input, addMessage, simulateSearch]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const isEmpty = messages.length === 0;

  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
      <ScrollArea className="flex-1 px-4 py-6">
        {isEmpty ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center justify-center h-full min-h-[400px] text-center px-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-2xl mb-6">
              <Sparkles className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">How can I help you travel?</h2>
            <p className="text-muted-foreground text-sm max-w-md mb-8">
              Ask me to search flights, compare prices, or book tickets in natural language.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-lg">
              {suggestedPrompts.map((p, i) => (
                <motion.button
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => { setInput(p); textareaRef.current?.focus(); }}
                  className="text-left text-xs p-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-muted-foreground hover:text-foreground transition-all cursor-pointer"
                >
                  {p}
                </motion.button>
              ))}
            </div>
          </motion.div>
        ) : (
          <div className="max-w-3xl mx-auto">
            {messages.map((msg) => <MessageBubble key={msg.id} msg={msg} />)}
            {(isTyping || searchProgress.length > 0) && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex gap-3 mb-4">
                <Avatar className="h-8 w-8 ring-2 ring-purple-500/30">
                  <AvatarFallback className="bg-gradient-to-br from-purple-600 to-blue-600">
                    <Plane className="h-4 w-4 text-white" />
                  </AvatarFallback>
                </Avatar>
                <div className="bg-white/5 border border-white/10 rounded-2xl rounded-tl-sm px-4 py-3 max-w-sm">
                  {searchProgress.length > 0 ? (
                    <div className="space-y-1.5">
                      {searchProgress.map((step, i) => (
                        <motion.p key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="text-xs text-muted-foreground flex items-center gap-2">
                          {i === searchProgress.length - 1 && <Loader2 className="h-3 w-3 animate-spin text-blue-400" />}
                          {step}
                        </motion.p>
                      ))}
                    </div>
                  ) : <TypingDots />}
                </div>
              </motion.div>
            )}
            <div ref={bottomRef} />
          </div>
        )}
      </ScrollArea>

      {/* Input */}
      <div className="border-t border-white/10 bg-gray-950/80 backdrop-blur-xl p-4">
        <div className="max-w-3xl mx-auto">
          {messages.length > 0 && (
            <div className="flex gap-2 mb-3 flex-wrap">
              {["Cheapest option", "Business class only", "Non-stop flights", "Compare all"].map((s) => (
                <button
                  key={s}
                  onClick={() => setInput(s)}
                  className="text-xs px-3 py-1 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 text-muted-foreground hover:text-foreground transition-all cursor-pointer"
                >
                  {s}
                </button>
              ))}
            </div>
          )}
          <div className="flex items-end gap-2 rounded-2xl border border-white/10 bg-white/5 p-2 focus-within:ring-2 focus-within:ring-blue-500/50 transition-all">
            <Button variant="ghost" size="icon-sm" className="rounded-xl shrink-0">
              <Paperclip className="h-4 w-4 text-muted-foreground" />
            </Button>
            <Textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask me to search flights... e.g. 'Book cheapest flight from Pune to Delhi tomorrow'"
              className="flex-1 min-h-[20px] max-h-[120px] bg-transparent border-none focus:ring-0 resize-none text-sm py-1 px-1"
              rows={1}
            />
            <div className="flex items-center gap-1 shrink-0">
              <Button variant="ghost" size="icon-sm" className="rounded-xl">
                <Mic className="h-4 w-4 text-muted-foreground" />
              </Button>
              <Button
                size="icon-sm"
                onClick={handleSend}
                disabled={!input.trim() || isTyping}
                className={cn("rounded-xl transition-all", input.trim() ? "bg-blue-600 hover:bg-blue-700" : "bg-white/10")}
              >
                {isTyping ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </Button>
            </div>
          </div>
          <p className="text-[10px] text-muted-foreground text-center mt-2">
            Press Enter to send · Shift+Enter for new line · All results are mock data
          </p>
        </div>
      </div>
    </div>
  );
}
