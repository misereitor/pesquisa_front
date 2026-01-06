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
    <div>
      <div className=" bg-zinc-900 m-1 p-1 flex items-center justify-around">
        <div>
          <label className="mr-4">Linhas</label>
          <select
            name="totalPage"
            onChange={(e) => setLimit(Number(e.target.value))}
            id="totalPage"
            className="bg-zinc-950 p-1 rounded-md"
            defaultValue={limit}
          >
            <option value="50">50</option>
            <option value="100">100</option>
            <option value="200">200</option>
            <option value="500">500</option>
            <option value="1000">1000</option>
            <option value="99999">99999</option>
          </select>
        </div>
        <div>
          <Stack spacing={1}>
            <Pagination
              count={totalIndex}
              page={offset}
              onChange={pagination}
              variant="outlined"
              shape="rounded"
              sx={{
                color: 'rgb(255, 222, 94)',
                '.MuiPagination-ul button': {
                  backgroundColor: 'rgb(255, 222, 94)'
                },
                '.MuiPagination-ul .Mui-selected': {
                  backgroundColor: 'rgb(255, 180, 14)'
                },
                '.MuiPagination-ul .Mui-selected:hover': {
                  opacity: '.8'
                },
                '.MuiPagination-ul button:hover': {
                  opacity: '.8'
                },
                '.MuiPaginationItem-ellipsis': {
                  color: 'rgb(255, 222, 94)'
                }
              }}
            />
          </Stack>
        </div>

        <div>
          <Link
            href={`${apiUrl}/api/reports/download/geral?apikey=${xapikey}`}
            target="_blank"
          >
            Baixar
          </Link>
        </div>
      </div>
      {loading ? (
        <Loading />
      ) : (
        <table className="border-collapse border border-solid border-black bg-stone-700 w-[1000%]">
          <thead>
            <tr>
              <th className="border border-solid border-black p-2 w-80">
                Nome
              </th>
              <th className="border border-solid border-black p-2">Votou</th>
              <th className="border border-solid border-black p-2">
                Porcentagem
              </th>
              <th className="border border-solid border-black p-2">CPF</th>
              <th className="border border-solid border-black p-2">Telefone</th>
              <th className="border border-solid border-black p-2">País</th>
              <th className="border border-solid border-black p-2">Estado</th>
              <th className="border border-solid border-black p-2">Cidade</th>
              <th className="border border-solid border-black p-2">
                Data de cadastro
              </th>
              <th className="border border-solid border-black p-2">
                Dada do voto
              </th>
              {categories.map((category) => (
                <th
                  className="border border-solid border-black p-2"
                  key={category.id}
                >
                  {category.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {usersVote.map((user) => (
              <tr key={user.id}>
                <td className="w-80 border border-solid border-black p-2">
                  {user.name}
                </td>
                <td className="border border-solid border-black p-2 text-center">
                  {user.confirmed_vote ? 'SIM' : 'NÃO'}
                </td>
                <td className="border border-solid border-black p-2 text-center">
                  {user.percentage_vote &&
                    Number(user.percentage_vote).toFixed(0) + '%'}
                </td>
                <td className="border border-solid border-black p-2 text-center">
                  {regexCPF(user.cpf)}
                </td>
                <td className="border border-solid border-black p-2 text-center">
                  {regexPhone(user.phone)}
                </td>
                <td className="border border-solid border-black p-2 text-center">
                  {user.country}
                </td>
                <td className="border border-solid border-black p-2 text-center">
                  {user.state}
                </td>
                <td className="border border-solid border-black p-2 text-center">
                  {user.city}
                </td>
                <td className="border border-solid border-black p-2 text-center">
                  {new Date(user.date_create)
                    .toLocaleString('pt-BR', {
                      dateStyle: 'short',
                      timeStyle: 'medium'
                    })
                    .replace(',', '')}
                </td>
                <td className="border border-solid border-black p-2 text-center">
                  {new Date(user.date_vote)
                    .toLocaleString('pt-BR', {
                      dateStyle: 'short',
                      timeStyle: 'medium'
                    })
                    .replace(',', '')}
                </td>
                {categories.map((category) => (
                  <td
                    className="border border-solid border-black p-2 text-center"
                    key={category.id}
                  >
                    {user?.votes?.map((vote) => (
                      <p key={vote.id_category}>
                        {category.id === vote.id_category && vote.trade_name}
                      </p>
                    ))}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
