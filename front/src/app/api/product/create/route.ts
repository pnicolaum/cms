// src/app/api/product/create/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from "next/cache";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const response = await fetch('http://localhost:4000/api/product/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { success: false, error: data.message || 'Error al crear el producto' }, 
        { status: response.status }
      );
    }

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
