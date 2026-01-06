'use client';
import { Dispatch, SetStateAction, useState } from 'react';
import InputSimple from '../input/input';
import { Company } from '@/src/model/company';
import { checkMasterPassword } from '@/src/service/login-user-admin';
import { deleteCompany } from '@/src/service/company-service';
import { Button } from '@mui/material'
import { FiDelete } from 'react-icons/fi';

type Props = {
  setOpenModal: Dispatch<SetStateAction<boolean>>;
  companyRemove: Company | null;
  setCompanyRemove: Dispatch<SetStateAction<Company | null>>;
  setCompaniesList: Dispatch<SetStateAction<Company[]>>;
  companies: Company[];
};

export default function ModalDeleteCompany({
  setOpenModal,
  companyRemove,
  setCompanyRemove,
  setCompaniesList,
  companies
}: Props) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const handleRemove = async () => {
    try {
      setLoading(true);
      setError('');
      if (password.length === 0) return;
      if (!companyRemove) return;
      const data = await checkMasterPassword(password);
      if (!data.data) {
        setError('Senha invalida!');
        return;
      }

      await deleteCompany(companyRemove.id);
      const companiesFilter = companies.filter((c) => c.id != companyRemove.id);
      setCompaniesList(companiesFilter);
      setOpenModal(false);
      setCompanyRemove(null);
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
        <h1 className="font-bold text-2xl">{companyRemove?.trade_name}</h1>
      </div>
      <div>Digite sua senha para remover a empresa!</div>
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
              color: '#fdba74',
              backgroundColor: '#fdba74 !important'
            }
          }}
        >
          <span>Remover</span>
        </Button>
        <button
          type="button"
          className="bg-yellow-500  w-24 h-10 rounded-md text-yellow-950"
          onClick={() => {
            setCompanyRemove(null);
            setOpenModal(false);
          }}
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}
