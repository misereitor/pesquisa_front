import ProgressQuest from '@/components/pesquisa/progress-voting';
import { UserVote } from '@/src/model/user-voting';
import { cookies } from 'next/headers';
import Image from 'next/image';
import Link from 'next/link';
import Layout2 from './layoutWhite';

export default async function Sucesso() {
  const cookieStore = await cookies();
  const userCookies = cookieStore.get('user');
  if (!userCookies) return (location.href = '/');
  const user: UserVote = JSON.parse(userCookies.value);

  return (
    <div className="flex justify-center text-center">
      <div>
        <div className="mt-20 max-w-[500px]">
          <h2>
            Obrigado por contribuir com a votação para eleger as <br />{' '}
            <b>MELHORES EMPRESAS DE 2025.</b>
          </h2>
        </div>
        <div className="w-full flex justify-center mt-14">
          <h2 className="font-bold text-center">
            Prêmio oficial do Comércio mais barato da Bahia
          </h2>
        </div>
        <div className="mt-10">
          <div>
            <h2>Acompanhe os resultados pelas redes.</h2>
            <div className="flex justify-between mx-auto mt-4 max-w-28">
              <Link
                href={'https://www.instagram.com/melhoresdoanosaj/'}
                target="_blank"
              >
                <Image
                  src={'/instagram.png'}
                  width={45}
                  height={45}
                  alt="Instagrem"
                  style={{ width: 'auto', height: '35px' }}
                />
              </Link>
              <Link
                href={'https://espacoempresarialsaj.com.br/'}
                target="_blank"
              >
                <Image
                  src={'/web.png'}
                  width={45}
                  height={45}
                  alt="site"
                  style={{ width: 'auto', height: '35px' }}
                />
              </Link>
            </div>
          </div>
        </div>
        <div className="mt-20">
          <Layout2 />
        </div>
        <div className="flex justify-center">
          <footer className="bottom-8 mt-20 b-0 w-[95%] relative">
            {Number(user?.percentage_vote) >= 70 ? (
              <span>Você está concorrendo ao sorteio!</span>
            ) : (
              <span>Você não está concorrendo ao sorteio!</span>
            )}
            <ProgressQuest progress={Number(user?.percentage_vote)} />
          </footer>
        </div>
      </div>
    </div>
  );
}
