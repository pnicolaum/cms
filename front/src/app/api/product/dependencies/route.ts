// src/app/api/product/dependencies/route.ts
import { NextResponse } from 'next/server';
import { revalidatePath } from "next/cache";

export async function GET() {
  try {
    console.log("Fetching product dependencies...");
    const response = await fetch('http://localhost:4000/api/product/dependencies', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
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
      data
    }, { status: 200 });
  } catch (error: any) {

    return NextResponse.json(
      { success: false, error: error.message || 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
