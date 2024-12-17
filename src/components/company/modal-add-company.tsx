import { useForm } from 'react-hook-form';
import InputSimple from '../input/input';
import { FormCompanyEdit, schemaCompanyEdit } from '@/schema/schemaCompany';
import { zodResolver } from '@hookform/resolvers/zod';
import { regexCNPJ } from '@/util/dataProcessing';
import { Dispatch, SetStateAction, useState } from 'react';
import { cerateCompanyService } from '@/service/company-service';
import { Company } from '@/model/company';
import LoadingButton from '../button/loading-button';

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
      const updateCompany = [...companies, { ...create }];
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
    <div>
      <form onSubmit={handleSubmit(handleAddCompany)}>
        <div>
          <InputSimple
            className="rounded-lg w-72 h-7"
            type="text"
            autoFocus
            label="Nome Fantasia:"
            errortext={errors.trade_name?.message}
            {...register('trade_name')}
          />
        </div>
        <div>
          <InputSimple
            className="rounded-lg w-72 h-7"
            type="text"
            autoFocus
            label="Razão social:"
            errortext={errors.company_name?.message}
            {...register('company_name')}
          />
        </div>
        <div>
          <InputSimple
            className="rounded-lg w-72 h-7"
            type="text"
            autoFocus
            label="CNPJ:"
            errortext={errors.cnpj?.message}
            maxLength={18}
            {...register('cnpj', {
              onChange: (e) => (e.target.value = regexCNPJ(e.target.value))
            })}
          />
        </div>
        <div>
          <label htmlFor="associate">Associada: </label>
          <input
            type="checkbox"
            id="associate"
            autoFocus
            {...register('associate')}
          />
        </div>
        <div className="h6">
          {error && <span className="text-red-600">{error}</span>}
        </div>
        <div className="flex justify-between mt-5">
          <button
            type="button"
            onClick={() => setOpenModal(false)}
            disabled={loading}
          >
            Cancelar
          </button>
          <LoadingButton type="submit" loading={loading}>
            Adicionar
          </LoadingButton>
        </div>
      </form>
    </div>
  );
}
