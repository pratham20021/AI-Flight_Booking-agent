"use client";
import { motion } from "framer-motion";
import { ChatInterface } from "@/components/chat/chat-interface";
import { SearchForm } from "@/components/search/search-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageSquare, Search } from "lucide-react";

export default function SearchPage() {
  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      <Tabs defaultValue="chat" className="flex flex-col h-full">
        <div className="border-b border-white/10 px-6 py-3 shrink-0">
          <TabsList>
            <TabsTrigger value="chat" className="gap-2 text-xs"><MessageSquare className="h-3.5 w-3.5" />AI Chat</TabsTrigger>
            <TabsTrigger value="form" className="gap-2 text-xs"><Search className="h-3.5 w-3.5" />Search Form</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="chat" className="flex-1 overflow-hidden mt-0 data-[state=active]:flex data-[state=active]:flex-col">
          <ChatInterface />
        </TabsContent>

        <TabsContent value="form" className="flex-1 overflow-y-auto mt-0 p-6">
          <div className="max-w-2xl mx-auto">
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
              <h1 className="text-xl font-bold text-foreground">Search Flights</h1>
              <p className="text-sm text-muted-foreground mt-1">Fill in your travel details to find the best flights</p>
            </motion.div>
            <SearchForm />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
