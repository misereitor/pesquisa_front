import TableCategoryReport from '@/components/reports/category/table-category';
import { getAllDataReportCategory } from '@/src/service/reports-services';

const { API_URL, X_API_KEY } = process.env;

export default async function RelatorioCategoria() {
  const categories = await getAllDataReportCategory();
  return (
    <TableCategoryReport
      apiUrl={String(API_URL)}
      xapikey={String(X_API_KEY)}
      categories={categories}
    />
  );
}
