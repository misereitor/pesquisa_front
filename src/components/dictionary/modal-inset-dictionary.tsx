import { DictionaryEntry } from '@/model/dictionary';
import { Dispatch, SetStateAction, useState } from 'react';
import LoadingButton from '../button/loading-button';
import InputSimple from '../input/input';
import { insertDictionaryService } from '@/service/dictionary';

type Props = {
  dictionaryData: DictionaryEntry[];
  setDictionary: Dispatch<SetStateAction<DictionaryEntry[]>>;
  setOpenModal: Dispatch<SetStateAction<boolean>>;
  setLoading: Dispatch<SetStateAction<boolean>>;
  loading: boolean;
};

export default function ModalInsertDictionary({
  dictionaryData,
  setDictionary,
  setOpenModal,
  loading,
  setLoading
}: Props) {
  const [keyWord, setKeyWord] = useState('');
  const [synonyms, setSynonyms] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError('');
      if (!keyWord) {
        setError('Informe uma palavra');
        return;
      }
      const keyWordExist = dictionaryData.filter((e) => e.key_word === keyWord);
      if (keyWordExist.length > 0) {
        setError('Palavra já está cadastrada');
        return;
      }
      const newDictionary: DictionaryEntry = {
        id: 0,
        key_word: keyWord,
        synonyms: synonyms.split(',')
      };
      const data = await insertDictionaryService(newDictionary);
      if (!data.success) {
        setError(data.message);
        return;
      }
      setDictionary([...dictionaryData, data.data]);
      setOpenModal(false);
    } catch (error: any) {
      console.error('Error in handleSubmitForm:', error);

      if (error.name === 'Error') {
        // Caso o backend tenha retornado uma mensagem de erro específica
        setError(error.message);
      } else {
        // Erro genérico (ex.: problemas de rede)
        setError('Ocorreu um erro inesperado. Tente novamente mais tarde.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex flex-col">
        <InputSimple
          className="rounded-md h-8"
          label="Palavra:"
          value={keyWord}
          onChange={(e) => setKeyWord(e.target.value)}
          errortext={error}
        />
        <span>Separe as palavras por virgura (palavra1,palavra2,...)</span>
        <textarea
          name="synonyms"
          id="synonyms"
          rows={5}
          cols={50}
          className="rounded-md bg-[rgb(var(--background-input))] px-2"
          value={synonyms}
          onChange={(e) => setSynonyms(e.target.value.replaceAll('\n', ''))}
        />
      </div>
      <div className="flex justify-between mt-10">
        <button type="button" onClick={() => setOpenModal(false)}>
          Cancelar
        </button>
        <LoadingButton loading={loading} onClick={handleSubmit}>
          Adicionar
        </LoadingButton>
      </div>
    </div>
  );
}
