import type { User } from "@/types";
import { currentUser } from "./seed";

/**
 * The workspace roster.
 *
 * Fictional people only. Everything the Projects experience shows about a
 * person — avatar color, presence, role — resolves from here by id, so a name
 * or status is edited in exactly one place.
 */
export const people: User[] = [
  currentUser,
  {
    id: "u_ada",
    name: "Ada Reyes",
    email: "ada@northwind.studio",
    role: "Staff Engineer",
    initials: "AR",
    status: "online",
    hue: "indigo",
  },
  {
    id: "u_priya",
    name: "Priya Nair",
    email: "priya@northwind.studio",
    role: "Backend Engineer",
    initials: "PN",
    status: "busy",
    hue: "emerald",
  },
  {
    id: "u_theo",
    name: "Theo Lindqvist",
    email: "theo@northwind.studio",
    role: "Growth Lead",
    initials: "TL",
    status: "away",
    hue: "amber",
  },
  {
    id: "u_ines",
    name: "Ines Duarte",
    email: "ines@northwind.studio",
    role: "Product Designer",
    initials: "ID",
    status: "online",
    hue: "rose",
  },
  {
    id: "u_marcus",
    name: "Marcus Bell",
    email: "marcus@northwind.studio",
    role: "User Researcher",
    initials: "MB",
    status: "offline",
    hue: "sky",
  },
  {
    id: "u_noah",
    name: "Noah Alvarez",
    email: "noah@northwind.studio",
    role: "iOS Engineer",
    initials: "NA",
    status: "online",
    hue: "slate",
  },
  {
    id: "u_lena",
    name: "Lena Fischer",
    email: "lena@northwind.studio",
    role: "Design Systems",
    initials: "LF",
    status: "away",
    hue: "indigo",
  },
];

const byId = new Map(people.map((person) => [person.id, person]));

/** Resolve a user by id. Returns `undefined` for system/AI actors. */
export function getPerson(id?: string): User | undefined {
  return id ? byId.get(id) : undefined;
}

/** Resolve many ids to users, preserving order and dropping unknowns. */
export function getPeople(ids: string[]): User[] {
  return ids.map((id) => byId.get(id)).filter((p): p is User => Boolean(p));
}
