import TablePaginationReportGeral from '@/components/reports/geral/table-pagination';
import { getAllDataReportGeral } from '@/service/reports-services';

const { API_URL, X_API_KEY } = process.env;

export default async function RelatorioGeral() {
  console.log(API_URL);
  const { categories, usersVote } = await getAllDataReportGeral();
  return (
    <TablePaginationReportGeral
      apiUrl={String(API_URL)}
      categories={categories}
      usersVote={usersVote}
      xapikey={String(X_API_KEY)}
    />
  );
}
