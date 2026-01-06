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

  return (
    <div>
      <div className="w-full layout-page">
        <div className="h-12 border-b-2 border-collapse border-slate-800">
          <div className="w-full flex items-center justify-between">
            <div className="w-full flex items-center justify-start">
              {navigation.admin.map((menu, index) => (
                <div key={index} className="mx-2">
                  {menu.type === 'route' && (
                    <Link href={menu.path}>{menu.title}</Link>
                  )}
                  {menu.type === 'menu' && (
                    <div>
                      <div
                        className="flex cursor-pointer items-center"
                        onClick={(e) => handleClick(e, index)}
                      >
                        <span>{menu.title}</span>
                        <RxCaretDown size={22} className="ml-1" />
                      </div>

                      <Menu
                        id={`menu-${index}`}
                        MenuListProps={{
                          'aria-labelledby': `menu-button-${index}`
                        }}
                        anchorEl={menuState[index]}
                        open={Boolean(menuState[index])}
                        onClose={() => handleClose(index)}
                        disablePortal
                        disableScrollLock
                        slotProps={{
                          paper: {
                            style: {
                              maxHeight: ITEM_HEIGHT * 4,
                              width: '14ch',
                              backgroundColor: '#181818',
                              color: '#ffde5e'
                            }
                          }
                        }}
                      >
                        {menu.submenu?.map((option) => (
                          <MenuItem
                            key={option.title}
                            onClick={() => {
                              pushRouter(option.path);
                              handleClose(index);
                            }}
                            sx={{
                              '&:hover': {
                                backgroundColor: '#ffde5e', // Cor de fundo no hover
                                color: '#181818' // Cor do texto no hover
                              }
                            }}
                          >
                            {option.title}
                          </MenuItem>
                        ))}
                      </Menu>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="mr-3">
              <div>
                <button className="" onClick={handleClickProfile}>
                  <Avatar
                    sx={{
                      width: 30,
                      height: 30,
                      backgroundColor: '#FFEF5E',
                      color: '#000'
                    }}
                  />
                </button>
              </div>
              <Menu
                anchorEl={anchorEl}
                id="account-menu"
                open={open}
                onClose={handleCloseProfile}
                onClick={handleCloseProfile}
                slotProps={{
                  paper: {
                    style: {
                      maxHeight: ITEM_HEIGHT * 3,
                      width: '12ch',
                      backgroundColor: '#181818',
                      color: '#ffde5e'
                    }
                  }
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              >
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
                <Divider />
                <MenuItem
                  onClick={() => {
                    handleCloseProfile();
                    pushRouter('/admin');
                  }}
                >
                  Sair
                </MenuItem>
              </Menu>
            </div>
          </div>
        </div>
      </div>
      <div>{children}</div>
    </div>
  );
}
