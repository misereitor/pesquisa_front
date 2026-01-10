'use client';

import { Company } from '@/src/model/company';
import { associateCompany } from '@/src/service/company-service';
import { Dispatch, SetStateAction, useState } from 'react';
import { MdEditNote } from 'react-icons/md';
import { RxTrash } from 'react-icons/rx';
import Modal from '../modal/modal';
import ModalDeleteCompany from './modal-delete-company';
import ModalEditCompany from './modal-edit-company';
import FilterCompany from './filter-company';

type Props = {
  companies: Company[];
  setCompaniesList: Dispatch<SetStateAction<Company[]>>;
};

export default function ListCompany({ companies, setCompaniesList }: Props) {
  const [loadingPage, setLoadingPage] = useState(true);
  const [loading, setLoading] = useState(false);
  const [openModalDelete, setOpenModalDelete] = useState(false);
  const [openModalUpdate, setOpenModalUpdate] = useState(false);
  const [companyRemove, setCompanyRemove] = useState<Company | null>(null);
  const [companyEdit, setCompanyEdit] = useState<Company | null>(null);
  const [companiesFilter, setCompaniesFilter] = useState<Company[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const startIndex = (currentPage - 1) * 100;
  const totalIndex = Math.ceil(companiesFilter.length / 100);
  const endIndex = Math.min(startIndex + 100, companiesFilter.length);

  const handleAssociate = async (checked: boolean, company: Company) => {
    try {
      setLoading(true);
      await associateCompany(company.id, checked);
      const updatedCompanies = companies.map((item) =>
        item.id === company.id ? { ...item, associate: checked } : item
      );
      setCompaniesList(updatedCompanies);
    } catch (error: any) {
      console.error('Error in handleSubmitForm:', error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="w-full space-y-6">
      <Modal openModal={openModalDelete} setOpenModal={setOpenModalDelete}>
        <ModalDeleteCompany
          companyRemove={companyRemove}
          setOpenModal={setOpenModalDelete}
          setCompanyRemove={setCompanyRemove}
          setCompaniesList={setCompaniesList}
          companies={companies}
        />
      </Modal>

      <Modal openModal={openModalUpdate} setOpenModal={setOpenModalUpdate}>
        <ModalEditCompany
          companyEdit={companyEdit}
          setOpenModal={setOpenModalUpdate}
          setCompanyEdit={setCompanyEdit}
          setCompaniesList={setCompaniesList}
          companies={companies}
        />
      </Modal>

      <FilterCompany
        totalIndex={totalIndex}
        setCurrentPage={setCurrentPage}
        currentPage={currentPage}
        setCompaniesList={setCompaniesList}
        companies={companies}
        setCompaniesFilter={setCompaniesFilter}
        setLoadingPage={setLoadingPage}
        loadingPage={loadingPage}
      />

      {loadingPage ? (
        <></>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
                  <th className="py-4 px-6 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Empresa
                  </th>
                  <th className="py-4 px-6 text-center text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider w-32">
                    Associada
                  </th>
                  <th className="py-4 px-6 text-center text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider w-24">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {companiesFilter
                  ?.slice(startIndex, endIndex)
                  .map((row, rowIndex) => (
                    <tr
                      key={rowIndex}
                      className="group hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                    >
                      <td className="py-4 px-6">
                        <div className="flex flex-col">
                          <span className="text-sm font-semibold text-gray-900 dark:text-white">
                            {row.trade_name}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                            {row.company_name}
                          </span>
                          <span className="text-xs text-gray-400 dark:text-gray-500 font-mono mt-0.5">
                            {row.cnpj}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-center">
                        <label className="inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={row.associate}
                            disabled={loading}
                            onChange={(e) =>
                              handleAssociate(e.target.checked, row)
                            }
                            className="sr-only peer"
                          />
                          <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600"></div>
                        </label>
                      </td>
                      <td className="py-4 px-6 text-center">
                        <div className="flex items-center justify-center gap-3">
                          <button
                            type="button"
                            onClick={() => {
                              setOpenModalUpdate(true);
                              setCompanyEdit(row);
                            }}
                            disabled={loading}
                            className="p-2 text-indigo-600 hover:bg-indigo-50 dark:text-indigo-400 dark:hover:bg-indigo-900/30 rounded-lg transition-colors"
                            title="Editar empresa"
                          >
                            <MdEditNote size={20} />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setCompanyRemove(row);
                              setOpenModalDelete(true);
                            }}
                            disabled={loading}
                            className="p-2 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                            title="Remover empresa"
                          >
                            <RxTrash size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
            {companiesFilter?.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 dark:text-gray-400">
                  Nenhuma empresa encontrada.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
