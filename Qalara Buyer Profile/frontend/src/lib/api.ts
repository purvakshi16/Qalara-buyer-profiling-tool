import { supabase } from "./supabase";
import type { Buyer, BuyerSeed } from "./types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080";

async function authHeaders() {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  if (!token) {
    throw new Error("You need to sign in again.");
  }
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json"
  };
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      ...(await authHeaders()),
      ...options.headers
    }
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "Request failed." }));
    throw new Error(error.message ?? "Request failed.");
  }

  if (response.status === 204) {
    return undefined as T;
  }
  return response.json();
}

export const api = {
  enrichBuyer: (payload: BuyerSeed) => request<Buyer>("/api/buyers/enrich", {
    method: "POST",
    body: JSON.stringify(payload)
  }),
  listBuyers: () => request<Buyer[]>("/api/buyers"),
  getBuyer: (id: string) => request<Buyer>(`/api/buyers/${id}`),
  createBuyer: (payload: Buyer) => request<Buyer>("/api/buyers", {
    method: "POST",
    body: JSON.stringify(payload)
  }),
  updateBuyer: (id: string, payload: Buyer) => request<Buyer>(`/api/buyers/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload)
  }),
  deleteBuyer: (id: string) => request<void>(`/api/buyers/${id}`, {
    method: "DELETE"
  })
};
