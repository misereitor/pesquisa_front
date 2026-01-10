'use client';
import { Category } from '@/src/model/category';
import { Company } from '@/src/model/company';
import { Dispatch, SetStateAction, useState } from 'react';
import { MdAddBusiness, MdEditNote } from 'react-icons/md';
import { RxTrash } from 'react-icons/rx';
import Modal from '../modal/modal';
import ModalRemoveCompanyAssociation from './modal-remover-company-association';

type Props = {
  category: Category;
  setCategories: Dispatch<SetStateAction<Category[]>>;
  setOpenModalInsertCompany: Dispatch<SetStateAction<boolean>>;
  setOpenModalEditCompany: Dispatch<SetStateAction<boolean>>;
  categories: Category[];
  loading: boolean;
  setLoading: Dispatch<SetStateAction<boolean>>;
  setCompanyEdit: Dispatch<SetStateAction<Company | undefined>>;
};

export default function ListCompanyInAccordion({
  category,
  loading,
  setLoading,
  categories,
  setCategories,
  setOpenModalInsertCompany,
  setCompanyEdit,
  setOpenModalEditCompany
}: Props) {
  const [openModal, setOpenModal] = useState(false);
  const [id_company, setId_company] = useState<number | null>(null);
  return (
    <div>
      <Modal openModal={openModal} setOpenModal={setOpenModal}>
        <ModalRemoveCompanyAssociation
          loading={loading}
          category={category}
          setLoading={setLoading}
          setId_company={setId_company}
          id_company={id_company}
          setCategories={setCategories}
          setOpenModal={setOpenModal}
          categories={categories}
        />
      </Modal>
      <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
        <table className="w-full text-sm text-left border-collapse">
          <thead className="bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 font-medium border-b border-gray-200 dark:border-gray-700">
            <tr>
              <th className="py-3 px-4 font-semibold uppercase text-xs tracking-wider">
                Empresa
              </th>
              <th className="py-3 px-4 text-center font-semibold uppercase text-xs tracking-wider w-20">
                Associada
              </th>
              <th className="py-3 px-4 text-center font-semibold uppercase text-xs tracking-wider w-24">
                Ações
              </th>
              <th className="py-3 px-4 text-right w-16">
                <button
                  type="button"
                  onClick={() => setOpenModalInsertCompany(true)}
                  className="p-1 rounded hover:bg-indigo-100 dark:hover:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 transition-colors"
                  title="Adicionar empresa"
                >
                  <MdAddBusiness size={20} />
                </button>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-900">
            {category.companies?.map((company, companyIndex) => (
              <tr
                key={companyIndex}
                className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
              >
                <td className="py-3 px-4">
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                      {company.trade_name}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {company.company_name}
                    </span>
                    <span className="text-xs text-gray-400 dark:text-gray-500 font-mono">
                      {company.cnpj}
                    </span>
                  </div>
                </td>
                <td className="py-3 px-4 text-center">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                      company.associate
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {company.associate ? 'Sim' : 'Não'}
                  </span>
                </td>
                <td className="py-3 px-4 text-center">
                  <button
                    type="button"
                    onClick={() => {
                      setId_company(company.id);
                      setOpenModal(true);
                    }}
                    disabled={loading}
                    className="p-2 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                    title="Remover empresa desta categoria"
                  >
                    <RxTrash size={18} />
                  </button>
                </td>
                <td className="py-3 px-4 text-center">
                  <button
                    type="button"
                    onClick={() => {
                      setOpenModalEditCompany(true);
                      setCompanyEdit(company);
                    }}
                    disabled={loading}
                    className="p-2 text-indigo-600 hover:bg-indigo-50 dark:text-indigo-400 dark:hover:bg-indigo-900/30 rounded-lg transition-colors"
                    title="Editar informações"
                  >
                    <MdEditNote size={20} />
                  </button>
                </td>
              </tr>
            ))}
            {(!category.companies || category.companies.length === 0) && (
              <tr>
                <td
                  colSpan={4}
                  className="py-6 text-center text-gray-500 dark:text-gray-400 text-sm"
                >
                  Nenhuma empresa vinculada a esta categoria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
