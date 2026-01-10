'use client';
import { UserVote } from '@/src/model/user-voting';
import { CategoryReports } from '@/src/model/reports';
import { Dispatch, SetStateAction } from 'react';
import { regexCPF, regexPhone } from '@/src/util/dataProcessing';
import { Pagination, Stack } from '@mui/material';
import Link from 'next/link';
import Loading from '@/app/loading';
type Props = {
  usersVote: UserVote[];
  categories: CategoryReports[];
  apiUrl: string;
  xapikey: string;
  total: number;
  setLimit: Dispatch<SetStateAction<number>>;
  setOffset: Dispatch<SetStateAction<number>>;
  offset: number;
  loading: boolean;
  limit: number;
};
export default function TablePaginationReportGeral({
  categories,
  usersVote,
  apiUrl,
  xapikey,
  setLimit,
  setOffset,
  total,
  limit,
  offset,
  loading
}: Props) {
  const totalIndex = Math.max(1, Math.ceil(total / limit));
  const pagination = (event: React.ChangeEvent<unknown>, value: number) => {
    if (value >= 1 && value <= totalIndex) {
      setOffset(value);
    }
  };
  return (
    <div className="space-y-4">
      <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
              Mostrar
            </span>
            <select
              name="totalPage"
              onChange={(e) => setLimit(Number(e.target.value))}
              id="totalPage"
              className="bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2"
              defaultValue={limit}
            >
              <option value="50">50</option>
              <option value="100">100</option>
              <option value="200">200</option>
              <option value="500">500</option>
              <option value="1000">1000</option>
              <option value="99999">Todos</option>
            </select>
            <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
              linhas
            </span>
          </div>
        </div>

        <Stack spacing={1}>
          <Pagination
            count={totalIndex}
            page={offset}
            onChange={pagination}
            variant="outlined"
            shape="rounded"
            sx={{
              '& .MuiPaginationItem-root': {
                color: 'inherit',
                borderColor: 'rgba(156, 163, 175, 0.5)', // gray-400/50
                '&:hover': {
                  backgroundColor: 'rgba(79, 70, 229, 0.1)', // indigo-500/10
                  borderColor: '#4f46e5'
                },
                '&.Mui-selected': {
                  backgroundColor: '#4f46e5', // indigo-600
                  color: 'white',
                  borderColor: '#4f46e5',
                  '&:hover': {
                    backgroundColor: '#4338ca' // indigo-700
                  }
                }
              }
            }}
          />
        </Stack>

        <div>
          <Link
            href={`${apiUrl}/api/reports/download/geral?apikey=${xapikey}`}
            target="_blank"
            className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
          >
            Baixar Relatório
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center p-12">
          <Loading />
        </div>
      ) : (
        <div className="w-full bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left border-collapse whitespace-nowrap">
              <thead className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700 text-xs uppercase text-gray-500 dark:text-gray-400 font-semibold">
                <tr>
                  <th className="py-3 px-4 min-w-[200px]">Nome</th>
                  <th className="py-3 px-4 text-center">Votou</th>
                  <th className="py-3 px-4 text-center">% Progresso</th>
                  <th className="py-3 px-4 text-center">CPF</th>
                  <th className="py-3 px-4 text-center">Telefone</th>
                  <th className="py-3 px-4 text-center">País</th>
                  <th className="py-3 px-4 text-center">Estado</th>
                  <th className="py-3 px-4 text-center">Cidade</th>
                  <th className="py-3 px-4 text-center">Cadastro</th>
                  <th className="py-3 px-4 text-center">Voto Confirmado</th>
                  {categories.map((category) => (
                    <th
                      className="py-3 px-4 text-center min-w-[200px]"
                      key={category.id}
                    >
                      {category.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {usersVote.map((user) => (
                  <tr
                    key={user.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                  >
                    <td className="py-3 px-4 font-medium text-gray-900 dark:text-white">
                      {user.name}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                          user.confirmed_vote
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                        }`}
                      >
                        {user.confirmed_vote ? 'Sim' : 'Não'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center text-gray-600 dark:text-gray-300">
                      {user.percentage_vote
                        ? `${Number(user.percentage_vote).toFixed(0)}%`
                        : '0%'}
                    </td>
                    <td className="py-3 px-4 text-center font-mono text-gray-600 dark:text-gray-400">
                      {regexCPF(user.cpf)}
                    </td>
                    <td className="py-3 px-4 text-center font-mono text-gray-600 dark:text-gray-400">
                      {regexPhone(user.phone)}
                    </td>
                    <td className="py-3 px-4 text-center text-gray-600 dark:text-gray-400">
                      {user.country}
                    </td>
                    <td className="py-3 px-4 text-center text-gray-600 dark:text-gray-400">
                      {user.state}
                    </td>
                    <td className="py-3 px-4 text-center text-gray-600 dark:text-gray-400">
                      {user.city}
                    </td>
                    <td className="py-3 px-4 text-center text-gray-600 dark:text-gray-400">
                      {new Date(user.date_create).toLocaleDateString('pt-BR')}
                      <span className="block text-xs text-gray-400">
                        {new Date(user.date_create).toLocaleTimeString('pt-BR')}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center text-gray-600 dark:text-gray-400">
                      {user.date_vote ? (
                        <>
                          {new Date(user.date_vote).toLocaleDateString('pt-BR')}
                          <span className="block text-xs text-gray-400">
                            {new Date(user.date_vote).toLocaleTimeString(
                              'pt-BR'
                            )}
                          </span>
                        </>
                      ) : (
                        '-'
                      )}
                    </td>
                    {categories.map((category) => (
                      <td
                        className="py-3 px-4 text-center text-xs text-gray-600 dark:text-gray-400"
                        key={category.id}
                      >
                        {user?.votes
                          ?.filter((v) => v.id_category === category.id)
                          .map((v) => v.trade_name)
                          .join(', ') || '-'}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
