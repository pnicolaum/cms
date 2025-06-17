//logout.tsx
"use client";

import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
// import { redirect } from "next/navigation";

export function Logout() {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.refresh();
    window.location.href = "/";
  }

  return (
    <Button variant="outline" onClick={handleLogout}>
      Logout
    </Button>
  );
}
