import { getAllDataReportPercentagem } from '@/src/service/reports-services';
import Link from 'next/link';

const { API_URL, X_API_KEY } = process.env;

export default async function RelatorioPorcentagem() {
  const usersVote = await getAllDataReportPercentagem();
  usersVote.sort((a, b) => (b.percentage_vote || 0) - (a.percentage_vote || 0));
  return (
    <div className="w-full flex items-center justify-center mt-10 flex-col">
      <div className="h-10 w-full pr-10 bg-zinc-900 flex items-center justify-end">
        <Link
          href={`${API_URL}/api/reports/download/percentage?apikey=${X_API_KEY}`}
          target="_blank"
        >
          Baixar
        </Link>
      </div>
      <table className="border-collapse border border-solid border-black bg-stone-700 w-full">
        <thead>
          <tr>
            <th className="border border-solid border-black p-2">Nome</th>
            <th className="border border-solid border-black p-2">
              Porcentagem
            </th>
          </tr>
        </thead>
        <tbody>
          {usersVote.map((user) => (
            <tr key={user.id}>
              <td className="border border-solid border-black p-2">
                {user.name}
              </td>
              <td className="border border-solid border-black p-2 text-center">
                {Number(user.percentage_vote).toFixed(0) + '%'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
