import { Dispatch, SetStateAction, useState } from 'react';
import InputSimple from '../input/input';
import { Button } from '@mui/material';
import { CiCirclePlus } from 'react-icons/ci';
import { Category } from '@/src/model/category';
import { createCategoryService } from '@/src/service/category-service';

type Props = {
  setOpenModal: Dispatch<SetStateAction<boolean>>;
  setListCategories: Dispatch<SetStateAction<Category[]>>;
  categories: Category[];
};

export default function ModalInsertCompany({
  setOpenModal,
  categories,
  setListCategories
}: Props) {
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState('');
  const handleSubmit = async () => {
    try {
      setLoading(true);
      const newCategoryResponse = await createCategoryService(value);
      const newCategory = newCategoryResponse.data as Category;
      const updateCategory = [...categories, { ...newCategory }];
      console.log(updateCategory);
      const sortedCategory = updateCategory.sort((a, b) =>
        a.name.localeCompare(b.name)
      );
      setListCategories(sortedCategory);
      setOpenModal(false);
    } catch (error: any) {
      console.error('Error in handleSubmitForm:', error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="p-6 w-full md:w-[400px]">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
        Adicionar Categoria
      </h2>

      <div className="space-y-4">
        <InputSimple
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="w-full h-11 px-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
          label="Nome da categoria"
          placeholder="Ex: Tecnologia"
        />
      </div>

      <div className="flex justify-end gap-3 mt-8">
        <button
          onClick={() => setOpenModal(false)}
          className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors font-medium text-sm"
        >
          Cancelar
        </button>
        <Button
          data-testid="comecar"
          size="medium"
          type="button"
          endIcon={<CiCirclePlus />}
          loading={loading}
          onClick={handleSubmit}
          loadingPosition="end"
          variant="contained"
          sx={{
            backgroundColor: '#4f46e5', // indigo-600
            '&:hover': {
              backgroundColor: '#4338ca' // indigo-700
            },
            textTransform: 'none',
            borderRadius: '0.5rem',
            boxShadow: 'none',
            fontWeight: 500
          }}
        >
          Criar Categoria
        </Button>
      </div>
    </div>
  );
}
