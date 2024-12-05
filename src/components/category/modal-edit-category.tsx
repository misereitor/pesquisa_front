import { Category } from '@/model/category';
import { Dispatch, SetStateAction, useState } from 'react';
import InputSimple from '../input/input';
import LoadingButton from '../button/loading-button';
import { updateCategoryService } from '@/service/category-service';

type Props = {
  category: Category;
  categories: Category[];
  setCategories: Dispatch<SetStateAction<Category[]>>;
  setOpenModalEdit: Dispatch<SetStateAction<boolean>>;
};
export default function ModalEditCategory({
  categories,
  category,
  setCategories,
  setOpenModalEdit
}: Props) {
  const [inputValue, setInputValue] = useState(category.name);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleEditCategory = async () => {
    try {
      if (inputValue.length === 0)
        return setError('A categoria não pode está vazio');
      setLoading(true);
      category.companies = [];
      category.name = inputValue;
      await updateCategoryService(category);
      const updateCategory = categories.map((ca) => {
        if (ca.id === category.id) {
          ca.name = inputValue;
          return ca;
        }
        return ca;
      });
      setCategories(updateCategory);
      setOpenModalEdit(false);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="w-72">
      <div>
        <InputSimple
          label="Nome da categoria:"
          value={inputValue}
          errortext={error}
          onChange={(e) => setInputValue(e.target.value)}
          className="rounded-lg w-full h-7 capitalize"
        />
      </div>
      <div className="flex justify-between items-center mt-2">
        <button onClick={() => setOpenModalEdit(false)}>Cancelar</button>
        <LoadingButton loading={loading} onClick={handleEditCategory}>
          Alterar
        </LoadingButton>
      </div>
    </div>
  );
}
