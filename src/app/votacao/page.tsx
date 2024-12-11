import ListCategoryPesquisa from '@/components/pesquisa/list-category';
import { getAllCategories } from '@/service/category-service';
import { getAllCompany } from '@/service/company-service';
//import Link from 'next/link';

export default async function Votacao() {
  const categories = await getAllCategories();
  const companies = await getAllCompany();
  Promise.all([categories, companies]);

  // if (user.confirmed_vote) {
  //   return (
  //     <div className="flex flex-col items-center justify-center">
  //       <h2>{user.name}, Você já participou da votação!</h2>
  //       <Link href={'/'}>Clique aqui para retornar</Link>
  //     </div>
  //   );
  // }

  return <ListCategoryPesquisa categories={categories} companies={companies} />;
}
