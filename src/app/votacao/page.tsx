import ListCategoryPesquisa from '@/components/pesquisa/list-category';
import { UserVote } from '@/model/user-voting';
import { getAllCategories } from '@/service/category-service';
import { getAllCompany } from '@/service/company-service';
import { getAllVotesByUser } from '@/service/voting-service';
import { cookies } from 'next/headers';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function Votacao() {
  const cookieStore = await cookies();
  const userCookies = cookieStore.get('user');

  if (!userCookies) {
    return (
      <div className="flex flex-col items-center justify-center">
        <h2>Usuário não autenticado</h2>
        <Link href="/">Clique aqui para retornar</Link>
      </div>
    );
  }

  const categories = await getAllCategories();
  const companies = await getAllCompany();
  const userVotes = await getAllVotesByUser();
  const user: UserVote = JSON.parse(userCookies?.value);
  Promise.all([categories, companies, userVotes]);

  if (user.confirmed_vote) {
    return (
      <div className="flex flex-col items-center justify-center">
        <h2>{user.name}, Você já participou da votação!</h2>
        <Link href={'/'}>Clique aqui para retornar</Link>
      </div>
    );
  }

  return (
    <ListCategoryPesquisa
      categories={categories}
      companies={companies}
      userVotes={userVotes}
      user={user}
    />
  );
}
