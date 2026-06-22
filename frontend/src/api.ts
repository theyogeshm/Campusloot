/**
 * api.ts — CampusLoot API client helper
 *
 * All API calls go through this module so the base URL is defined in one place.
 *
 * In development the Vite dev server proxies `/api/*` → `http://localhost:5000/api/*`
 * so no CORS issues occur and no hardcoded port is needed in the code.
 *
 * In production set VITE_API_BASE_URL in your .env (e.g. https://api.campusloot.com/api).
 */

// ---------------------------------------------------------------------------
// Base URL
// ---------------------------------------------------------------------------
const BASE_URL: string =
  (import.meta as any).env?.VITE_API_BASE_URL ?? '/api';

// ---------------------------------------------------------------------------
// Generic fetch wrapper
// ---------------------------------------------------------------------------

interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  token?: string;
}

async function request<T = unknown>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const url = `${BASE_URL}${endpoint}`;

  const token =
    typeof localStorage !== 'undefined'
      ? localStorage.getItem('campusloot_token')
      : null;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers ?? {}),
  };

  const res = await fetch(url, { ...options, headers });
  const json: ApiResponse<T> = await res.json();

  if (!res.ok) {
    throw new Error(json.message ?? `HTTP ${res.status}`);
  }

  return json;
}

// ---------------------------------------------------------------------------
// Auth
// ---------------------------------------------------------------------------

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload extends LoginPayload {
  name: string;
}

export interface AuthData {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  token: string;
}

export const auth = {
  /** POST /api/auth/login */
  login: (payload: LoginPayload) =>
    request<AuthData>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  /** POST /api/auth/signup */
  register: (payload: RegisterPayload) =>
    request<AuthData>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
};

// ---------------------------------------------------------------------------
// Internships
// ---------------------------------------------------------------------------

export const internships = {
  /** GET /api/internships */
  getAll: (params?: Record<string, string>) => {
    const qs = params ? '?' + new URLSearchParams(params).toString() : '';
    return request(`/internships${qs}`);
  },

  /** GET /api/internships/:id */
  getById: (id: string) => request(`/internships/${id}`),
};

// ---------------------------------------------------------------------------
// Hackathons
// ---------------------------------------------------------------------------

export const hackathons = {
  /** GET /api/hackathons */
  getAll: (params?: Record<string, string>) => {
    const qs = params ? '?' + new URLSearchParams(params).toString() : '';
    return request(`/hackathons${qs}`);
  },

  /** GET /api/hackathons/:id */
  getById: (id: string) => request(`/hackathons/${id}`),
};

// ---------------------------------------------------------------------------
// Scholarships
// ---------------------------------------------------------------------------

export const scholarships = {
  /** GET /api/scholarships */
  getAll: (params?: Record<string, string>) => {
    const qs = params ? '?' + new URLSearchParams(params).toString() : '';
    return request(`/scholarships${qs}`);
  },

  /** GET /api/scholarships/:id */
  getById: (id: string) => request(`/scholarships/${id}`),
};

// ---------------------------------------------------------------------------
// Activities
// ---------------------------------------------------------------------------

export const activities = {
  /** GET /api/activities */
  getAll: (params?: Record<string, string>) => {
    const qs = params ? '?' + new URLSearchParams(params).toString() : '';
    return request(`/activities${qs}`);
  },
};

// ---------------------------------------------------------------------------
// Opportunities
// ---------------------------------------------------------------------------

export const opportunities = {
  /** GET /api/opportunities */
  getAll: () => request('/opportunities'),
};

// ---------------------------------------------------------------------------
// User / Profile / Bookmarks
// ---------------------------------------------------------------------------

export const users = {
  /** GET /api/users/profile */
  getProfile: () => request('/users/profile'),

  /** PUT /api/users/bookmarks/:itemId  — toggle bookmark */
  toggleBookmark: (itemId: string) =>
    request(`/users/bookmarks/${itemId}`, { method: 'PUT' }),

  /** GET /api/users/bookmarks */
  getBookmarks: () => request('/users/bookmarks'),
};

export default { auth, internships, hackathons, scholarships, activities, opportunities, users };
