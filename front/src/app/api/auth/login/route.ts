// src/app/api/auth/login/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { revalidatePath } from "next/cache";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const response = await fetch('http://localhost:4000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { success: false, error: data.message || 'Error al iniciar sesión' }, 
        { status: response.status }
      );
    }

    (await cookies()).set("accessToken", data.token, {
      httpOnly: true,
      secure: true,
      maxAge: 7 * 24 * 60 * 60,
      sameSite: "strict"
    });
    
    revalidatePath("/");
    
    return NextResponse.json({
      success: true,
      user: data.user,
    }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
