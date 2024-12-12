import { Dispatch, SetStateAction, useState } from 'react';
import { DictionaryEntry } from '@/model/dictionary';
import Modal from '../modal/modal';
import ModalInsertDictionary from './modal-inset-dictionary';

type Props = {
  dictionaryData: DictionaryEntry[];
  setDictionary: Dispatch<SetStateAction<DictionaryEntry[]>>;
  setLoading: Dispatch<SetStateAction<boolean>>;
  loading: boolean;
};

export default function FilterDictionary({
  dictionaryData,
  setDictionary,
  loading,
  setLoading
}: Props) {
  const [openModalAdd, setOpenModalAdd] = useState(false);
  return (
    <div>
      <Modal openModal={openModalAdd} setOpenModal={setOpenModalAdd}>
        <ModalInsertDictionary
          loading={loading}
          setLoading={setLoading}
          setOpenModal={setOpenModalAdd}
          dictionaryData={dictionaryData}
          setDictionary={setDictionary}
        />
      </Modal>
      <div className="bg-neutral-800 p-4 shadow-md mb-[2px]">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-[#FFDE5E] text-xl font-bold">Dicionário</h1>
          <div className="flex">
            <button
              onClick={() => setOpenModalAdd(true)}
              className="px-4 py-2 bg-[#FFDE5E] text-black rounded-md hover:bg-yellow-600 transition flex items-center ml-3"
            >
              Adicionar
              <span className="ml-2 text-sm">&#x2795;</span>{' '}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
