// src/app/api/auth/login/route.ts
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { revalidatePath } from "next/cache";

export async function POST() {
  try {

    (await cookies()).delete('accessToken');
    revalidatePath("/");
    
    return NextResponse.json({
      success: true,
    }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
