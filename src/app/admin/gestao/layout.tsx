'use client';
import { Menu, MenuItem } from '@mui/material';
import Link from 'next/link';
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
        { title: 'Categorias', path: '/admin/gestao/categorias' }
      ]
    },
    {
      title: 'Relatórios',
      type: 'menu',
      path: '',
      submenu: [
        { title: 'Categorias', path: '/admin/gestao/relatorio/categoria' },
        { title: 'Cidades', path: '/admin/gestao/relatorio/cidade' },
        { title: 'Porcentagem', path: '/admin/gestao/relatorio/porcentagem' },
        { title: 'Geral', path: '/admin/gestao/relatorio/geral' }
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
  const [menuState, setMenuState] = useState<{
    [key: number]: HTMLElement | null;
  }>({});

  const handleClick = (event: React.MouseEvent<HTMLElement>, index: number) => {
    setMenuState((prevState) => ({
      ...prevState,
      [index]: event.currentTarget
    }));
  };

  const handleClose = (index: number) => {
    setMenuState((prevState) => ({
      ...prevState,
      [index]: null
    }));
  };

  return (
    <div>
      <div className="w-full">
        <div className="h-10 border-b-2 border-collapse border-slate-800">
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
                              width: '12ch',
                              backgroundColor: '#181818',
                              color: '#ffde5e'
                            }
                          }
                        }}
                      >
                        {menu.submenu?.map((option) => (
                          <MenuItem
                            key={option.title}
                            onClick={() => handleClose(index)}
                            sx={{
                              '&:hover': {
                                backgroundColor: '#ffde5e', // Cor de fundo no hover
                                color: '#181818' // Cor do texto no hover
                              }
                            }}
                          >
                            <Link href={option.path}>{option.title}</Link>
                          </MenuItem>
                        ))}
                      </Menu>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div>{children}</div>
    </div>
  );
}
