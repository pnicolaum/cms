"use client";

import { useEffect, useState } from "react";
import { User } from '@/types/index';
import { Carousel } from '@/components/product';

export default function Home() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      try {
        const parsed: User = JSON.parse(stored);
        const isExpired = new Date() > new Date(parsed.tokenExpiresAt);
        
        if (!isExpired) {
          setUser(parsed);
        } else {
          localStorage.removeItem("user"); 
        }
      } catch (err) {
        console.error("Error parsing user from localStorage:", err);
      }
    }
  }, []);

  return (
    <>
    <h1>
      Hello - Project CMS {user ? user.name : 'Guest'}
    </h1>
    <br />
    <br />
    
    <Carousel/>
    </>
  );
}
