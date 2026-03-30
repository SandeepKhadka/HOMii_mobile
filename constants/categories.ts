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
  checklistItems: string[];
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
    checklistItems: ["Passports", "University Enrollment", "Immigration Status", "Proof of address"],
    tip: undefined,
  },
  {
    id: "accommodation",
    title: "Accomodation",
    subtitle: "Find your student home",
    icon: "home-outline",
    color: Colors.category.accommodation,
    textColor: "#FFFFFF",
    checklistItems: ["Search properties", "Compare prices", "Book accommodation", "Confirm booking"],
    apps: [
      { name: "OnTheMarket", description: "Search properties on rent", icon: "" },
      { name: "RightMove",   description: "Find your next student home.", icon: "" },
    ],
  },
  {
    id: "banking",
    title: "Banking",
    subtitle: "Set up your UK bank account",
    icon: "card-outline",
    color: Colors.category.banking,
    textColor: "#FFFFFF",
    checklistItems: ["Open bank account", "Set up online banking", "Get debit card"],
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
    subtitle: "Get a UK SIM card",
    icon: "phone-portrait-outline",
    color: Colors.category.sims,
    textColor: "#FFFFFF",
    checklistItems: ["Compare plans", "Get SIM card", "Activate SIM"],
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
    subtitle: "Book your flights to the UK",
    icon: "airplane-outline",
    color: Colors.category.flights,
    textColor: "#FFFFFF",
    checklistItems: ["Book flights", "Confirm booking", "Check baggage allowance"],
    apps: [],
  },
  {
    id: "insurance",
    title: "Insurance",
    subtitle: "Protect yourself in the UK",
    icon: "shield-checkmark-outline",
    color: Colors.category.insurance,
    textColor: "#FFFFFF",
    checklistItems: ["Health insurance", "Travel insurance", "Contents insurance"],
    apps: [],
  },
  {
    id: "transport",
    title: "Transport",
    subtitle: "Get around your new city",
    icon: "bus-outline",
    color: Colors.category.transport,
    textColor: "#FFFFFF",
    checklistItems: ["Get travel card", "Download transport apps", "Plan your route"],
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
    subtitle: "Find food and groceries",
    icon: "restaurant-outline",
    color: Colors.category.food,
    textColor: "#FFFFFF",
    checklistItems: ["Find local supermarkets", "Download delivery apps", "Explore local restaurants"],
    apps: [
      { name: "Deliveroo",  description: "Food delivery from local restaurants", icon: "" },
      { name: "Uber Eats",  description: "Your favorite food, delivered",        icon: "" },
    ],
  },
  {
    id: "university",
    title: "University",
    subtitle: "Get set up at your university",
    icon: "school-outline",
    color: Colors.category.university,
    textColor: "#FFFFFF",
    checklistItems: ["Campus orientation", "Student ID", "Library access", "Enroll in courses"],
    apps: [],
  },
  {
    id: "discounts",
    title: "Discounts",
    subtitle: "Unlock student deals",
    icon: "pricetag-outline",
    color: Colors.category.discounts,
    textColor: "#FFFFFF",
    checklistItems: ["Get student discount card", "Verify student status"],
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
    subtitle: "Meet people and have fun",
    icon: "calendar-outline",
    color: Colors.category.socialEvents,
    textColor: "#FFFFFF",
    checklistItems: ["Join student union", "Find events", "Join societies"],
    apps: [],
  },
  {
    id: "exploreUK",
    title: "Explore UK",
    subtitle: "Discover your new home",
    icon: "compass-outline",
    color: Colors.category.exploreUK,
    textColor: "#FFFFFF",
    checklistItems: ["Local attractions", "Day trips", "City guides"],
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

