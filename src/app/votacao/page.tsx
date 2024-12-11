'use client'; // Indicando que essa página deve ser renderizada no cliente

import { useState, useEffect } from 'react';
import ListCategoryPesquisa from '@/components/pesquisa/list-category';
import { UserVote } from '@/model/user-voting';
import { getAllCategories } from '@/service/category-service';
import { getAllCompany } from '@/service/company-service';
import { getAllVotesByUser } from '@/service/voting-service';
import Link from 'next/link';
import { Category } from '@/model/category';
import { Company } from '@/model/company';
import { Vote } from '@/model/votes';
import Loading from '../loading';

export default function Votacao() {
  const [user, setUser] = useState<UserVote | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [userVotes, setUserVotes] = useState<Vote[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const userCookies = document.cookie
        .split('; ')
        .find((row) => row.startsWith('user='))
        ?.split('=')[1];

      if (!userCookies) {
        window.location.href = '/';
        return;
      }

      const userData: UserVote = JSON.parse(decodeURIComponent(userCookies));

      const categoriesData = await getAllCategories();
      const userVotesData = await getAllVotesByUser();
      const companiesData = await getAllCompany();

      console.log(categoriesData);
      console.log(companiesData);
      console.log(userVotesData);
      console.log(userData);

      setUser(userData);
      setCategories(categoriesData);
      setCompanies(companiesData);
      setUserVotes(userVotesData);
      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading) {
    return <Loading />;
  }

  // if (user?.confirmed_vote) {
  //   return (
  //     <div className="flex flex-col items-center justify-center">
  //       <h2>{user.name}, Você já participou da votação!</h2>
  //       <Link href="/">Clique aqui para retornar</Link>
  //     </div>
  //   );
  // }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center">
        <h2>Usuário não autenticado</h2>
        <Link href="/">Clique aqui para retornar</Link>
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
