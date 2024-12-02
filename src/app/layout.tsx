import type { Metadata } from 'next';
import './globals.css';
import { Inter } from 'next/font/google';
import Layout from '../components/layout/layout';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Acesaj - Melhores do ano',
  description: 'Pesquisa melhores do ano',
  icons: {
    icon: '/favicon.ico'
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <Layout>{children}</Layout>
      </body>
    </html>
  );
}
