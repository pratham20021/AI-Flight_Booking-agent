import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ChatMessage, Flight, Booking, Notification, UserProfile, SavedTraveler, SearchParams } from "@/types";
import { mockFlights, mockBookings, mockNotifications, mockSavedTravelers } from "@/data/mock-data";

// ─── Chat Store ───────────────────────────────────────────────────────────────
interface ChatStore {
  messages: ChatMessage[];
  isTyping: boolean;
  addMessage: (msg: ChatMessage) => void;
  setTyping: (v: boolean) => void;
  clearMessages: () => void;
}

export const useChatStore = create<ChatStore>((set) => ({
  messages: [],
  isTyping: false,
  addMessage: (msg) => set((s) => ({ messages: [...s.messages, msg] })),
  setTyping: (v) => set({ isTyping: v }),
  clearMessages: () => set({ messages: [] }),
}));

// ─── Flight Store ─────────────────────────────────────────────────────────────
interface FlightStore {
  flights: Flight[];
  filteredFlights: Flight[];
  selectedFlights: Flight[];
  searchParams: Partial<SearchParams>;
  isSearching: boolean;
  setFlights: (flights: Flight[]) => void;
  setFiltered: (flights: Flight[]) => void;
  toggleSelect: (flight: Flight) => void;
  setSearchParams: (p: Partial<SearchParams>) => void;
  setSearching: (v: boolean) => void;
  clearSelected: () => void;
}

export const useFlightStore = create<FlightStore>((set) => ({
  flights: mockFlights,
  filteredFlights: mockFlights,
  selectedFlights: [],
  searchParams: {},
  isSearching: false,
  setFlights: (flights) => set({ flights, filteredFlights: flights }),
  setFiltered: (filteredFlights) => set({ filteredFlights }),
  toggleSelect: (flight) =>
    set((s) => {
      const exists = s.selectedFlights.find((f) => f.id === flight.id);
      if (exists) return { selectedFlights: s.selectedFlights.filter((f) => f.id !== flight.id) };
      if (s.selectedFlights.length >= 3) return s;
      return { selectedFlights: [...s.selectedFlights, flight] };
    }),
  setSearchParams: (p) => set((s) => ({ searchParams: { ...s.searchParams, ...p } })),
  setSearching: (v) => set({ isSearching: v }),
  clearSelected: () => set({ selectedFlights: [] }),
}));

// ─── Booking Store ────────────────────────────────────────────────────────────
interface BookingStore {
  bookings: Booking[];
  currentBooking: Partial<Booking> | null;
  addBooking: (b: Booking) => void;
  setCurrentBooking: (b: Partial<Booking> | null) => void;
  cancelBooking: (id: string) => void;
}

export const useBookingStore = create<BookingStore>((set) => ({
  bookings: mockBookings,
  currentBooking: null,
  addBooking: (b) => set((s) => ({ bookings: [b, ...s.bookings] })),
  setCurrentBooking: (b) => set({ currentBooking: b }),
  cancelBooking: (id) =>
    set((s) => ({
      bookings: s.bookings.map((b) => (b.id === id ? { ...b, status: "cancelled" } : b)),
    })),
}));

// ─── Notification Store ───────────────────────────────────────────────────────
interface NotificationStore {
  notifications: Notification[];
  markRead: (id: string) => void;
  markAllRead: () => void;
  unreadCount: () => number;
}

export const useNotificationStore = create<NotificationStore>((set, get) => ({
  notifications: mockNotifications,
  markRead: (id) =>
    set((s) => ({ notifications: s.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)) })),
  markAllRead: () => set((s) => ({ notifications: s.notifications.map((n) => ({ ...n, read: true })) })),
  unreadCount: () => get().notifications.filter((n) => !n.read).length,
}));

// ─── User Store ───────────────────────────────────────────────────────────────
interface UserStore {
  profile: UserProfile;
  savedTravelers: SavedTraveler[];
  updateProfile: (p: Partial<UserProfile>) => void;
  addTraveler: (t: SavedTraveler) => void;
  removeTraveler: (id: string) => void;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      profile: {
        id: "u1",
        name: "Rahul Sharma",
        email: "rahul.sharma@email.com",
        phone: "+91 98765 43210",
        preferredAirline: "IndiGo",
        preferredSeat: "window",
        mealPreference: "veg",
        language: "English",
        currency: "INR",
        theme: "dark",
      },
      savedTravelers: mockSavedTravelers,
      updateProfile: (p) => set((s) => ({ profile: { ...s.profile, ...p } })),
      addTraveler: (t) => set((s) => ({ savedTravelers: [...s.savedTravelers, t] })),
      removeTraveler: (id) => set((s) => ({ savedTravelers: s.savedTravelers.filter((t) => t.id !== id) })),
    }),
    { name: "user-store" }
  )
);

// ─── Theme Store ──────────────────────────────────────────────────────────────
interface ThemeStore {
  theme: "light" | "dark" | "system";
  setTheme: (t: "light" | "dark" | "system") => void;
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set) => ({ theme: "dark", setTheme: (theme) => set({ theme }) }),
    { name: "theme-store" }
  )
);

// ─── Settings Store ───────────────────────────────────────────────────────────
interface SettingsStore {
  language: string;
  currency: string;
  region: string;
  notifications: { email: boolean; sms: boolean; push: boolean; priceAlerts: boolean };
  privacy: { shareData: boolean; analytics: boolean };
  setLanguage: (v: string) => void;
  setCurrency: (v: string) => void;
  setRegion: (v: string) => void;
  toggleNotification: (key: string) => void;
  togglePrivacy: (key: string) => void;
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      language: "English",
      currency: "INR",
      region: "India",
      notifications: { email: true, sms: true, push: true, priceAlerts: true },
      privacy: { shareData: false, analytics: true },
      setLanguage: (language) => set({ language }),
      setCurrency: (currency) => set({ currency }),
      setRegion: (region) => set({ region }),
      toggleNotification: (key) =>
        set((s) => ({ notifications: { ...s.notifications, [key]: !s.notifications[key as keyof typeof s.notifications] } })),
      togglePrivacy: (key) =>
        set((s) => ({ privacy: { ...s.privacy, [key]: !s.privacy[key as keyof typeof s.privacy] } })),
    }),
    { name: "settings-store" }
  )
);
