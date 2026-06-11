import { NextResponse, type NextRequest } from 'next/server'

// TEMP: proxy simplificado para diagnóstico
export async function proxy(_request: NextRequest) {
  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
