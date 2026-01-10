'use client';
import { Autocomplete, TextField } from '@mui/material';
import { useState } from 'react';
import { CiCirclePlus } from 'react-icons/ci';
import { Button } from '@mui/material';
import { Category, AssociationCategoryCompany } from '@/src/model/category';
import { Company } from '@/src/model/company';
import { createAssociationCategoryService } from '@/src/service/category-service';

const autoCOmpleteSX = {
  width: '100%',
  '& .MuiOutlinedInput-root': {
    padding: '4px',
    borderRadius: '0.5rem',
    backgroundColor: 'transparent',
    '& fieldset': {
      borderColor: 'rgba(209, 213, 219, 1)' // gray-300
    },
    '&:hover fieldset': {
      borderColor: 'rgba(156, 163, 175, 1)' // gray-400
    },
    '&.Mui-focused fieldset': {
      borderColor: '#4f46e5', // indigo-600
      borderWidth: '2px'
    },
    '.dark & fieldset': {
      borderColor: 'rgba(75, 85, 99, 1)' // gray-600
    },
    '.dark &:hover fieldset': {
      borderColor: 'rgba(107, 114, 128, 1)' // gray-500
    }
  },
  '& .MuiAutocomplete-tag': {
    backgroundColor: 'rgba(79, 70, 229, 0.1)', // indigo-500/10
    border: '1px solid rgba(79, 70, 229, 0.2)',
    color: '#4f46e5',
    borderRadius: '0.25rem',
    '.dark &': {
      backgroundColor: 'rgba(79, 70, 229, 0.2)',
      color: '#818cf8',
      border: '1px solid rgba(79, 70, 229, 0.3)'
    }
  },
  '& .MuiInputElement-root': {
    color: 'inherit'
  },
  '& .MuiSvgIcon-root': {
    color: 'rgba(107, 114, 128, 1)', // gray-500
    '.dark &': {
      color: 'rgba(156, 163, 175, 1)' // gray-400
    }
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
    <div className="p-6 w-full md:w-[500px]">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
        Vincular Empresas
      </h2>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
        Selecione as empresas que farão parte da categoria{' '}
        <span className="font-semibold">{category.name}</span>.
      </p>

      <div className="w-full">
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
              placeholder="Selecione empresas..."
              InputProps={{
                ...params.InputProps,
                className: 'text-gray-900 dark:text-white bg-transparent'
              }}
            />
          )}
          renderOption={(props, option) => (
            <li
              {...props}
              className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer text-gray-900 dark:text-gray-200"
              key={option.id}
            >
              {option.trade_name}
            </li>
          )}
          ListboxProps={{
            className:
              'bg-white dark:bg-gray-800 shadow-xl border border-gray-100 dark:border-gray-700 rounded-lg p-1'
          }}
        />
      </div>

      <div className="flex justify-end gap-3 mt-8">
        <button
          onClick={() => setOpenModal(false)}
          type="button"
          className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors font-medium text-sm"
        >
          Cancelar
        </button>
        <Button
          data-testid="comecar"
          size="medium"
          type="button"
          endIcon={<CiCirclePlus />}
          loading={loadingButton}
          onClick={handleSubmit}
          loadingPosition="end"
          variant="contained"
          sx={{
            backgroundColor: '#4f46e5', // indigo-600
            '&:hover': {
              backgroundColor: '#4338ca' // indigo-700
            },
            textTransform: 'none',
            borderRadius: '0.5rem',
            boxShadow: 'none',
            fontWeight: 500
          }}
        >
          Salvar Vínculos
        </Button>
      </div>
    </div>
  );
}
