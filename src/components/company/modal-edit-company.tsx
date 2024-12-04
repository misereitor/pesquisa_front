import { Company } from '@/model/company';
import { FormCompanyEdit, schemaCompanyEdit } from '@/schema/schemaCompany';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dispatch, SetStateAction, useState } from 'react';
import { useForm } from 'react-hook-form';
import InputSimple from '../input/input';
import LoadingButton from '../button/loading-button';
import { regexCNPJ } from '@/util/dataProcessing';
import { updateCompanyService } from '@/service/company-service';

type Props = {
  companies: Company[];
  setCompaniesList: Dispatch<SetStateAction<Company[]>>;
  setCompanyEdit: Dispatch<SetStateAction<Company | null>>;
  companyEdit: Company | null;
  setOpenModal: Dispatch<SetStateAction<boolean>>;
};

export default function ModalEditCompany({
  companies,
  setCompaniesList,
  companyEdit,
  setCompanyEdit,
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
      associate: companyEdit?.associate,
      cnpj: regexCNPJ(companyEdit?.cnpj),
      company_name: companyEdit?.company_name,
      trade_name: companyEdit?.trade_name
    }
  });
  const handleEdit = async (company: FormCompanyEdit) => {
    try {
      if (!companyEdit) return;
      if (
        company.cnpj &&
        company.cnpj?.length > 1 &&
        company.cnpj?.length !== 18
      ) {
        setError('CNPJ inválido');
        return;
      }
      setLoading(true);
      const update: Company = {
        id: companyEdit.id,
        active: true,
        trade_name: company.trade_name,
        company_name: company.company_name,
        cnpj: company.cnpj?.replace(/\D/g, ''),
        associate: company.associate,
        date_create: new Date()
      };
      await updateCompanyService(update);
      const updateCompany = companies.map((c) =>
        c.id === companyEdit?.id ? { ...c, ...company } : c
      );
      setCompaniesList(updateCompany);
      setCompanyEdit(null);
      setOpenModal(false);
    } catch (error: any) {
      if (
        error.message ==
        'duplicate key value violates unique constraint "company_cnpj_key"'
      ) {
        setError('CNPJ já pertence a outra empresa');
        return;
      }
      if (
        error.message ==
        'duplicate key value violates unique constraint "company_company_name_key"'
      ) {
        setError('Razão social já pertence a outra empresa');
        return;
      }
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div>
      <form onSubmit={handleSubmit(handleEdit)}>
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
            Alterar
          </LoadingButton>
        </div>
      </form>
    </div>
  );
}
