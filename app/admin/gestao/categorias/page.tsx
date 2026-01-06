import ListCategory from '@/components/category/list-category';
import { Category } from '@/src/model/category';
import { getAllCategories } from '@/src/service/category-service';
import { getAllCompany } from '@/src/service/company-service';

export default async function Categorias() {
  const data = await getAllCategories();
  const company = await getAllCompany();
  const categories = data.data as Category[];
  return <ListCategory categories={categories} company={company} />;
}
