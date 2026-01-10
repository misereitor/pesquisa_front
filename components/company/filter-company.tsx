import { Pagination, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import InputSimple from '../input/input';
import { Company } from '@/src/model/company';
import Modal from '../modal/modal';
import ModalAddCompany from './modal-add-company';
import ButtonImport from '../inport/button-import';
import { Csvimport } from '@/src/util/filterImportCSV';
import ModalListImport from '../inport/modal-list-import';
import { ImportCSV } from '@/src/model/import-csv';
import ModalProgress from '../inport/modal-progress';
import Loading from '@/app/loading';

type Props = {
  companies: Company[];
  setCompaniesList: Dispatch<SetStateAction<Company[]>>;
  setCompaniesFilter: Dispatch<SetStateAction<Company[]>>;
  setLoadingPage: Dispatch<SetStateAction<boolean>>;
  loadingPage: boolean;
  setCurrentPage: Dispatch<SetStateAction<number>>;
  currentPage: number;
  totalIndex: number;
};
export default function FilterCompany({
  companies,
  setCompaniesList,
  totalIndex,
  setCompaniesFilter,
  setLoadingPage,
  loadingPage,
  currentPage,
  setCurrentPage
}: Props) {
  const [openModalAdd, setOpenModalAdd] = useState(false);
  const [view, setView] = useState('all');
  const [filterCompany, setFilterCompany] = useState('');
  const [importCSV, setImportCSV] = useState<Csvimport | null>(null);
  const [openModalImport, setOpenModalInsert] = useState(false);
  const [csvTransform, seCsvTransform] = useState<ImportCSV[] | null>(null);
  const [openModalProgress, setOpenModalProgress] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const applyFilters = () => {
      let filtered = companies;
      if (view === 'all') {
        filtered = companies;
      } else if (view === 'associate') {
        filtered = companies.filter((c) => c.associate);
      } else if (view === 'not-associated') {
        filtered = companies.filter((c) => !c.associate);
      }
      if (filterCompany != '') {
        filtered = filtered.filter((c) =>
          c.trade_name
            .toLocaleLowerCase()
            .includes(filterCompany.toLocaleLowerCase())
        );
      }
      setCompaniesFilter(filtered);
      setLoadingPage(false);
    };
    applyFilters();
  }, [companies, filterCompany, setCompaniesFilter, setLoadingPage, view]);

  const pagination = (event: React.ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value);
  };

  const handleChange = (
    event: React.MouseEvent<HTMLElement>,
    nextView: string
  ) => {
    setView(nextView);
  };

  return (
    <div className="mb-6">
      <div className="absolute z-40">
        <Modal
          openModal={openModalProgress}
          setOpenModal={setOpenModalProgress}
          outClick={false}
          className="cursor-wait"
        >
          <ModalProgress progress={progress} />
        </Modal>
        <Modal setOpenModal={setOpenModalAdd} openModal={openModalAdd}>
          <ModalAddCompany
            companies={companies}
            setCompaniesList={setCompaniesList}
            setOpenModal={setOpenModalAdd}
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
      </div>

      {loadingPage ? (
        <div className="fixed inset-0 flex items-center justify-center bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm z-50">
          <Loading />
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Empresas
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Gerencie as empresas cadastradas no sistema
              </p>
            </div>
            <div className="flex gap-3 w-full md:w-auto">
              <ButtonImport
                setImportCSV={setImportCSV}
                setOpenModalInsert={setOpenModalInsert}
              />
              <button
                onClick={() => setOpenModalAdd(true)}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm font-medium text-sm flex-1 md:flex-none"
              >
                <span>Adicionar</span>
                <span className="text-lg leading-none">+</span>
              </button>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row justify-between items-center gap-4 bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg border border-gray-100 dark:border-gray-800">
            <div className="w-full lg:w-auto">
              <ToggleButtonGroup
                value={view}
                exclusive
                onChange={handleChange}
                size="small"
                aria-label="Filter status"
                className="bg-white dark:bg-gray-800 rounded-lg shadow-sm"
                sx={{
                  '& .MuiToggleButton-root': {
                    border: '1px solid',
                    borderColor: 'rgba(229, 231, 235, 1)', // gray-200
                    color: '#6b7280', // gray-500
                    textTransform: 'none',
                    fontWeight: 500,
                    px: 3,
                    '&.Mui-selected': {
                      backgroundColor: '#4f46e5 !important', // indigo-600
                      color: 'white !important',
                      borderColor: '#4f46e5 !important'
                    },
                    '&:hover': {
                      backgroundColor: '#f3f4f6' // gray-100
                    }
                  },
                  '.dark & .MuiToggleButton-root': {
                    borderColor: 'rgba(55, 65, 81, 1)', // gray-700
                    color: '#9ca3af', // gray-400
                    '&:hover': {
                      backgroundColor: '#374151' // gray-700
                    }
                  }
                }}
              >
                <ToggleButton value="all" aria-label="all">
                  Todos
                </ToggleButton>
                <ToggleButton value="associate" aria-label="associate">
                  Associados
                </ToggleButton>
                <ToggleButton
                  value="not-associated"
                  aria-label="not-associated"
                >
                  Não Associados
                </ToggleButton>
              </ToggleButtonGroup>
            </div>

            <div className="w-full lg:w-72">
              <InputSimple
                value={filterCompany}
                placeholder="Buscar por nome..."
                sendError={false}
                className="w-full h-10 px-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                onChange={(e) => setFilterCompany(e.target.value)}
              />
            </div>
          </div>

          {/* Pagination moved to inside the container bottom but can stay here or be passed to ListCompany. 
              The original design had it here inside the "Header" block which was weird. 
              Usually pagination is at the bottom of the list. 
              However, ListCompany renders THIS component. Wait.
              ListCompany RENDERS FilterCompany? 
              
              Let's look at ListCompany.tsx again.
              Line 66: <FilterCompany ... />
              Line 79: <table> ... </table>
              
              So FilterCompany is ON TOP of the table. 
              The pagination inside FilterCompany controls the table below it? 
              
              Yes, 'setCurrentPage' is passed down.
              Ideally pagination should be at the bottom of the table.
              
              I will keeping the pagination here for now but maybe I should move it to ListCompany footer if I want a clean UI.
              But to minimize structural changes, I'll keep it here or maybe Hide it here and move it to ListCompany?
              
              The user sees:
              [FilterCompany Block] -> [Table]
              
              If pagination is inside FilterCompany, it might be above the table?
              The original code had pagination at the bottom of the div.
              
              I will styling it nicely here.
          */}
          <div className="mt-4 flex justify-end">
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
