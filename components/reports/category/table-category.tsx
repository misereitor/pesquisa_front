'use client';

import { CategoryVotes } from '@/src/model/reports';
import Link from 'next/link';
import { useEffect, useState } from 'react';

type Props = {
  categories: CategoryVotes[];
  apiUrl: string;
  xapikey: string;
};
export default function TableCategoryReport({
  categories,
  apiUrl,
  xapikey
}: Props) {
  const [categoryInput, setCategoryInput] = useState('');
  const [companyInput, setCompanyInput] = useState('');
  const [listCategories, setListCategories] = useState(categories);

  useEffect(() => {
    // Filtro das categorias
    const filteredCategories = categories.filter((category) => {
      const categoryMatches = category.category_name
        .toLowerCase()
        .includes(categoryInput.toLowerCase());

      const companyMatches = category.companies.some((company) =>
        company.name.toLowerCase().includes(companyInput.toLowerCase())
      );

      // Retorna categorias que atendam ambas condições
      return (
        (!categoryInput || categoryMatches) && (!companyInput || companyMatches)
      );
    });

    setListCategories(filteredCategories);
  }, [categoryInput, companyInput, categories]);

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col md:flex-row items-end justify-between gap-4">
        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
          <div className="flex flex-col gap-1 w-full md:w-64">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Filtrar por Categoria
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              placeholder="Digite o nome..."
              value={categoryInput}
              onChange={(e) => setCategoryInput(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1 w-full md:w-64">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Filtrar por Empresa
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              placeholder="Digite o nome..."
              value={companyInput}
              onChange={(e) => setCompanyInput(e.target.value)}
            />
          </div>
        </div>

        <Link
          href={`${apiUrl}/api/reports/download/category?apikey=${xapikey}`}
          target="_blank"
          className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors w-full md:w-auto h-[42px]"
        >
          Baixar Relatório
        </Link>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse">
            <thead className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700 text-xs uppercase text-gray-500 dark:text-gray-400 font-semibold">
              <tr>
                <th className="py-3 px-6 w-1/3">Categoria / Empresa</th>
                <th className="py-3 px-6 text-center w-32">Votos Totais</th>
                <th className="py-3 px-6 text-right w-32">Votos Empresa</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {listCategories.map((category) => (
                <>
                  <tr
                    key={`cat-${category.category_name}`}
                    className="bg-gray-50/50 dark:bg-gray-800/50"
                  >
                    <td className="py-3 px-6 font-bold text-indigo-600 dark:text-indigo-400">
                      {category.category_name}
                    </td>
                    <td className="py-3 px-6 text-center font-bold text-gray-900 dark:text-white">
                      {category.total}
                    </td>
                    <td className="py-3 px-6"></td>
                  </tr>
                  {category.companies.map((company) => (
                    <tr
                      key={`comp-${company.name}`}
                      className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors"
                    >
                      <td className="py-2 px-6 pl-12 text-gray-600 dark:text-gray-300 relative">
                        <span className="absolute left-8 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-600"></span>
                        {company.name}
                      </td>
                      <td className="py-2 px-6"></td>
                      <td className="py-2 px-6 text-right font-mono text-gray-700 dark:text-gray-300">
                        {company.value}
                      </td>
                    </tr>
                  ))}
                </>
              ))}
            </tbody>
          </table>
          {listCategories.length === 0 && (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              Nenhuma categoria encontrada com os filtros atuais.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
