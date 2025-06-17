//logout.tsx
"use client";

import { useRouter } from "next/navigation";
import { Button } from "./ui/button";

export function Logout() {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });

    router.push("/");
  }

  return (
    <Button variant="outline" onClick={handleLogout}>
      Logout
    </Button>
  );
}
