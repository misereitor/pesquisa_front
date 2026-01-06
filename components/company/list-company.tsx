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
    <div className="w-full bg-black shadow-md overflow-x-auto">
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
        <table className="w-full border-collapse text-sm text-gray-700">
          <thead className="bg-neutral-700 text-white text-left border-b-2 border-black">
            <tr>
              <th className="py-3 px-4 text-[#FFDE5E]">Empresa</th>
              <th className="py-3 px-4 text-center text-[#FFDE5E] w-10">
                Associada
              </th>
              <th className="py-3 px-4 text-center text-[#FFDE5E] w-10">
                Remover
              </th>
              <th className="py-3 px-4 text-center text-[#FFDE5E] w-10">
                Editar
              </th>
            </tr>
          </thead>
          <tbody>
            {companiesFilter
              ?.slice(startIndex, endIndex)
              .map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  className={`${
                    rowIndex % 2 === 0 ? 'bg-neutral-700' : 'bg-neutral-600'
                  } hover:bg-gray-500`}
                >
                  <td className="py-3 px-4">
                    <div className="flex flex-col">
                      <h2 className="text-lg font-semibold text-[#FFDE5E]">
                        {row.trade_name}
                      </h2>
                      <span className="text-sm text-[#ffdf5ed0]">
                        Razão Social: {row.company_name}
                      </span>
                      <span className="text-sm text-[#ffdf5ed0]">
                        CNPJ: {row.cnpj}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex items-center justify-center">
                      <input
                        type="checkbox"
                        checked={row.associate}
                        disabled={loading}
                        id={`associate-${rowIndex}`}
                        onChange={(e) => handleAssociate(e.target.checked, row)}
                        className="text-[#FFDE5E] rounded focus:ring focus:text-[#FFDE5E]"
                      />
                      <label
                        className="ml-2 text-sm text-[#FFDE5E]"
                        htmlFor={`associate-${rowIndex}`}
                      >
                        {row.associate ? 'Sim' : 'Não'}
                      </label>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <button
                      type="button"
                      onClick={() => {
                        setCompanyRemove(row);
                        setOpenModalDelete(true);
                      }}
                      disabled={loading}
                    >
                      <RxTrash
                        size={24}
                        className={`${loading && 'text-red-300'} text-red-600 cursor-pointer hover:text-red-800 transition-colors my-auto mx-auto`}
                      />
                    </button>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <button
                      type="button"
                      onClick={() => {
                        setOpenModalUpdate(true);
                        setCompanyEdit(row);
                      }}
                      disabled={loading}
                    >
                      <MdEditNote
                        size={28}
                        className={`${loading && 'text-[#ffdf5e8e]'} text-[#FFDE5E] cursor-pointer hover:text-[#FFDE5E] transition-colors my-auto mx-auto`}
                      />
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
