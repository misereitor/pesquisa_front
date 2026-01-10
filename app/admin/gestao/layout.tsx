'use client';
import Loading from '@/app/loading';
import { UserAdmin } from '@/src/model/user-admin';
import { Avatar, Divider, Menu, MenuItem } from '@mui/material';
import { getCookie } from 'cookies-next/client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { RxCaretDown } from 'react-icons/rx';

const navigation = {
  admin: [
    { title: 'Dashboard', type: 'route', path: '/admin/gestao/dashboard' },
    {
      title: 'Gerenciar',
      type: 'menu',
      path: '',
      submenu: [
        { title: 'Empresas', path: '/admin/gestao/empresas' },
        { title: 'Categorias', path: '/admin/gestao/categorias' },
        { title: 'Alterar Número', path: '/admin/gestao/alterar-numero' }
        //{ title: 'Dicionário', path: '/admin/gestao/dicionario' }
      ]
    },
    {
      title: 'Relatórios',
      type: 'menu',
      path: '',
      submenu: [
        { title: 'Geral', path: '/admin/gestao/relatorio/geral' },
        { title: 'Categorias', path: '/admin/gestao/relatorio/categoria' },
        { title: 'Cidades', path: '/admin/gestao/relatorio/cidade' },
        { title: 'Porcentagem', path: '/admin/gestao/relatorio/porcentagem' }
      ]
    }
  ]
};

const ITEM_HEIGHT = 48;

export default function LayoutAdmin({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const userCookies = getCookie('user');
  const [menuState, setMenuState] = useState<{
    [key: number]: HTMLElement | null;
  }>({});
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  if (!userCookies) return <Loading />;

  const user = JSON.parse(userCookies) as UserAdmin;
  const open = Boolean(anchorEl);

  const handleClickProfile = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseProfile = () => {
    setAnchorEl(null);
  };

  const handleClick = (event: React.MouseEvent<HTMLElement>, index: number) => {
    setMenuState((prevState) => ({
      ...prevState,
      [index]: event.currentTarget
    }));
  };

  const pushRouter = (url: string) => {
    router.push(url);
  };

  const handleClose = (index: number) => {
    setMenuState((prevState) => ({
      ...prevState,
      [index]: null
    }));
  };

  // Shared Menu Styling Props
  const menuSlotProps = {
    paper: {
      elevation: 0,
      sx: {
        overflow: 'visible',
        filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
        mt: 1.5,
        backgroundColor: '#1f2937', // gray-800
        color: '#f3f4f6', // gray-100
        border: '1px solid #374151', // gray-700
        '& .MuiMenuItem-root': {
          fontSize: '0.875rem',
          '&:hover': {
            backgroundColor: '#374151' // gray-700
          }
        }
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Left Side: Navigation */}
            <div className="flex items-center gap-6 overflow-x-auto no-scrollbar">
              {/* Optional: Add Logo here if needed */}
              <nav className="flex items-center gap-1">
                {navigation.admin.map((menu, index) => (
                  <div key={index} className="relative">
                    {menu.type === 'route' && (
                      <Link
                        href={menu.path}
                        className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white transition-colors"
                      >
                        {menu.title}
                      </Link>
                    )}
                    {menu.type === 'menu' && (
                      <>
                        <button
                          onClick={(e) => handleClick(e, index)}
                          className={`flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                            Boolean(menuState[index])
                              ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white'
                              : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
                          }`}
                        >
                          {menu.title}
                          <RxCaretDown
                            size={16}
                            className={`transition-transform duration-200 ${
                              Boolean(menuState[index]) ? 'rotate-180' : ''
                            }`}
                          />
                        </button>
                        <Menu
                          id={`menu-${index}`}
                          anchorEl={menuState[index]}
                          open={Boolean(menuState[index])}
                          onClose={() => handleClose(index)}
                          disableScrollLock
                          transformOrigin={{
                            horizontal: 'left',
                            vertical: 'top'
                          }}
                          anchorOrigin={{
                            horizontal: 'left',
                            vertical: 'bottom'
                          }}
                          slotProps={menuSlotProps}
                        >
                          {menu.submenu?.map((option) => (
                            <MenuItem
                              key={option.title}
                              onClick={() => {
                                pushRouter(option.path);
                                handleClose(index);
                              }}
                            >
                              {option.title}
                            </MenuItem>
                          ))}
                        </Menu>
                      </>
                    )}
                  </div>
                ))}
              </nav>
            </div>

            {/* Right Side: Profile */}
            <div className="flex items-center gap-4">
              <div className="hidden md:flex flex-col items-end mr-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                  {user.name || 'Usuário'}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                  {user.role}
                </span>
              </div>
              <button
                onClick={handleClickProfile}
                className="relative rounded-full ring-2 ring-transparent hover:ring-indigo-500 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-900"
              >
                <Avatar
                  sx={{
                    width: 36,
                    height: 36,
                    bgcolor: '#4F46E5', // Indigo-600
                    color: '#fff',
                    fontSize: '0.875rem',
                    fontWeight: 600
                  }}
                >
                  {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </Avatar>
              </button>
              <Menu
                anchorEl={anchorEl}
                id="account-menu"
                open={open}
                onClose={handleCloseProfile}
                onClick={handleCloseProfile}
                disableScrollLock
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                slotProps={menuSlotProps}
              >
                <div className="px-4 py-2 border-b border-gray-700 md:hidden">
                  <p className="text-sm font-medium text-white">{user.name}</p>
                  <p className="text-xs text-gray-400 capitalize">
                    {user.role}
                  </p>
                </div>
                <MenuItem
                  onClick={() => {
                    handleCloseProfile();
                    pushRouter('/admin/gestao/perfil');
                  }}
                >
                  Perfil
                </MenuItem>
                {user.role === 'superadmin' && (
                  <MenuItem
                    onClick={() => {
                      handleCloseProfile();
                      pushRouter('/admin/gestao/superadmin/perfis');
                    }}
                  >
                    Superadmin
                  </MenuItem>
                )}
                <Divider sx={{ borderColor: '#374151' }} />
                <MenuItem
                  onClick={() => {
                    handleCloseProfile();
                    pushRouter('/admin');
                  }}
                  sx={{ color: '#F87171' }} // Red-400 for logout
                >
                  Sair
                </MenuItem>
              </Menu>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        {children}
      </main>
    </div>
  );
}
