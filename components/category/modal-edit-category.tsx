import { Category } from '@/src/model/category';
import { Dispatch, SetStateAction, useState } from 'react';
import InputSimple from '../input/input';
import { updateCategoryService } from '@/src/service/category-service';
import { RxUpdate } from 'react-icons/rx';
import { Button } from '@mui/material';

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
      console.error('Error in handleSubmitForm:', error);

      if (error.name === 'Error') {
        // Caso o backend tenha retornado uma mensagem de erro específica
        setError(error.message);
      } else {
        // Erro genérico (ex.: problemas de rede)
        setError('Ocorreu um erro inesperado. Tente novamente mais tarde.');
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="p-6 w-full md:w-[400px]">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
        Editar Categoria
      </h2>

      <div className="space-y-4">
        <div>
          <InputSimple
            label="Nome da categoria"
            value={inputValue}
            errortext={error}
            onChange={(e) => setInputValue(e.target.value)}
            className="w-full h-11 px-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all capitalize"
          />
        </div>
      </div>

      <div className="flex justify-end gap-3 mt-8">
        <button
          onClick={() => setOpenModalEdit(false)}
          className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors font-medium text-sm"
        >
          Cancelar
        </button>
        <Button
          data-testid="comecar"
          size="medium"
          type="button"
          endIcon={<RxUpdate />}
          loading={loading}
          loadingPosition="end"
          onClick={handleEditCategory}
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
          Salvar Alterações
        </Button>
      </div>
    </div>
  );
}
