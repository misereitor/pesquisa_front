'use client';
import { Dispatch, SetStateAction, useState } from 'react';
import InputSimple from '../input/input';
import { FiDelete } from 'react-icons/fi';
import { Button } from '@mui/material';
import { Category } from '@/src/model/category';
import { removeCompanyFromCategory } from '@/src/service/category-service';
import { checkMasterPassword } from '@/src/service/login-user-admin';

type Props = {
  category: Category;
  setCategories: Dispatch<SetStateAction<Category[]>>;
  setOpenModal: Dispatch<SetStateAction<boolean>>;
  categories: Category[];
  id_company: number | null;
  setLoading: Dispatch<SetStateAction<boolean>>;
  setId_company: Dispatch<SetStateAction<number | null>>;
  loading: boolean;
};

export default function ModalRemoveCompanyAssociation({
  setOpenModal,
  category,
  setCategories,
  categories,
  id_company,
  setLoading,
  setId_company,
  loading
}: Props) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const handleRemove = async () => {
    try {
      setLoading(true);
      setError('');
      if (password.length === 0) return;
      if (!id_company) return;

      const data = await checkMasterPassword(password);
      if (!data.data) {
        setError('Senha invalida!');
        return;
      }

      setLoading(true);
      await removeCompanyFromCategory(category.id, id_company);
      const categoriesUpdate = categories.map((ca) => {
        if (ca.id === category.id) {
          return {
            ...ca,
            companies: ca.companies?.filter((co) => co.id !== id_company)
          };
        }
        return ca;
      });
      setCategories(categoriesUpdate);
      setId_company(null);
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
    <div className="p-6">
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          Remover Empresa da Categoria
        </h2>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          Você está prestes a desvincular uma empresa desta categoria.
        </p>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Digite sua senha mestre para confirmar
        </label>
        <InputSimple
          type="password"
          className="w-full h-11 px-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 outline-none transition-all"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Senha"
        />
        {error && (
          <p className="mt-2 text-sm text-red-600 dark:text-red-400">{error}</p>
        )}
      </div>

      <div className="flex justify-end gap-3 border-t border-gray-100 dark:border-gray-700 pt-4">
        <button
          type="button"
          onClick={() => setOpenModal(false)}
          className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors font-medium text-sm"
        >
          Cancelar
        </button>
        <Button
          data-testid="comecar"
          size="medium"
          type="button"
          endIcon={<FiDelete />}
          loading={loading}
          onClick={() => handleRemove()}
          loadingPosition="end"
          variant="contained"
          sx={{
            backgroundColor: '#dc2626', // red-600
            '&:hover': {
              backgroundColor: '#b91c1c' // red-700
            },
            textTransform: 'none',
            borderRadius: '0.5rem',
            boxShadow: 'none',
            fontWeight: 500
          }}
        >
          Remover Vínculo
        </Button>
      </div>
    </div>
  );
}
