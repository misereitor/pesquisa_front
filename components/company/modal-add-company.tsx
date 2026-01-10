import { useForm } from 'react-hook-form';
import InputSimple from '../input/input';
import { FormCompanyEdit, schemaCompanyEdit } from '@/src/schema/schemaCompany';
import { zodResolver } from '@hookform/resolvers/zod';
import { regexCNPJ } from '@/src/util/dataProcessing';
import { Dispatch, SetStateAction, useState } from 'react';
import { cerateCompanyService } from '@/src/service/company-service';
import { Company } from '@/src/model/company';
import { Button } from '@mui/material';
import { CiCirclePlus } from 'react-icons/ci';

type Props = {
  companies: Company[];
  setCompaniesList: Dispatch<SetStateAction<Company[]>>;
  setOpenModal: Dispatch<SetStateAction<boolean>>;
};
export default function ModalAddCompany({
  companies,
  setCompaniesList,
  setOpenModal
}: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormCompanyEdit>({
    mode: 'all',
    criteriaMode: 'all',
    resolver: zodResolver(schemaCompanyEdit),
    defaultValues: {
      associate: true,
      cnpj: '',
      company_name: '',
      trade_name: ''
    }
  });

  const handleAddCompany = async (company: FormCompanyEdit) => {
    try {
      if (
        company.cnpj &&
        company.cnpj?.length > 1 &&
        company.cnpj?.length !== 18
      ) {
        setError('CNPJ inválido');
        return;
      }
      setLoading(true);
      const create = await cerateCompanyService(company);
      if (!create.success) {
        setError(create.message);
        return;
      }
      const newCompany = create.data as Company;
      const updateCompany = [...companies, { ...newCompany }];
      const sortedCompanies = updateCompany.sort((a, b) =>
        a.trade_name.localeCompare(b.trade_name)
      );
      setCompaniesList(sortedCompanies);
      setOpenModal(false);
    } catch (error: any) {
      console.error('Error in handleSubmitForm:', error);

      if (error.name === 'Error') {
        // Caso o backend tenha retornado uma mensagem de erro específica
        if (
          error.message ==
          'duplicate key value violates unique constraint "company_cnpj_key"'
        ) {
          setError('CNPJ já pertence a outra empresa');
          return;
        }
        if (
          error.message ==
          'duplicate key value violates unique constraint "company_trade_name_key"'
        ) {
          setError('Nome Fantasia já pertence a outra empresa');
          return;
        }
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
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
        Adicionar Nova Empresa
      </h2>
      <form onSubmit={handleSubmit(handleAddCompany)} className="space-y-4">
        <div>
          <InputSimple
            className="w-full h-11 px-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            type="text"
            autoFocus
            label="Nome Fantasia"
            errortext={errors.trade_name?.message}
            {...register('trade_name')}
          />
        </div>
        <div>
          <InputSimple
            className="w-full h-11 px-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            type="text"
            label="Razão Social"
            errortext={errors.company_name?.message}
            {...register('company_name')}
          />
        </div>
        <div>
          <InputSimple
            className="w-full h-11 px-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            type="text"
            label="CNPJ"
            placeholder="00.000.000/0000-00"
            errortext={errors.cnpj?.message}
            maxLength={18}
            {...register('cnpj', {
              onChange: (e) => (e.target.value = regexCNPJ(e.target.value))
            })}
          />
        </div>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="associate"
            className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 dark:focus:ring-indigo-600 dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600"
            {...register('associate')}
          />
          <label
            htmlFor="associate"
            className="text-sm font-medium text-gray-900 dark:text-gray-300"
          >
            Associada
          </label>
        </div>

        {error && (
          <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm rounded-lg">
            {error}
          </div>
        )}

        <div className="flex justify-end gap-3 mt-6">
          <button
            type="button"
            onClick={() => setOpenModal(false)}
            disabled={loading}
            className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors font-medium text-sm"
          >
            Cancelar
          </button>
          <Button
            data-testid="comecar"
            size="medium"
            type="submit"
            endIcon={<CiCirclePlus />}
            loading={loading}
            loadingPosition="end"
            variant="contained"
            sx={{
              backgroundColor: '#4f46e5', // indigo-600
              '&:hover': {
                backgroundColor: '#4338ca' // indigo-700
              },
              textTransform: 'none',
              borderRadius: '0.5rem', // rounded-lg
              boxShadow: 'none',
              fontWeight: 500
            }}
          >
            Adicionar
          </Button>
        </div>
      </form>
    </div>
  );
}
