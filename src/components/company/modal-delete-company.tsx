'use client';
import { Dispatch, SetStateAction, useState } from 'react';
import InputSimple from '../input/input';
import { Company } from '@/model/company';
import { getCookie } from 'cookies-next/client';
import { loginUserAdmin } from '@/service/login-user-admin';
import { FormUserAdmin } from '@/schema/schemaAdminUsers';
import LoadingButton from '../button/loading-button';
import { deleteCompany } from '@/service/company-service';

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
      const userCookies = getCookie('user');
      if (userCookies) {
        const user = JSON.parse(userCookies);
        const login: FormUserAdmin = {
          username: user.username,
          password: password
        };
        const data = await loginUserAdmin(login);
        if (!data.success) {
          setError(data.message);
          return;
        }

        await deleteCompany(companyRemove.id);
        const companiesFilter = companies.filter(
          (c) => c.id != companyRemove.id
        );
        setCompaniesList(companiesFilter);
        setOpenModal(false);
        setCompanyRemove(null);
      }
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
        <LoadingButton
          loading={loading}
          onClick={() => handleRemove()}
          className="bg-orange-700 rounded-md text-white disabled:bg-orange-300 disabled:text-red-700"
        >
          Deletar
        </LoadingButton>
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
