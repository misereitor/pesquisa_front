import { getAllDataReportCity } from '@/src/service/reports-services';
import Link from 'next/link';

export default async function RelatorioCidade() {
  const votingCity = await getAllDataReportCity();
  const { API_URL, X_API_KEY } = process.env;

  return (
    <div className="w-full flex items-center justify-center flex-col">
      <div className="h-10 w-full pr-10 bg-zinc-900 flex items-center justify-end">
        <Link
          href={`${API_URL}/api/reports/download/city?apikey=${X_API_KEY}`}
          target="_blank"
        >
          Baixar
        </Link>
      </div>
      <table className="border-collapse border border-solid border-black bg-stone-700 w-full">
        <thead>
          <tr>
            <th className="border border-solid border-black p-2">Cidade</th>
            <th className="border border-solid border-black p-2">
              Todal de votos
            </th>
          </tr>
        </thead>
        <tbody>
          {votingCity.map((vote) => (
            <tr key={vote.city}>
              <td className="border border-solid border-black p-2">
                {vote.city}
              </td>
              <td className="border border-solid border-black p-2 text-center">
                {vote.total}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
