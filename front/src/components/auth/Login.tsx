"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";

interface LoginFormData {
  email: string;
  password: string;
}

export default function Login() {
  const [form, setForm] = useState<LoginFormData>({
    email: "",
    password: "",
  });

  const router = useRouter();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        alert(data.error || "Credenciales incorrectas");
        return;
      }

      const expirationDate = new Date();
      expirationDate.setSeconds(expirationDate.getSeconds() + 604800);

      localStorage.setItem("user", JSON.stringify({
        ...data.user,
        tokenExpiresAt: expirationDate.toISOString(), // Guardamos la fecha exacta en formato ISO
      }));
      router.refresh();
      window.location.href = "/";
    } catch (error) {
      alert("Algo salió mal, intenta de nuevo");
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="email" className="mb-2">Correo electrónico</Label>
        <Input
          id="email"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <Label htmlFor="password" className="mb-2">Contraseña</Label>
        <Input
          id="password"
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          required
        />
      </div>
      <Button type="submit" className="w-full">
        Iniciar sesión
      </Button>
    </form>
  );
}
