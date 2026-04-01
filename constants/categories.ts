import { Colors } from "./colors";

export interface CategoryApp {
  name:        string;
  description: string;
  icon:        string;
  recommended?: boolean;
}

export interface Category {
  id:          string;
  title:       string;
  subtitle:    string;
  icon:        string;
  color:       string;
  textColor:   string;
  apps:        CategoryApp[];
  checklistItems: string[];
  tip?:        { title: string; description: string };
}

export const CATEGORIES: Category[] = [
  // Phase 1 — Before You Fly
  {
    id: "sims",
    title: "SIM Cards",
    subtitle: "Get a UK SIM card",
    icon: "phone-portrait-outline",
    color: Colors.category.sims,
    textColor: "#FFFFFF",
    checklistItems: ["Compare plans", "Get SIM card", "Activate SIM"],
    apps: [
      { name: "Giffgaff",  description: "The network run by you",      icon: "", recommended: true },
      { name: "EE",         description: "The UK's fastest network",    icon: "" },
      { name: "O2",         description: "Priority and great coverage", icon: "" },
      { name: "Vodafone",   description: "Reliable network provider",   icon: "" },
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
    ],
  },

  // Phase 2 — First 48 Hours
  {
    id: "food",
    title: "Food Delivery",
    subtitle: "Get food delivered to your door",
    icon: "restaurant-outline",
    color: Colors.category.food,
    textColor: "#FFFFFF",
    checklistItems: ["Download delivery apps", "Place first order", "Find local restaurants"],
    apps: [
      { name: "Deliveroo",  description: "Food delivery from local restaurants", icon: "" },
      { name: "Uber Eats",  description: "Your favorite food, delivered",        icon: "" },
      { name: "Just Eat",   description: "Takeaway delivered to your door",      icon: "" },
    ],
  },
  {
    id: "discounts",
    title: "Student Discounts",
    subtitle: "Unlock student deals and save money",
    icon: "pricetag-outline",
    color: Colors.category.discounts,
    textColor: "#FFFFFF",
    checklistItems: ["Get student discount card", "Verify student status", "Browse available deals"],
    apps: [
      { name: "UNiDAYS",       description: "Student discounts and deals",     icon: "" },
      { name: "Student Beans", description: "Exclusive student offers",         icon: "" },
    ],
    tip: {
      title: "Verify your status",
      description: "Make sure you have your university email ready to unlock these deals.",
    },
  },

  // Phase 3 — First Week
  {
    id: "groceries",
    title: "Groceries",
    subtitle: "Find supermarkets and grocery shopping",
    icon: "cart-outline",
    color: "#F97316",
    textColor: "#FFFFFF",
    checklistItems: ["Find local supermarkets", "Download grocery apps", "Plan weekly shop"],
    apps: [
      { name: "Tesco",       description: "Groceries delivered to your door",  icon: "" },
      { name: "Sainsbury's", description: "Quality food and groceries",        icon: "" },
      { name: "Aldi",        description: "Great quality, low prices",         icon: "" },
    ],
  },
  {
    id: "events",
    title: "Events",
    subtitle: "Freshers events, student nights and more",
    icon: "calendar-outline",
    color: Colors.category.socialEvents,
    textColor: "#FFFFFF",
    checklistItems: ["Join student union", "Find freshers events", "Join societies", "Explore campus activities"],
    apps: [],
  },
];

// Checklist phases — matches spec exactly
export const PHASES = [
  {
    id: "before-fly",
    title: "Before You Fly",
    subtitle: "Get everything ready before arrival",
    icon: "airplane-outline",
    categories: ["sims", "banking", "transport"],
  },
  {
    id: "upon-arrival",
    title: "First 48 Hours",
    subtitle: "Settle in smooth when you arrive",
    icon: "location-outline",
    categories: ["food", "discounts"],
  },
  {
    id: "settling-in",
    title: "First Week",
    subtitle: "Get comfortable and start your new life",
    icon: "home-outline",
    categories: ["groceries", "events"],
  },
] as const;
