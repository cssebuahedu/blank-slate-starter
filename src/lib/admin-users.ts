import { useSyncExternalStore } from "react";
import { demoClientOrg } from "./assistant";

/** Demo user directory (in-memory only). No real accounts or emails exist. */
export const userRoles = ["Superadmin", "Admin / Customer Service", "Client"] as const;
export const userStatuses = ["Aktif", "Nonaktif", "Menunggu Verifikasi"] as const;
export type UserRole = (typeof userRoles)[number];
export type UserStatus = (typeof userStatuses)[number];
export interface AdminUser { id: string; name: string; email: string; role: UserRole; org: string; status: UserStatus; joined: string }
export type UserDraft = Omit<AdminUser, "id" | "joined">;

const initial: AdminUser[] = [
  { id: "U-001", name: "Dimas Prakoso", email: "superadmin@demo.grazu.id", role: "Superadmin", org: "GRAZU-AI", status: "Aktif", joined: "2025-01-06" },
  { id: "U-002", name: "Ayulia Ningsih", email: "operator@demo.grazu.id", role: "Admin / Customer Service", org: "GRAZU-AI", status: "Aktif", joined: "2025-02-11" },
  { id: "U-003", name: "Rizky Maulana", email: "rizky.cs@demo.grazu.id", role: "Admin / Customer Service", org: "GRAZU-AI", status: "Nonaktif", joined: "2025-03-20" },
  { id: "U-004", name: "Anisa Putri", email: "anisa.putri@demo.grazu.id", role: "Client", org: demoClientOrg, status: "Aktif", joined: "2025-04-02" },
  { id: "U-005", name: "Bagus Hartono", email: "bagus.h@demo.grazu.id", role: "Client", org: demoClientOrg, status: "Aktif", joined: "2025-04-15" },
  { id: "U-006", name: "Citra Lestari", email: "citra.l@demo.grazu.id", role: "Client", org: demoClientOrg, status: "Menunggu Verifikasi", joined: "2025-05-08" },
  { id: "U-007", name: "Hendra Wijaya", email: "hendra.w@demo.grazu.id", role: "Client", org: "Bank Nusantara Digital", status: "Aktif", joined: "2025-06-19" },
  { id: "U-008", name: "Sari Kusuma", email: "sari.k@demo.grazu.id", role: "Client", org: "Universitas Teknologi Bandung", status: "Menunggu Verifikasi", joined: "2025-07-23" },
];

let users = initial;
let seq = initial.length;
const listeners = new Set<() => void>();
const emit = (next: AdminUser[]) => { users = next; listeners.forEach((l) => l()); };
export const useAdminUsers = () => useSyncExternalStore((l) => (listeners.add(l), () => listeners.delete(l)), () => users, () => initial);
export const getAdminUsers = () => users;
export const resetAdminUsers = () => { seq = initial.length; emit(initial); };

export const adminUserActions = {
  add(d: UserDraft, joined = "2026-10-11") {
    seq += 1;
    const user: AdminUser = { ...d, name: d.name.trim(), email: d.email.trim(), org: d.org.trim(), id: `U-${String(seq).padStart(3, "0")}`, joined };
    emit([...users, user]);
    return user;
  },
  update: (id: string, d: UserDraft) => emit(users.map((u) => (u.id === id ? { ...u, ...d, name: d.name.trim(), email: d.email.trim(), org: d.org.trim() } : u))),
  setStatus: (id: string, status: UserStatus) => emit(users.map((u) => (u.id === id ? { ...u, status } : u))),
};

export function validateUser(d: UserDraft, others: AdminUser[] = []): Partial<Record<keyof UserDraft, string>> {
  const e: Partial<Record<keyof UserDraft, string>> = {};
  if (!d.name.trim()) e.name = "Nama lengkap wajib diisi.";
  if (!d.email.trim()) e.email = "Email wajib diisi.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email.trim())) e.email = "Format email tidak valid.";
  else if (others.some((u) => u.email.toLowerCase() === d.email.trim().toLowerCase())) e.email = "Email sudah digunakan pengguna lain.";
  if (!d.role) e.role = "Pilih role.";
  if (!d.org.trim()) e.org = "Organisasi wajib diisi.";
  if (!d.status) e.status = "Pilih status akun.";
  return e;
}

export const adminActivity = [
  { user: "Dimas Prakoso", action: "Mengubah role pengguna", target: "Ayulia Ningsih", time: "2026-10-11 09:42", status: "Berhasil" },
  { user: "Dimas Prakoso", action: "Menonaktifkan akun", target: "Rizky Maulana", time: "2026-10-10 16:05", status: "Berhasil" },
  { user: "Ayulia Ningsih", action: "Verifikasi organisasi", target: "Universitas Teknologi Bandung", time: "2026-10-10 11:18", status: "Menunggu" },
  { user: "Dimas Prakoso", action: "Menambahkan pengguna", target: "Sari Kusuma", time: "2026-10-09 14:30", status: "Berhasil" },
  { user: "Ayulia Ningsih", action: "Reset akses (simulasi)", target: "Hendra Wijaya", time: "2026-10-08 10:02", status: "Gagal" },
] as const;
