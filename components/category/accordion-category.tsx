'use client';
import { styled } from '@mui/material/styles';
import MuiAccordion, { AccordionProps } from '@mui/material/Accordion';
import MuiAccordionSummary, {
  AccordionSummaryProps
} from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import {
  Dispatch,
  SetStateAction,
  SyntheticEvent,
  useEffect,
  useState
} from 'react';
import { RxChevronRight, RxTrash } from 'react-icons/rx';
import { Category } from '@/src/model/category';
import ListCompanyInAccordion from './list-company';
import { MdEditNote } from 'react-icons/md';
import Modal from '../modal/modal';
import ModalDeleteCategory from './modal-delete-category';
import ModalEditCategory from './modal-edit-category';
import ModalInsertCompanyFromCategory from './modal-insert-company';
import ModalEditCompanyByCategory from './modal-edit-company-by-category';
import { Company } from '@/src/model/company';
import Loading from '@/app/loading';

const Accordion = styled((props: AccordionProps) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  '&:before': {
    display: 'none'
  }
}));

type Props = {
  category: Category;
  expanded: string | false;
  handleChange: (
    panel: string
  ) => (event: SyntheticEvent, newExpanded: boolean) => void;
  startIndex: number;
  index: number;
  categories: Category[];
  setCategories: Dispatch<SetStateAction<Category[]>>;
  loading: boolean;
  setLoading: Dispatch<SetStateAction<boolean>>;
  company: Company[];
};

export default function CustomizedAccordions({
  category,
  expanded,
  handleChange,
  startIndex,
  index,
  categories,
  setCategories,
  loading,
  setLoading,
  company
}: Props) {
  const [openModalDelete, setOpenModalDelete] = useState(false);
  const [openModalEdit, setOpenModalEdit] = useState(false);
  const [openModalEditCompany, setOpenModalEditCompany] = useState(false);
  const [openModalInsertCompany, setOpenModalInsertCompany] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [companyEdit, setCompanyEdit] = useState<Company | undefined>();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return <Loading />;

  return (
    <div className="mb-3">
      <Modal
        outClick={false}
        openModal={openModalInsertCompany}
        setOpenModal={setOpenModalInsertCompany}
      >
        <ModalInsertCompanyFromCategory
          company={company}
          setOpenModal={setOpenModalInsertCompany}
          category={category}
          categories={categories}
          setCategoryList={setCategories}
        />
      </Modal>
      <Modal
        setOpenModal={setOpenModalEditCompany}
        openModal={openModalEditCompany}
      >
        <ModalEditCompanyByCategory
          categories={categories}
          category={category}
          setCategories={setCategories}
          setOpenModal={setOpenModalEditCompany}
          companyEdit={companyEdit}
          setCompanyEdit={setCompanyEdit}
        />
      </Modal>
      <Modal openModal={openModalDelete} setOpenModal={setOpenModalDelete}>
        <ModalDeleteCategory
          setOpenModal={setOpenModalDelete}
          categories={categories}
          setCategoryList={setCategories}
          categoryRemove={category}
        />
      </Modal>
      <Modal openModal={openModalEdit} setOpenModal={setOpenModalEdit}>
        <ModalEditCategory
          setOpenModalEdit={setOpenModalEdit}
          categories={categories}
          setCategories={setCategories}
          category={category}
        />
      </Modal>

      <Accordion
        expanded={expanded === `${startIndex} ${index}`}
        onChange={handleChange(`${startIndex} ${index}`)}
        className="rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-200 hover:border-indigo-300 dark:hover:border-indigo-700"
        sx={{
          backgroundColor: 'transparent'
        }}
      >
        <MuiAccordionSummary
          expandIcon={
            <RxChevronRight
              className="text-gray-500 dark:text-gray-400"
              size={24}
            />
          }
          aria-controls={`panel${index}d-content`}
          id={`panel${index}d-header`}
          className="bg-white dark:bg-gray-800 transition-colors"
          sx={{
            flexDirection: 'row-reverse',
            '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
              transform: 'rotate(90deg)',
              color: '#4f46e5' // indigo-600
            },
            '& .MuiAccordionSummary-content': {
              marginLeft: '16px'
            }
          }}
        >
          <div className="flex justify-between items-center w-full pr-2">
            <Typography className="text-gray-900 dark:text-white font-semibold text-lg hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
              {category.name}
            </Typography>

            <div
              className="flex items-center gap-2 opacity-80 hover:opacity-100 transition-opacity"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="p-2 text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg transition-all"
                type="button"
                disabled={loading}
                onClick={() => setOpenModalEdit(true)}
                title="Editar categoria"
              >
                <MdEditNote size={22} />
              </button>
              <button
                className="p-2 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-all"
                type="button"
                disabled={loading}
                onClick={() => setOpenModalDelete(true)}
                title="Remover categoria"
              >
                <RxTrash size={20} />
              </button>
            </div>
          </div>
        </MuiAccordionSummary>

        <MuiAccordionDetails className="bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700 p-0">
          <div className="p-4">
            <ListCompanyInAccordion
              setCompanyEdit={setCompanyEdit}
              setOpenModalEditCompany={setOpenModalEditCompany}
              setOpenModalInsertCompany={setOpenModalInsertCompany}
              loading={loading}
              setLoading={setLoading}
              categories={categories}
              category={category}
              setCategories={setCategories}
            />
          </div>
        </MuiAccordionDetails>
      </Accordion>
    </div>
  );
}
