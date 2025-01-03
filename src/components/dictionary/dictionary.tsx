'use client';
import { DictionaryEntry } from '@/model/dictionary';
import { Dispatch, SetStateAction, useState } from 'react';
import ListDictionary from './list-dictionary';
import FilterDictionary from './filter-dictionary';
import { Company } from '@/model/company';
import InputAutocomplete from '../input/input-autocomplete';

type Props = {
  dictionaryData: DictionaryEntry[];
  setDictionary: Dispatch<SetStateAction<DictionaryEntry[]>>;
  companies: Company[];
};

export default function Dictionary({
  dictionaryData,
  setDictionary,
  companies
}: Props) {
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState('');
  const [companySelected, setCompanySelected] = useState<Company>();

  const handleSubmit = async () => {};
  return (
    <div>
      <FilterDictionary
        loading={loading}
        setLoading={setLoading}
        dictionaryData={dictionaryData}
        setDictionary={setDictionary}
      />
      <div className="w-full flex items-center justify-center pl-20 bg-neutral-800 h-16">
        <InputAutocomplete
          setValue={setValue}
          value={value}
          handleSubmit={handleSubmit}
          options={companies}
          companySelected={companySelected}
          setCompanySelected={setCompanySelected}
          dictionaryFromService={dictionaryData}
          name="outros"
        />
      </div>
      <div className="p-4 space-y-4 bg-neutral-700">
        <table className="w-full border-collapse text-sm">
          <thead className="bg-neutral-700 text-left border-b-2 border-black">
            <tr>
              <th className="py-3 px-4">Palavra</th>
              <th className="py-3 px-4 text-center">Sinônimos</th>
              <th className="py-3 px-4 text-center">Remover</th>
            </tr>
          </thead>

          {dictionaryData?.map((dictionary) => (
            <ListDictionary
              dictionaryData={dictionaryData}
              setDictionary={setDictionary}
              dictionary={dictionary}
              key={dictionary.key_word}
              loading={loading}
              setLoading={setLoading}
            />
          ))}
        </table>
      </div>
    </div>
  );
}
