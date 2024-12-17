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
  '/admin/gestao/relatorio/categoria',
  '/admin/gestao/relatorio/cidade',
  '/admin/gestao/relatorio/geral',
  '/admin/gestao/relatorio/porcentagem',
  '/admin/gestao/perfil',
  '/admin/gestao/dicionario'
];
const superadminRoutes = [...adminRoutes, '/admin/gestao/superadmin/perfis'];
const votingRoutes = ['/votacao', '/sucesso'];

export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }
  const cookieStore = await cookies();
  const token = cookieStore.get('token');
  if (!token) {
    return NextResponse.redirect(new URL('/', req.url));
  }
  try {
    const user = await valideTokenUserAdminService(token.value);
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
