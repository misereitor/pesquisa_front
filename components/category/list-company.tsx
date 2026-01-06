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
      <div className="flex justify-between bg-[rgb(70, 70, 70)]">
        <table className="w-full border-collapse text-sm ">
          <thead className="bg-neutral-800  text-left border-b-2 border-black">
            <tr>
              <th className="py-3 px-4 text-[#FFDE5E]">Empresa</th>
              <th className="py-3 px-4 text-center text-[#FFDE5E] w-10">
                Associada
              </th>
              <th className="py-3 px-4 text-center text-[#FFDE5E] w-48">
                Remover da categoria
              </th>
              <th className="py-3 px-4 text-center text-[#FFDE5E] w-10">
                <button
                  type="button"
                  onClick={() => setOpenModalInsertCompany(true)}
                >
                  <MdAddBusiness size={24} />
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            {category.companies?.map((company, companyIndex) => (
              <tr
                key={companyIndex}
                className={`${
                  companyIndex % 2 === 0 ? 'bg-neutral-700' : 'bg-neutral-600'
                } hover:bg-gray-500`}
              >
                <td className="py-3 px-4">
                  <div className="flex flex-col">
                    <h2 className="text-lg font-semibold text-[#FFDE5E]">
                      {company.trade_name}
                    </h2>
                    <span className="text-sm text-[#ffdf5ed0]">
                      Razão Social: {company.company_name}
                    </span>
                    <span className="text-sm text-[#ffdf5ed0]">
                      CNPJ: {company.cnpj}
                    </span>
                  </div>
                </td>
                <td className="py-2 px-4 text-center">
                  {company.associate ? 'Sim' : 'Não'}
                </td>
                <td className="py-3 px-4 text-center">
                  <button
                    type="button"
                    onClick={() => {
                      setId_company(company.id);
                      setOpenModal(true);
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
                      setOpenModalEditCompany(true);
                      setCompanyEdit(company);
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
      </div>
    </div>
  );
}
