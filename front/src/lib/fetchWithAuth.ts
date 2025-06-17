import { cookies } from 'next/headers';

export async function fetchWithAuth(
  input: RequestInfo,
): Promise<Response | null> {
  const cookieStore = cookies();
  const token = (await cookieStore).get('accessToken')?.value;
  if (!token) return null;

  const res = await fetch(input, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  // realmente como devuelve !res.ok no es necesario
  // limpiar la cookie, simplemente devolvera status 401
  // el cual en el cliente se maneja

  return res;
}
