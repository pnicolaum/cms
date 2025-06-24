//logout.tsx
"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
// import { redirect } from "next/navigation";

export function Logout() {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    localStorage.removeItem("user");
    router.refresh();
    window.location.href = "/";
  }

  return (
    <Button variant="outline" onClick={handleLogout}>
      Logout
    </Button>
  );
}

export default Logout;