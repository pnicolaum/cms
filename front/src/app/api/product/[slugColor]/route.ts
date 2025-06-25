// src/app/api/getBySlugAndColor/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from "next/cache";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ slugColor: string }> }
) {  
  const { slugColor } = await context.params; 
  const [slug, color] = slugColor.split('-');

  if (!slug || !color) {
    return NextResponse.json(
      { success: false, error: "Faltan parámetros 'slug' o 'color'" },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(`http://localhost:4000/api/product/${slug}-${color}`, {
      method: 'GET',
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { success: false, error: data.message || 'Error al obtener producto' },
        { status: response.status }
      );
    }

    revalidatePath("/");

    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
