// src/app/api/auth/register/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const response = await fetch('http://localhost:4000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { success: false, error: data.message || 'Error en el registro' },
        { status: response.status }
      );
    }

    (await cookies()).set("accessToken", data.token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60,
      sameSite: "strict"
    });

    return NextResponse.json({
      success: true,
      data: {
        user: data.user,
        token: data.token,
      }
    }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
