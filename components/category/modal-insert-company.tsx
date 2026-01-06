'use client';
import { Autocomplete, TextField } from '@mui/material';
import { useState } from 'react';
import { CiCirclePlus } from 'react-icons/ci';
import { Button } from '@mui/material';
import { Category, AssociationCategoryCompany } from '@/src/model/category';
import { Company } from '@/src/model/company';
import { createAssociationCategoryService } from '@/src/service/category-service';

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
  company: Company[];
};

export default function ModalInsertCompanyFromCategory({
  setOpenModal,
  category,
  categories,
  setCategoryList,
  company
}: Props) {
  const [value, setValue] = useState<Company[]>(
    category.companies ? category.companies : []
  );
  const [open, setOpen] = useState(false);
  const [loadingButton, setLoadingButton] = useState(false);

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
      console.error('Error in handleSubmitForm:', error);
    } finally {
      setLoadingButton(false);
    }
  };

  return (
    <div>
      <div className="w-[400px]">
        <Autocomplete
          value={value}
          multiple
          id="asynchronous-demo"
          autoFocus
          onChange={(event, newValue) => setValue(newValue)}
          sx={autoCOmpleteSX}
          selectOnFocus
          open={open}
          onOpen={() => {
            setOpen(true);
          }}
          onClose={() => {
            setOpen(false);
          }}
          isOptionEqualToValue={(option, value) =>
            option.trade_name === value.trade_name
          }
          getOptionLabel={(option) => option.trade_name}
          options={company}
          renderInput={(params) => (
            <TextField
              {...params}
              autoFocus
              name={category.name}
              sx={{ color: '#FFEF5E', backgroundColor: '#333' }}
            />
          )}
          renderOption={(props, option) => (
            <li
              {...props}
              hidden
              key={option.id}
              style={{
                backgroundColor: 'rgb(25, 25, 25)',
                color: 'rgb(255, 222, 94)'
              }}
            >
              {option.trade_name}
            </li>
          )}
        />
      </div>
      <div className="mt-10 flex justify-between items-center">
        <button onClick={() => setOpenModal(false)} type="button">
          Cancelar
        </button>
        <Button
          data-testid="comecar"
          size="medium"
          color="success"
          type="button"
          endIcon={<CiCirclePlus />}
          loading={loadingButton}
          onClick={handleSubmit}
          loadingPosition="end"
          variant="contained"
          sx={{
            color: '#7f5d00',
            backgroundColor: '#ffe45f !important',
            '&.Mui-disabled': {
              color: '#7f5d00',
              backgroundColor: '#fdf6d0 !important'
            }
          }}
        >
          <span>Atualizar</span>
        </Button>
      </div>
    </div>
  );
}
