import { DictionaryEntry } from '@/model/dictionary';
import { Dispatch, SetStateAction, useState } from 'react';
import { RxTrash } from 'react-icons/rx';
import LoadingButton from '../button/loading-button';
import {
  deleteDictionaryService,
  updateDictionaryService
} from '@/service/dictionary';

type Props = {
  setLoading: Dispatch<SetStateAction<boolean>>;
  loading: boolean;
  dictionary: DictionaryEntry;
  dictionaryData: DictionaryEntry[];
  setDictionary: Dispatch<SetStateAction<DictionaryEntry[]>>;
};

export default function ListDictionary({
  loading,
  setLoading,
  dictionary,
  dictionaryData,
  setDictionary
}: Props) {
  const [textArea, setTextArea] = useState<string>(dictionary.synonyms.join());
  const [edit, setEdit] = useState(false);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      dictionary.synonyms = textArea.split(',');
      await updateDictionaryService(dictionary);
      const updateDictionary = dictionaryData.map((e) => {
        if (e.key_word === dictionary.key_word) {
          return dictionary;
        }
        return e;
      });
      setDictionary(updateDictionary);
      setEdit(false);
    } catch (error: any) {
      console.error('Error in handleSubmitForm:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async () => {
    try {
      setLoading(true);
      const confirm = window.confirm(
        `Deseja realmente remover ${dictionary.key_word}?`
      );
      if (!confirm) return;
      await deleteDictionaryService(dictionary);
      const updateDictionary = dictionaryData.filter(
        (e) => e.key_word !== dictionary.key_word
      );
      setDictionary(updateDictionary);
    } catch (error: any) {
      console.error('Error in handleSubmitForm:', error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <tbody>
      <tr className="bg-neutral-700 hover:bg-gray-500">
        <th className="py-3 px-4 w-36 text-left">{dictionary.key_word}</th>
        <th className="cursor-pointer text-left">
          {edit ? (
            <div className="flex items-center justify-between">
              <textarea
                disabled={loading}
                className="w-full mt-1  rounded-md bg-[rgb(var(--background-input))] px-2"
                value={textArea}
                onChange={(e) => setTextArea(e.target.value)}
              />
              <LoadingButton
                onClick={handleSubmit}
                className="ml-4"
                loading={loading}
              >
                Salvar
              </LoadingButton>
            </div>
          ) : (
            <span onClick={() => setEdit(!edit)}>{textArea}</span>
          )}
        </th>
        <th className="py-3 px-4 w-10 text-center">
          <button type="button" disabled={loading} onClick={handleRemove}>
            <RxTrash
              size={24}
              className={`${loading && 'text-red-300'} text-red-600 cursor-pointer hover:text-red-800 transition-colors my-auto mx-auto`}
            />
          </button>
        </th>
      </tr>
    </tbody>
  );
}
