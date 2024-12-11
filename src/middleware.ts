import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import {
  valideTokenUserAdminService,
  valideTokenUserVotingService
} from './service/auth-service';

export const config = {
  matcher: '/((?!api|static|.*\\..*|_next).*)'
};

const publicRoutes = ['/', '/admin'];
const adminRoutes = [
  '/admin/gestao/dashboard',
  '/admin/gestao/dashboard/print',
  '/admin/gestao/categorias',
  '/admin/gestao/empresas',
  '/admin/gestao/relatorios',
  '/admin/gestao/relatorios/categorias',
  '/admin/gestao/relatorios/cidade',
  '/admin/gestao/relatorios/geral',
  '/admin/gestao/relatorios/sorteio',
  '/admin/gestao/perfil'
];
const superadminRoutes = [
  ...adminRoutes,
  '/superadmin/perfil',
  '/superadmin/perfis'
];
const votingRoutes = ['/votacao', '/sucesso'];

export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }
  const cookieStore = await cookies();
  const token = cookieStore.get('token');
  try {
    const user = await valideTokenUserAdminService(token?.value);
    console.log(user);
    if (user.roles.includes('superadmin')) {
      if (!superadminRoutes.includes(pathname)) {
        return NextResponse.redirect(new URL('/admin', req.url));
      }
      return NextResponse.next();
    }

    if (user.roles.includes('admin')) {
      if (!adminRoutes.includes(pathname)) {
        return NextResponse.redirect(new URL('/admin', req.url));
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
    if (pathname.split('/')[1] === 'admin') {
      return NextResponse.redirect(new URL('/admin', req.url));
    }
    return NextResponse.redirect(new URL('/', req.url));
  }
}
