import { User } from "../types/user";

const users: User[] = [
  {
    id: "1",
    email: "admin@test.com",
    password: "password123",
  },
];

export function authenticate(email: string, password: string): User | null {
  const user = users.find(
    (u) => u.email === email && u.password === password
  );
  return user || null;
}
