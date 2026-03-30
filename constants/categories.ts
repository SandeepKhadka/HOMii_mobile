import { Colors } from "./colors";

export interface CategoryApp {
  name:        string;
  description: string;
  icon:        string; // placeholder for app icon
  recommended?: boolean;
}

export interface Category {
  id:          string;
  title:       string;
  subtitle:    string;
  icon:        string; // Ionicons name
  color:       string; // header background
  textColor:   string; // header text
  apps:        CategoryApp[];
  tip?:        { title: string; description: string };
}

export const CATEGORIES: Category[] = [
  {
    id: "documents",
    title: "Documents",
    subtitle: "Visa and University documents",
    icon: "document-text-outline",
    color: Colors.category.documents,
    textColor: "#FFFFFF",
    apps: [],
    tip: undefined,
  },
  {
    id: "accommodation",
    title: "Accomodation",
    subtitle: "Visa and University documents",
    icon: "home-outline",
    color: Colors.category.accommodation,
    textColor: "#FFFFFF",
    apps: [
      { name: "OnTheMarket", description: "Search properties on rent", icon: "" },
      { name: "RightMove",   description: "Find your next student home.", icon: "" },
    ],
  },
  {
    id: "banking",
    title: "Banking",
    subtitle: "Visa and University documents",
    icon: "card-outline",
    color: Colors.category.banking,
    textColor: "#FFFFFF",
    apps: [
      { name: "Monzo",    description: "Digital banking for everyone",  icon: "" },
      { name: "Starling", description: "Award-winning bank account",    icon: "" },
    ],
    tip: {
      title: "Setting up a UK bank account",
      description: "is essential for managing your student life and rent payments easily.",
    },
  },
  {
    id: "sims",
    title: "Simcards",
    subtitle: "Visa and University documents",
    icon: "phone-portrait-outline",
    color: Colors.category.sims,
    textColor: "#FFFFFF",
    apps: [
      { name: "Giffgaff",  description: "The network run by you",      icon: "", recommended: true },
      { name: "EE",         description: "The UK's fastest network",    icon: "" },
      { name: "O2",         description: "Priority and great coverage", icon: "" },
      { name: "Virgin",     description: "Fast mobile data",            icon: "" },
      { name: "Vodafone",   description: "Reliable network provider",   icon: "" },
    ],
  },
  {
    id: "flights",
    title: "Flights",
    subtitle: "Visa and University documents",
    icon: "airplane-outline",
    color: Colors.category.flights,
    textColor: "#FFFFFF",
    apps: [],
  },
  {
    id: "insurance",
    title: "Insurance",
    subtitle: "Visa and University documents",
    icon: "shield-checkmark-outline",
    color: Colors.category.insurance,
    textColor: "#FFFFFF",
    apps: [],
  },
  {
    id: "transport",
    title: "Transport",
    subtitle: "Visa and University documents",
    icon: "bus-outline",
    color: Colors.category.transport,
    textColor: "#FFFFFF",
    apps: [
      { name: "Trainline",   description: "Save on rail & coach tickets",  icon: "", recommended: true },
      { name: "Uber",        description: "Rides in most UK cities",        icon: "" },
      { name: "Citymapper",  description: "London & major city routes",     icon: "" },
      { name: "Stagecoach",  description: "Buses in many UK areas",         icon: "" },
    ],
  },
  {
    id: "food",
    title: "Food",
    subtitle: "Visa and University documents",
    icon: "restaurant-outline",
    color: Colors.category.food,
    textColor: "#FFFFFF",
    apps: [
      { name: "Deliveroo",  description: "Food delivery from local restaurants", icon: "" },
      { name: "Uber Eats",  description: "Your favorite food, delivered",        icon: "" },
    ],
  },
  {
    id: "university",
    title: "University",
    subtitle: "Visa and University documents",
    icon: "school-outline",
    color: Colors.category.university,
    textColor: "#FFFFFF",
    apps: [],
  },
  {
    id: "discounts",
    title: "Discounts",
    subtitle: "Visa and University documents",
    icon: "pricetag-outline",
    color: Colors.category.discounts,
    textColor: "#FFFFFF",
    apps: [
      { name: "UNiDAYS", description: "Student discounts and deals", icon: "" },
    ],
    tip: {
      title: "Verify your status",
      description: "Make sure you have your university email ready to unlock these deals.",
    },
  },
  {
    id: "socialEvents",
    title: "Social Events",
    subtitle: "Visa and University documents",
    icon: "calendar-outline",
    color: Colors.category.socialEvents,
    textColor: "#FFFFFF",
    apps: [],
  },
  {
    id: "exploreUK",
    title: "Explore UK",
    subtitle: "Visa and University documents",
    icon: "compass-outline",
    color: Colors.category.exploreUK,
    textColor: "#FFFFFF",
    apps: [],
  },
];

// Checklist phases
export const PHASES = [
  {
    id: "before-fly",
    title: "Before you fly",
    subtitle: "Get everything ready before arrival",
    icon: "airplane-outline",
    categories: ["documents", "accommodation", "banking", "sims", "flights", "insurance"],
  },
  {
    id: "upon-arrival",
    title: "Upon Arrival",
    subtitle: "Settle in smooth when you arrive.",
    icon: "location-outline",
    categories: ["transport", "food", "university"],
  },
  {
    id: "settling-in",
    title: "Settling In",
    subtitle: "Get Comfortable and start your new life.",
    icon: "home-outline",
    categories: ["discounts", "socialEvents", "exploreUK"],
  },
] as const;

// Documents sub-items
export const DOCUMENT_ITEMS = [
  "Passports",
  "University Enrollment",
  "Immigration Status",
  "Proof of address",
] as const;
