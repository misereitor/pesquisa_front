import ListCategory from '@/components/category/list-category';
import { getAllCategories } from '@/service/category-service';
import { getAllCompany } from '@/service/company-service';

export default async function Categorias() {
  const data = await getAllCategories();
  const company = await getAllCompany();
  return <ListCategory categories={data.data} company={company} />;
}
