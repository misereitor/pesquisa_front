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
    <div>
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
        <div className="fixed h-52 top-10 left-0 right-0 w-full">
          <Loading />
        </div>
      ) : (
        <div className="bg-neutral-800 p-4 shadow-md mb-0.5">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-[#FFDE5E] text-xl font-bold">Empresas</h1>
            <div className="flex">
              <ButtonImport
                setImportCSV={setImportCSV}
                setOpenModalInsert={setOpenModalInsert}
              />
              <button
                onClick={() => setOpenModalAdd(true)}
                className="px-4 py-2 bg-[#FFDE5E] text-black rounded-md hover:bg-yellow-600 transition flex items-center ml-3"
              >
                Adicionar
                <span className="ml-2 text-sm">&#x2795;</span>{' '}
              </button>
            </div>
          </div>

          <div className="flex justify-between items-center mb-4">
            <div>
              <ToggleButtonGroup
                value={view}
                exclusive
                onChange={handleChange}
                size="small"
                aria-label="Platform"
                sx={{
                  zIndex: '10',
                  backgroundColor: '#ffe45f',
                  '.Mui-selected': {
                    backgroundColor: '#f2b40a !important'
                  },
                  '.MuiToggleButton-root': {
                    padding: '4px',
                    lineHeight: '1.5'
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

            <div className="flex items-center gap-2">
              <InputSimple
                value={filterCompany}
                placeholder="Buscar"
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
