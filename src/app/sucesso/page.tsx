import ProgressQuest from '@/components/pesquisa/progress-voting';
import { UserVote } from '@/model/user-voting';
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
        <div className="mt-10 max-w-[500px]">
          <h2>
            Parabéns <b className="capitalize">{user?.name}</b>, obrigado por
            contribuir com a votação para{' '}
            <b>ELEGER AS MELHORES EMPRESAS DE 2024.</b>
          </h2>
        </div>
        <div className="mt-10 max-w-[500px] w-4/5 mx-auto">
          {Number(user.percentage_vote) >= 70 && (
            <h2>
              <b>Importante!</b> Você está concorrendo à uma Smart TV 50{'" '}
              por ter respondido mais de 70% da pesquisa.
            </h2>
          )}
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
        <div className="mt-8">
          <Layout2 />
        </div>
        <div className="flex justify-center">
          <footer className="absolute bottom-8 w-4/5">
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
