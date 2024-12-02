import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import {
  valideTokenUserAdminService,
  valideTokenUserVotingService
} from './service/authService';

export const config = {
  matcher: '/((?!api|static|.*\\..*|_next).*)'
};

const publicRoutes = ['/', '/admin'];
const adminRoutes = [
  '/admin/dashboard',
  '/admin/dashboard/print',
  '/admin/gerencia',
  '/admin/gerencia/categorias',
  '/admin/gerencia/empresas',
  '/admin/relatorios',
  '/admin/relatorios/categorias',
  '/admin/relatorios/cidade',
  '/admin/relatorios/geral',
  '/admin/relatorios/sorteio',
  '/admin/perfil'
];
const superadminRoutes = [
  ...adminRoutes,
  '/superadmin/perfil',
  '/superadmin/perfis'
];
const votingRoutes = ['/votacao', '/success'];

export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }
  const cookieStore = await cookies();
  const token = cookieStore.get('token');
  //superadmin routes
  try {
    const user = await valideTokenUserAdminService(token?.value);
    // Handle admin/superadmin routes
    if (user.roles.includes('superadmin')) {
      // Verifica se a rota está no escopo permitido
      if (!superadminRoutes.includes(pathname)) {
        return NextResponse.redirect(new URL('/admin', req.url)); // Redireciona para admin se rota não for permitida
      }
      return NextResponse.next();
    }

    if (user.roles.includes('admin')) {
      if (!adminRoutes.includes(pathname)) {
        return NextResponse.redirect(new URL('/admin', req.url)); // Redireciona se admin tentar acessar rota de superadmin
      }
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL('/admin', req.url));
  } catch (error) {
    try {
      if (votingRoutes.includes(pathname)) {
        await valideTokenUserVotingService(token?.value);
        return NextResponse.next();
      }
    } catch (votingError) {
      return NextResponse.redirect(new URL('/', req.url));
    }
    return NextResponse.redirect(new URL('/', req.url));
  }
}
