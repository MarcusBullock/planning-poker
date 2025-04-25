import { Database } from "./supabase";

// User
export type UserInsert = Database["public"]["Tables"]["User"]["Insert"];
export type UserRow = Database["public"]["Tables"]["User"]["Row"];

// Session
export type SessionInsert = Database["public"]["Tables"]["Session"]["Insert"];
export type SessionRow = Database["public"]["Tables"]["Session"]["Row"];

// Session User
export type SessionUserInsert =
  Database["public"]["Tables"]["SessionUser"]["Insert"];
export type SessionUserRow = Database["public"]["Tables"]["SessionUser"]["Row"];
