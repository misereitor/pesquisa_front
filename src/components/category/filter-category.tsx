import { Pagination } from '@mui/material';
import InputSimple from '../input/input';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Category } from '@/model/category';
import Modal from '../modal/modal';
import ModalInsertCompany from './modal-insert-category';

type Props = {
  totalIndex: number;
  // eslint-disable-next-line no-unused-vars
  pagination: (event: React.ChangeEvent<unknown>, value: number) => void;
  currentPage: number;
  setListCategories: Dispatch<SetStateAction<Category[]>>;
  categories: Category[];
};

export default function FilterCategory({
  totalIndex,
  pagination,
  currentPage,
  categories,
  setListCategories
}: Props) {
  const [filterCategory, setFilterCategory] = useState('');
  const [filterCompany, setFilterCompany] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [loadingPage, setLoadingPage] = useState(true);

  useEffect(() => {
    const filteredCategories = categories.filter((category) => {
      // Condições para os dois filtros
      const matchesCategoryName = category.name
        .toLowerCase()
        .includes(filterCategory.toLowerCase());

      const matchesCompanyName =
        !filterCompany || // Se o filtro de empresa estiver vazio, ignora este critério
        (category.companies &&
          category.companies.some((company) =>
            company.company_name
              .toLowerCase()
              .includes(filterCompany.toLowerCase())
          ));

      // Ambas as condições devem ser verdadeiras
      return matchesCategoryName && matchesCompanyName;
    });

    // Atualiza a lista de categorias visível
    setListCategories(filteredCategories);
    setLoadingPage(false);
  }, [filterCategory, filterCompany, categories, setListCategories]);

  return (
    <div>
      <Modal openModal={openModal} setOpenModal={setOpenModal}>
        <ModalInsertCompany
          categories={categories}
          setListCategories={setListCategories}
          setOpenModal={setOpenModal}
        />
      </Modal>
      {loadingPage ? (
        <div className="fixed h-52 top-10 left-0 right-0 w-full"></div>
      ) : (
        <div className="bg-neutral-800 p-4 shadow-md mb-[2px]">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-[#FFDE5E] text-xl font-bold">Categorias</h1>
            <button
              onClick={() => setOpenModal(true)}
              className="px-4 py-2 bg-[#FFDE5E] text-black rounded-md hover:bg-yellow-600 transition flex items-center"
            >
              Adicionar
              <span className="ml-2 text-sm">&#x2795;</span>{' '}
            </button>
          </div>

          <div className="flex justify-between items-center mb-4">
            <div className="flex justify-between w-full">
              <InputSimple
                value={filterCategory}
                placeholder="Buscar"
                label="Categoria"
                sendError={false}
                className="w-72 h-10 rounded-md"
                onChange={(e) => setFilterCategory(e.target.value)}
              />
              <InputSimple
                value={filterCompany}
                placeholder="Buscar"
                label="Empresa:"
                sendError={false}
                className="w-72 h-10 rounded-md"
                onChange={(e) => setFilterCompany(e.target.value)}
              />
            </div>
          </div>

          {/* Paginação */}
          <div className="flex items-center justify-center">
            <Pagination
              count={totalIndex}
              page={currentPage}
              onChange={pagination}
              variant="outlined"
              shape="rounded"
              sx={{
                color: 'rgb(255, 222, 94)',
                '.MuiPagination-ul button': {
                  backgroundColor: 'rgb(255, 222, 94)'
                },
                '.MuiPagination-ul .Mui-selected': {
                  backgroundColor: 'rgb(255, 180, 14)'
                },
                '.MuiPagination-ul .Mui-selected:hover': {
                  opacity: '.8'
                },
                '.MuiPagination-ul button:hover': {
                  opacity: '.8'
                },
                '.MuiPaginationItem-ellipsis': {
                  color: 'rgb(255, 222, 94)'
                }
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
