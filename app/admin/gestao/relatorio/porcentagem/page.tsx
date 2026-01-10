import { getAllDataReportPercentagem } from '@/src/service/reports-services';
import Link from 'next/link';

const { API_URL, X_API_KEY } = process.env;

export default async function RelatorioPorcentagem() {
  const usersVote = await getAllDataReportPercentagem();
  usersVote.sort((a, b) => (b.percentage_vote || 0) - (a.percentage_vote || 0));
  return (
    <div className="container mx-auto max-w-4xl space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Relatório de Progresso
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Porcentagem de votos concluídos por usuário
          </p>
        </div>
        <Link
          href={`${API_URL}/api/reports/download/percentage?apikey=${X_API_KEY}`}
          target="_blank"
          className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
        >
          Baixar Relatório (CSV)
        </Link>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse">
            <thead className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700 text-xs uppercase text-gray-500 dark:text-gray-400 font-semibold">
              <tr>
                <th className="py-3 px-6 w-1/2">Usuário</th>
                <th className="py-3 px-6 w-1/2">Progresso</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {usersVote.map((user) => (
                <tr
                  key={user.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                >
                  <td className="py-3 px-6 font-medium text-gray-900 dark:text-white">
                    {user.name}
                  </td>
                  <td className="py-3 px-6">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-indigo-600 dark:text-indigo-400 font-semibold w-12 text-right">
                        {Number(user.percentage_vote).toFixed(0)}%
                      </span>
                      <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-indigo-500 rounded-full transition-all duration-500"
                          style={{
                            width: `${Number(user.percentage_vote).toFixed(0)}%`
                          }}
                        ></div>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
              {usersVote.length === 0 && (
                <tr>
                  <td
                    colSpan={2}
                    className="py-8 text-center text-gray-500 dark:text-gray-400"
                  >
                    Nenhum registro encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
