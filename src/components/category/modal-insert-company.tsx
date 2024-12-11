'use client';
import { Company } from '@/model/company';
import { getAllCompany } from '@/service/company-service';
import {
  Autocomplete,
  CircularProgress,
  Checkbox,
  TextField
} from '@mui/material';
import { Fragment, useState } from 'react';
import { MdCheckBox, MdCheckBoxOutlineBlank } from 'react-icons/md';
import LoadingButton from '../button/loading-button';
import { createAssociationCategoryService } from '@/service/category-service';
import { AssociationCategoryCompany, Category } from '@/model/category';

const icon = <MdCheckBoxOutlineBlank size={16} />;
const checkedIcon = <MdCheckBox size={16} />;

const autoCOmpleteSX = {
  width: 400,
  backgroundColor: '#FFEF5E', // Fundo do Autocomplete
  color: '#FFEF5E', // Cor do texto
  border: '1px solid #434343',
  borderRadius: '4px',
  '& .MuiAutocomplete-tag': {
    backgroundColor: 'rgba(255,255,255,0.08)',
    border: '1px solid #303030',
    color: '#FFEF5E',
    borderRadius: '2px'
  },
  '& .MuiAutocomplete-tag svg': {
    color: '#FFEF5E'
  },
  '& .MuiFormLabel-root': {
    color: '#FFEF5E'
  },
  '& .MuiInputBase-input': {
    color: '#FFEF5E'
  },
  '& .MuiAutocomplete-endAdornment svg': {
    color: '#FFEF5E'
  }
};

type Props = {
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  category: Category;
  setCategoryList: React.Dispatch<React.SetStateAction<Category[]>>;
  categories: Category[];
};

export default function ModalInsertCompanyFromCategory({
  setOpenModal,
  category,
  categories,
  setCategoryList
}: Props) {
  const [value, setValue] = useState<Company[]>(
    category.companies ? category.companies : []
  );
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState<readonly Company[]>([]);
  const [loadingButton, setLoadingButton] = useState(false);

  const handleOpen = async () => {
    setOpen(true);
    setLoading(true);
    const companies = await getAllCompany();
    setLoading(false);
    setOptions(companies);
  };

  const handleClose = () => {
    setOpen(false);
    setOptions([]);
  };

  const handleSubmit = async () => {
    try {
      setLoadingButton(true);

      const association: AssociationCategoryCompany[] = [];
      value.forEach((e) => {
        association.push({ id_category: category.id, id_company: e.id });
      });
      await createAssociationCategoryService(association);
      category.companies = value;
      const updateCategories = categories.map((e) =>
        e.id === category.id ? category : e
      );
      setCategoryList(updateCategories);
      setOpenModal(false);
    } catch (error: any) {
      console.error(error.message);
    } finally {
      setLoadingButton(false);
    }
  };

  return (
    <div>
      <div className="w-[400px]">
        <Autocomplete
          multiple
          sx={autoCOmpleteSX}
          open={open}
          onOpen={handleOpen}
          onClose={handleClose}
          id="checkboxes-tags-demo"
          loading={loading}
          options={options}
          disableCloseOnSelect
          getOptionLabel={(option) => option.trade_name}
          value={value}
          onChange={(event, newValue) => setValue(newValue)}
          renderOption={(props, option, { selected }) => {
            const { key, ...optionProps } = props;
            return (
              <li
                key={key}
                {...optionProps}
                className="text-[#FFEF5E] bg-[#333]"
              >
                <Checkbox
                  icon={icon}
                  checkedIcon={checkedIcon}
                  style={{ marginRight: 8 }}
                  checked={selected}
                />
                {option.company_name}
              </li>
            );
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Selecione as empresas"
              placeholder="Empresas"
              sx={{ color: '#FFEF5E', backgroundColor: '#333' }}
              slotProps={{
                input: {
                  ...params.InputProps,
                  endAdornment: (
                    <Fragment>
                      {loading ? (
                        <CircularProgress sx={{ color: '#FFEF5E' }} size={20} />
                      ) : null}
                      {params.InputProps.endAdornment}
                    </Fragment>
                  )
                }
              }}
            />
          )}
        />
      </div>
      <div className="mt-10 flex justify-between items-center">
        <button onClick={() => setOpenModal(false)} type="button">
          Cancelar
        </button>
        <LoadingButton onClick={handleSubmit} loading={loadingButton}>
          Alterar
        </LoadingButton>
      </div>
    </div>
  );
}
