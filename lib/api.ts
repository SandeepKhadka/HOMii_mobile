import { supabase } from './supabase';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api/v1';

async function getAuthHeaders(): Promise<Record<string, string>> {
  const { data } = await supabase.auth.getSession();
  const token = data?.session?.access_token;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const headers = await getAuthHeaders();
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
      ...options?.headers,
    },
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`API ${res.status}: ${body}`);
  }

  return res.json();
}

// ─── Public endpoints (no auth) ────────────────────────────

export interface ApiUniversity {
  id: string;
  name: string;
  city: string;
}

export interface ApiApp {
  id: string;
  name: string;
  description: string | null;
  icon: string | null;
  sortOrder: number;
}

export interface ApiChecklistItem {
  id: string;
  title: string;
  subtitle: string | null;
  sortOrder: number;
}

export interface ApiCategory {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  icon: string | null;
  color: string | null;
  phase: string;
  sortOrder: number;
  apps: ApiApp[];
  checklistItems: ApiChecklistItem[];
}

export interface ApiPhase {
  id: string;
  slug: string;
  name: string;
  icon: string | null;
  sortOrder: number;
  active: boolean;
}

export const api = {
  // Universities
  getUniversities: () => request<ApiUniversity[]>('/universities'),

  // Phases (public — returns only active phases)
  getPhases: () => request<ApiPhase[]>('/phases'),

  // Categories
  getCategories: () => request<ApiCategory[]>('/categories'),
  getCategoriesByPhase: (phase: string) => request<ApiCategory[]>(`/categories?phase=${phase}`),
  getCategoryBySlug: (slug: string) => request<ApiCategory | null>(`/categories/${slug}`),
  getCategoriesPaginated: (page: number, limit = 6) =>
    request<{ items: ApiCategory[]; total: number; page: number; limit: number; hasMore: boolean }>(
      `/categories?page=${page}&limit=${limit}`
    ),

  // Clicks (authenticated)
  trackClick: (appId: string, refId?: string) =>
    request<ClickResponse>('/clicks', {
      method: 'POST',
      body: JSON.stringify({ appId, refId }),
    }),

  // Referrals (authenticated)
  attributeReferral: (referralCode: string) =>
    request('/referrals/attribute', {
      method: 'POST',
      body: JSON.stringify({ referralCode }),
    }),

  // Progress (authenticated)
  getProgress: () => request('/users/progress'),
  updateProgress: (categoryId: string, completedItems: string[]) =>
    request(`/users/progress/${categoryId}`, {
      method: 'PUT',
      body: JSON.stringify({ completedItems }),
    }),

  // Ambassadors (authenticated)
  applyAmbassador: (data: { studentEmail: string; course: string; motivation?: string }) =>
    request<AmbassadorApplication>('/ambassadors/apply', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  getAmbassadorStatus: () => request<AmbassadorApplication | null>('/ambassadors/me'),
  getAmbassadorStats: () => request<AmbassadorStats | null>('/ambassadors/stats'),
};

export interface ClickResponse {
  clickId: string;
  redirectUrl: string | null;
}

export interface AmbassadorApplication {
  id: string;
  userId: string;
  studentEmail: string;
  course: string;
  motivation?: string;
  referralCode: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
}

export interface AmbassadorStats {
  referralCode: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  totalReferrals: number;
  confirmedReferrals: number;
  totalEarnings: number;
  pendingEarnings: number;
}
