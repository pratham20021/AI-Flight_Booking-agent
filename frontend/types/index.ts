export interface Flight {
  id: string;
  airline: string;
  airlineCode: string;
  airlineLogo: string;
  flightNumber: string;
  aircraft: string;
  website: string;
  websiteLogo: string;
  origin: string;
  originCode: string;
  destination: string;
  destinationCode: string;
  departureTime: string;
  arrivalTime: string;
  duration: number; // minutes
  stops: number;
  stopDetails?: string[];
  travelClass: "Economy" | "Business" | "First";
  basePrice: number;
  discount: number;
  finalPrice: number;
  couponCode?: string;
  rating: number;
  pros: string[];
  cons: string[];
  isRecommended: boolean;
  seatsLeft: number;
  baggage: string;
  meal: boolean;
  refundable: boolean;
}

export interface Booking {
  id: string;
  pnr: string;
  flightId: string;
  flight: Flight;
  passenger: Passenger;
  status: "confirmed" | "pending" | "cancelled" | "completed";
  bookingDate: string;
  totalPrice: number;
  seat: string;
  gate: string;
  boardingTime: string;
  terminal: string;
}

export interface Passenger {
  id: string;
  name: string;
  age: number;
  gender: "male" | "female" | "other";
  email: string;
  phone: string;
  passport?: string;
  mealPreference: "veg" | "non-veg" | "vegan" | "jain";
  seatPreference: "window" | "aisle" | "middle";
  specialAssistance?: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  isTyping?: boolean;
  attachments?: string[];
  searchResults?: Flight[];
}

export interface SearchParams {
  origin: string;
  destination: string;
  departureDate: string;
  returnDate?: string;
  passengers: number;
  travelClass: "Economy" | "Business" | "First";
  preferredAirline?: string;
  nonStopOnly: boolean;
  minPrice: number;
  maxPrice: number;
  tripType: "one-way" | "round-trip";
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  timestamp: Date;
  read: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  preferredAirline?: string;
  preferredSeat: "window" | "aisle" | "middle";
  mealPreference: "veg" | "non-veg" | "vegan" | "jain";
  language: string;
  currency: string;
  theme: "light" | "dark" | "system";
}

export interface SavedTraveler {
  id: string;
  name: string;
  relation: string;
  age: number;
  gender: "male" | "female" | "other";
  passport?: string;
  mealPreference: "veg" | "non-veg" | "vegan" | "jain";
  seatPreference: "window" | "aisle" | "middle";
}

export type AirlineKey =
  | "IndiGo"
  | "Air India"
  | "SpiceJet"
  | "Vistara"
  | "Akasa Air"
  | "GoFirst";

export type WebsiteKey =
  | "MakeMyTrip"
  | "Goibibo"
  | "EaseMyTrip"
  | "Booking.com"
  | "Cleartrip"
  | "Yatra";
