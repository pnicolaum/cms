"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";

type User = {
  id: string;
  username: string;
  email: string;
  name: string;
  createdAt: string;
};

function Navbar() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const userData = localStorage.getItem("user");

    if (userData) {
      try {
        const parsedUser = JSON.parse(userData) as User;
        if (parsedUser && parsedUser.name) {
          setUser(parsedUser);
        }
      } catch (e) {
        console.error("User data is not valid JSON", e);
      }
    }
  }, []);

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

export default Navbar;
