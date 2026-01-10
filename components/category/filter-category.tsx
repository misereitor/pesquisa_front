import { Pagination } from '@mui/material';
import InputSimple from '../input/input';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Category } from '@/src/model/category';
import Modal from '../modal/modal';
import ModalInsertCompany from './modal-insert-category';
import ButtonImport from '../inport/button-import';
import { ImportCSV } from '@/src/model/import-csv';
import ModalListImport from '../inport/modal-list-import';
import { Csvimport } from '@/src/util/filterImportCSV';
import ModalProgress from '../inport/modal-progress';

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
  const [openModalImport, setOpenModalInsert] = useState(false);
  const [importCSV, setImportCSV] = useState<Csvimport | null>(null);
  const [csvTransform, seCsvTransform] = useState<ImportCSV[] | null>(null);
  const [openModalProgress, setOpenModalProgress] = useState(false);
  const [progress, setProgress] = useState(0);

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
            company.trade_name
              .toLowerCase()
              .includes(filterCompany.toLowerCase())
          ));

      // Ambas as condições devem ser verdadeiras
      return matchesCategoryName && matchesCompanyName;
    });

    // Atualiza a lista de categorias visível
    setListCategories(filteredCategories);
    setLoadingPage(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterCategory, filterCompany, setListCategories]);

  return (
    <div className="mb-6">
      <Modal openModal={openModal} setOpenModal={setOpenModal}>
        <ModalInsertCompany
          categories={categories}
          setListCategories={setListCategories}
          setOpenModal={setOpenModal}
        />
      </Modal>
      <Modal
        setOpenModal={setOpenModalInsert}
        outClick={false}
        openModal={openModalImport}
      >
        <ModalListImport
          setProgress={setProgress}
          setOpenModalProgress={setOpenModalProgress}
          setOpenModal={setOpenModalInsert}
          importCSV={importCSV}
          seCsvTransform={seCsvTransform}
          csvTransform={csvTransform}
        />
      </Modal>
      <Modal
        openModal={openModalProgress}
        setOpenModal={setOpenModalProgress}
        outClick={false}
        className="cursor-wait"
      >
        <ModalProgress progress={progress} />
      </Modal>

      {loadingPage ? (
        <div className="fixed inset-0 flex items-center justify-center bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm z-50"></div>
      ) : (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Categorias
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Gerencie as categorias de votação
              </p>
            </div>
            <div className="flex gap-3 w-full md:w-auto">
              <ButtonImport
                setImportCSV={setImportCSV}
                setOpenModalInsert={setOpenModalInsert}
              />
              <button
                onClick={() => setOpenModal(true)}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm font-medium text-sm flex-1 md:flex-none"
              >
                <span>Adicionar</span>
                <span className="text-lg leading-none">+</span>
              </button>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg border border-gray-100 dark:border-gray-800 mb-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="w-full md:w-1/2">
                <InputSimple
                  value={filterCategory}
                  placeholder="Buscar por nome da categoria..."
                  label="Categoria"
                  sendError={false}
                  className="w-full h-10 px-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  onChange={(e) => setFilterCategory(e.target.value)}
                />
              </div>
              <div className="w-full md:w-1/2">
                <InputSimple
                  autoComplete="off"
                  value={filterCompany}
                  placeholder="Buscar por empresa vinculada..."
                  label="Empresa"
                  sendError={false}
                  type="text"
                  className="w-full h-10 px-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  onChange={(e) => setFilterCompany(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Paginação */}
          <div className="flex justify-end">
            <Pagination
              count={totalIndex}
              page={currentPage}
              onChange={pagination}
              variant="outlined"
              shape="rounded"
              color="primary"
              sx={{
                '& .MuiPaginationItem-root': {
                  color: '#6b7280',
                  borderColor: '#e5e7eb',
                  '&.Mui-selected': {
                    backgroundColor: '#4f46e5',
                    color: 'white',
                    borderColor: '#4f46e5',
                    '&:hover': {
                      backgroundColor: '#4338ca'
                    }
                  }
                }
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
