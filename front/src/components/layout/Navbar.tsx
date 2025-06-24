import Link from "next/link";
import { Button } from "../ui/button";
import { Logout } from "@/components/auth";
import { fetchWithAuth } from '@/lib/fetchWithAuth';
import { User } from '@/types/index';

async function getUser(): Promise<User | null> {
  try {
    const res = await fetchWithAuth('http://localhost:4000/api/auth/me');
    if (!res || !res.ok) return null;

    const user = await res.json();
    return user;
    
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
          <div className="flex items-center gap-3">
            <Link href="/admin" className="text-xl font-bold text-primary font-mono tracking-wider">
              Admin
            </Link>
            <Link href="/shop" className="text-xl font-bold text-primary font-mono tracking-wider">
              Shop
            </Link>
          </div>

          {user ? (
            <div className="flex items-center gap-2">
              <span className="text-sm">Hola, {user.name}</span>
              <Logout/>
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
