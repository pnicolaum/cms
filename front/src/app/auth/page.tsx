"use client";

import { useState } from "react";
import { Login } from "@/components/Login";
import { Register } from "@/components/Register";

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded-xl shadow">
      <h1 className="text-2xl font-bold mb-4 text-center">
        {isLogin ? "Iniciar sesión" : "Registrarse"}
      </h1>
      {isLogin ? <Login /> : <Register />}
      <p className="text-center mt-4 text-sm">
        {isLogin ? "¿No tienes cuenta?" : "¿Ya tienes cuenta?"}{" "}
        <button
          type="button"
          className="text-primary underline"
          onClick={() => setIsLogin(!isLogin)}
        >
          {isLogin ? "Regístrate" : "Inicia sesión"}
        </button>
      </p>
    </div>
  );
}
