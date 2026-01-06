import ListCategoryPesquisa from '@/components/pesquisa/list-category';
import { UserVote } from '@/src/model/user-voting';
import { getAllDataForVoteService } from '@/src/service/voting-service';
import Link from 'next/link';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function Votacao() {
  const cookieStore = await cookies();
  const userCookie = cookieStore.get('user');

  if (!userCookie) {
    redirect('/');
  }

  const user: UserVote = JSON.parse(userCookie.value);

  if (user?.confirmed_vote) {
    return (
      <div className="flex flex-col items-center justify-center">
        <h2>{user.name}, Você já participou da votação!</h2>
        <Link href="/">Clique aqui para retornar</Link>
      </div>
    );
  }

  try {
    const { categoriesData, companiesData, userVotesData, dictionaryData } =
      await getAllDataForVoteService();

    return (
      <ListCategoryPesquisa
        categories={categoriesData}
        companies={companiesData}
        userVotes={userVotesData}
        user={user}
        dictionaryFromService={dictionaryData}
      />
    );
  } catch (error) {
    console.error('Erro ao buscar os dados:', error);
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h2 className="text-xl font-bold mb-4 text-red-500">
          Erro ao carregar a votação.
        </h2>
        <p className="mb-4">Tente recarregar a página ou entre em contato.</p>
        <Link href="/" className="underline">
          Voltar para o início
        </Link>
      </div>
    );
  }
}
