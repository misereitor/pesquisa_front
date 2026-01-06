'use client';
import { styled } from '@mui/material/styles';
import MuiAccordion, { AccordionProps } from '@mui/material/Accordion';
import MuiAccordionSummary, {
  AccordionSummaryProps
} from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
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
))(() => ({
  border: `2px solid rgb(25, 25, 25)`,
  color: 'rgb(255, 222, 94)',
  '&:not(:last-child)': {
    borderBottom: 0
  },
  '&::before': {
    display: 'none'
  }
}));

const AccordionSummary = styled((props: AccordionSummaryProps) => (
  <MuiAccordionSummary
    expandIcon={<RxChevronRight className="text-[#FFDE5E]" size={24} />}
    {...props}
  />
))(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === 'dark'
      ? 'rgba(255, 255, 255, .05)'
      : 'rgba(24, 24, 27, .9)',
  flexDirection: 'row-reverse',
  '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
    transform: 'rotate(90deg)'
  },
  '& .MuiAccordionSummary-content': {
    marginLeft: theme.spacing(1)
  }
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: '1px solid rgba(24, 24, 27, 1)',
  backgroundColor: 'rgb(70, 70, 70)'
}));

type Props = {
  category: Category;
  expanded: string | false;
  company: Company[];
  startIndex: number;
  index: number;
  categories: Category[];
  setCategories: Dispatch<SetStateAction<Category[]>>;
  loading: boolean;
  setLoading: Dispatch<SetStateAction<boolean>>;
  handleChange: (
    // eslint-disable-next-line no-unused-vars
    panel: string
    // eslint-disable-next-line no-unused-vars
  ) => (event: React.SyntheticEvent, newExpanded: boolean) => void;
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
    <div>
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
      >
        <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
          <div className="flex justify-between w-full">
            <Typography>{category.name}</Typography>
            <div>
              <button
                className={`${loading && 'opacity-40'}`}
                type="button"
                disabled={loading}
                onClick={() => {
                  setOpenModalDelete(true);
                }}
              >
                <RxTrash
                  size={24}
                  className={`${loading && 'text-red-300'} text-red-600 cursor-pointer hover:text-red-800 transition-colors my-auto mx-auto`}
                />
              </button>
              <button
                className={`${loading && 'opacity-40'} ml-10 mr-5`}
                type="button"
                disabled={loading}
                onClick={() => setOpenModalEdit(true)}
              >
                <MdEditNote
                  size={28}
                  className={`${loading && 'text-[#ffdf5e8e]'} text-[#FFDE5E] cursor-pointer hover:text-[#FFDE5E] transition-colors my-auto mx-auto`}
                />
              </button>
            </div>
          </div>
        </AccordionSummary>
        <AccordionDetails>
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
        </AccordionDetails>
      </Accordion>
    </div>
  );
}
