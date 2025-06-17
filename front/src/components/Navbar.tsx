import Link from "next/link";
import { Button } from "./ui/button";
import { cookies } from 'next/headers';

type User = {
  id: string;
  username: string;
  email: string;
  name: string;
  createdAt: string;
};

// Función para obtener usuario desde el backend
async function getUser(): Promise<User | null> {
  try {
    const cookieStore = cookies();
    const token = (await cookieStore).get('accessToken')?.value;
    if (!token) return null;

    const res = await fetch("http://localhost:4000/api/auth/me", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) return null;

    const user = await res.json();

    return user || null;
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
}

export default async function Navbar() {
  const user = await getUser();

  return (
    <nav className="sticky top-0 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-primary font-mono tracking-wider">
              CMS
            </Link>
          </div>

          {user ? (
            <div className="flex items-center gap-2">
              <span className="text-sm">Hola, {user.name}</span>
              <Button variant="outline">Logout</Button>
            </div>
          ) : (
            <Link href="/auth">
              <Button variant="outline">Login</Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
