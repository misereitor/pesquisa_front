import { DictionaryEntry } from '@/model/dictionary';
import { Dispatch, SetStateAction, useState } from 'react';
import ListDictionary from './list-dictionary';
import FilterDictionary from './filter-dictionary';

type Props = {
  dictionaryData: DictionaryEntry[];
  setDictionary: Dispatch<SetStateAction<DictionaryEntry[]>>;
};

export default function Dictionary({ dictionaryData, setDictionary }: Props) {
  const [loading, setLoading] = useState(false);

  return (
    <div>
      <FilterDictionary
        loading={loading}
        setLoading={setLoading}
        dictionaryData={dictionaryData}
        setDictionary={setDictionary}
      />
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
