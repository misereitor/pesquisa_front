import { Category } from '@/src/model/category';
import { Dispatch, SetStateAction, useState } from 'react';
import InputSimple from '../input/input';
import { updateCategoryService } from '@/src/service/category-service';
import { RxUpdate } from 'react-icons/rx';
import { Button } from '@mui/material'

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
        <Button
          data-testid="comecar"
          size="medium"
          color="success"
          type="button"
          endIcon={<RxUpdate />}
          loading={loading}
          loadingPosition="end"
          onClick={handleEditCategory}
          variant="contained"
          sx={{
            color: '#7f5d00',
            backgroundColor: '#ffe45f !important',
            '&.Mui-disabled': {
              color: '#7f5d00',
              backgroundColor: '#fdf6d0 !important'
            }
          }}
        >
          <span>Alterar</span>
        </Button>
      </div>
    </div>
  );
}
