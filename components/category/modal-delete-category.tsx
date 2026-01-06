'use client';
import { Dispatch, SetStateAction, useState } from 'react';
import InputSimple from '../input/input';
import { checkMasterPassword } from '@/src/service/login-user-admin';
import { Category } from '@/src/model/category';
import { deleteCategoryService } from '@/src/service/category-service';
import { FiDelete } from 'react-icons/fi';
import { Button } from '@mui/material'

type Props = {
  setOpenModal: Dispatch<SetStateAction<boolean>>;
  categoryRemove: Category | null;
  setCategoryList: Dispatch<SetStateAction<Category[]>>;
  categories: Category[];
};

export default function ModalDeleteCategory({
  setOpenModal,
  categoryRemove,
  setCategoryList,
  categories
}: Props) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const handleRemove = async () => {
    try {
      setLoading(true);
      setError('');
      if (password.length === 0) return;
      if (!categoryRemove) return;

      const data = await checkMasterPassword(password);
      if (!data.data) {
        setError('Senha invalida!');
        return;
      }

      await deleteCategoryService(categoryRemove.id);
      const categoryFilter = categories.filter(
        (c) => c.id != categoryRemove.id
      );
      setCategoryList(categoryFilter);
      setOpenModal(false);
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
    <div>
      <div>
        <h1 className="font-bold text-2xl">{categoryRemove?.name}</h1>
      </div>
      <div>Digite sua senha para remover a categoria!</div>
      <div className="flex justify-between mt-5">
        <InputSimple
          type="password"
          className="rounded-lg w-80 h-7"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <div className="-mt-6 h-6">
        {error && <span className="text-red-700">{error}</span>}
      </div>
      <div className="flex items-center justify-between mt-3">
        <Button
          data-testid="comecar"
          size="medium"
          color="success"
          type="button"
          endIcon={<FiDelete />}
          loading={loading}
          onClick={() => handleRemove()}
          loadingPosition="end"
          variant="contained"
          sx={{
            color: '#ffffff',
            backgroundColor: '#c2410c !important',
            '&.Mui-disabled': {
              color: '#b91c1c',
              backgroundColor: '#fdba74 !important'
            }
          }}
        >
          <span>Deletar</span>
        </Button>

        <button
          type="button"
          className="bg-yellow-500  w-24 h-10 rounded-md text-yellow-950"
          onClick={() => {
            setOpenModal(false);
          }}
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}
