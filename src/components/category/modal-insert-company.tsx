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

const icon = <MdCheckBoxOutlineBlank size={16} />;
const checkedIcon = <MdCheckBox size={16} />;

export default function ModalInsertCompanyFromCategory() {
  const [value, setValue] = useState<Company[]>([]); // O valor agora é um array de empresas
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState<readonly Company[]>([]);

  const handleOpen = async () => {
    setOpen(true);
    setLoading(true);
    const companies = await getAllCompany();
    setLoading(false);
    setOptions(companies); // Atualiza as opções com os dados das empresas
  };

  const handleClose = () => {
    setOpen(false);
    setOptions([]);
  };

  return (
    <div className="w-72 flex flex-col justify-center">
      <Autocomplete
        multiple
        sx={{ width: 300, backgroundColor: '#333' }}
        open={open}
        onOpen={handleOpen}
        onClose={handleClose}
        id="checkboxes-tags-demo"
        loading={loading}
        options={options}
        disableCloseOnSelect
        getOptionLabel={(option) => option.company_name}
        value={value}
        onChange={(event, newValue) => setValue(newValue)} // Atualiza o valor quando o usuário seleciona opções
        renderOption={(props, option, { selected }) => {
          const { key, ...optionProps } = props;
          return (
            <li key={key} {...optionProps} className="text-[#FFEF5E] bg-[#333]">
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
            label="Select Companies"
            placeholder="Favorites"
            slotProps={{
              input: {
                ...params.InputProps,
                endAdornment: (
                  <Fragment>
                    {loading ? (
                      <CircularProgress color="inherit" size={20} />
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
  );
}
