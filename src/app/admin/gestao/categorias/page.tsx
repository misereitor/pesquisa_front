import ListCategory from '@/components/category/list-category';
import { getAllCategories } from '@/service/category-service';

export default async function Categorias() {
  const categories = await getAllCategories();
  return <ListCategory categories={categories} />;
}
