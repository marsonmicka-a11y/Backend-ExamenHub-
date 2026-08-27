export type UserRole = "admin" | "student";

export interface User {
  id: number;
  email: string;
  password_hash: string;
  role: UserRole;
  full_name: string;
  active: boolean;
  created_at: Date;
}

// Version sans password_hash, sûre à renvoyer au client.
export interface PublicUser {
  id: number;
  email: string;
  role: UserRole;
  full_name: string;
  active: boolean;
  created_at: Date;
}

export function toPublicUser(u: User): PublicUser {
  return {
    id: u.id,
    email: u.email,
    role: u.role,
    full_name: u.full_name,
    active: u.active,
    created_at: u.created_at,
  };
}
