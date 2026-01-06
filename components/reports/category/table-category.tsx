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
    <div>
      <div className="bg-zinc-900 m-1 p-1 flex justify-between">
        <div className="flex flex-col items-center justify-center">
          <h2 className="ml-4">Filtros</h2>
          <Link
            className="ml-4"
            href={`${apiUrl}/api/reports/download/category?apikey=${xapikey}`}
            target="_blank"
          >
            Baixar
          </Link>
        </div>
        <div className="flex flex-col items-end">
          <div className="mb-2">
            <label>Categoria:</label>
            <input
              type="text"
              className="bg-[#4d4d4d] rounded-md ml-1"
              value={categoryInput}
              onChange={(e) => setCategoryInput(e.target.value)}
            />
          </div>
          <div>
            <label>Empresa:</label>
            <input
              type="text"
              className="bg-[#4d4d4d] rounded-md ml-1"
              value={companyInput}
              onChange={(e) => setCompanyInput(e.target.value)}
            />
          </div>
        </div>
      </div>
      <table className="w-full border-collapse border border-solid border-black bg-stone-700">
        <thead>
          <tr>
            <th className="border border-solid border-black p-2">Categoria</th>
            <th className="border border-solid border-black p-2">
              Total de Votos Válidos
            </th>
            <th className="border border-solid border-black p-2">Empresa</th>
            <th className="border border-solid border-black p-2">
              Quantidade de Votos
            </th>
          </tr>
        </thead>
        {listCategories.map((category) => (
          <tbody key={category.category_name}>
            <tr>
              <td className="border border-solid border-black p-2">
                {category.category_name}
              </td>
              <td className="border border-solid border-black p-2 text-center">
                {category.total}
              </td>
            </tr>
            {category.companies.map((company) => (
              <tr key={company.name}>
                <td className="border border-solid border-black p-2 text-center"></td>
                <td className="border border-solid border-black p-2 text-center"></td>
                <td className="border border-solid border-black p-2">
                  {company.name}
                </td>
                <td className="border border-solid border-black p-2 text-center">
                  {company.value}
                </td>
              </tr>
            ))}
          </tbody>
        ))}
      </table>
    </div>
  );
}
