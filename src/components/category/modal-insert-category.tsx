import { Dispatch, SetStateAction, useState } from 'react';
import InputSimple from '../input/input';
import { Category } from '@/model/category';
import { createCategoryService } from '@/service/category-service';
import { LoadingButton } from '@mui/lab';
import { CiCirclePlus } from 'react-icons/ci';

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
      const newCategory = await createCategoryService(value);

      const updateCategory = [...categories, { ...newCategory.data }];
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
    <div>
      <div>
        <h2 className="font-bold text-lg">Adicionar Categoria</h2>
      </div>
      <div className="mt-5">
        <InputSimple
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="w-72 h-10 rounded-md"
          label="Nome da categoria:"
        />
      </div>
      <div className="flex justify-between">
        <button onClick={() => setOpenModal(false)}>Cancelar</button>
        <LoadingButton
          data-testid="comecar"
          size="medium"
          color="success"
          type="button"
          endIcon={<CiCirclePlus />}
          loading={loading}
          onClick={handleSubmit}
          loadingPosition="end"
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
          <span>Criar</span>
        </LoadingButton>
      </div>
    </div>
  );
}
