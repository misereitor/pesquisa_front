import { ImportCSV } from '@/src/model/import-csv';
import { regexCNPJ } from '@/src/util/dataProcessing';
import {
  Csvimport,
  dividirEmLotes,
  filterImportCSV
} from '@/src/util/filterImportCSV';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { importCompanyAndCategoryService } from '@/src/service/import-service';
import { Button } from '@mui/material';
import { CiImport } from 'react-icons/ci';

type Props = {
  seCsvTransform: Dispatch<SetStateAction<ImportCSV[] | null>>;
  csvTransform: ImportCSV[] | null;
  importCSV: Csvimport | null;
  setOpenModal: Dispatch<SetStateAction<boolean>>;
  setOpenModalProgress: Dispatch<SetStateAction<boolean>>;
  setProgress: Dispatch<SetStateAction<number>>;
};
export default function ModalListImport({
  csvTransform,
  seCsvTransform,
  importCSV,
  setOpenModal,
  setOpenModalProgress,
  setProgress
}: Props) {
  const [loading, setLoading] = useState(false);
  const [processando, setProcessando] = useState(true);

  useEffect(() => {
    // Adiciona um evento "beforeunload" quando o processo está ativo
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (processando) {
        e.preventDefault();
        e.returnValue = ''; // Alguns navegadores exigem essa linha para exibir o alerta.
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      // Remove o evento ao desmontar o componente
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [processando]);

  useEffect(() => {
    if (importCSV) {
      const filter = filterImportCSV(importCSV);
      if (filter) {
        seCsvTransform(filter);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [importCSV]);

  if (importCSV == null) {
    return (
      <div>
        <div>
          <h2>Falha ao carregar o CSV</h2>
        </div>
        <div className="mt-2">
          <button type="button" onClick={() => setOpenModal(false)}>
            Voltar
          </button>
        </div>
      </div>
    );
  }

  if (csvTransform === null) {
    return (
      <div>
        <div>
          <h2>Arquivo CVS incompatível</h2>
        </div>
        <div className="mt-2">
          <button type="button" onClick={() => setOpenModal(false)}>
            Voltar
          </button>
        </div>
      </div>
    );
  }

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setOpenModalProgress(true);
      setOpenModal(false);
      if (csvTransform.length < 20) {
        await importCompanyAndCategoryService(csvTransform);
        setProgress(100);
      }
      const partition = dividirEmLotes(csvTransform, 20);
      const totalPartition = partition.length;
      for (let i = 0; i < totalPartition; i++) {
        await importCompanyAndCategoryService(partition[i]);
        setProgress(((i + 1) / totalPartition) * 100);
      }
      setProcessando(false);
      setTimeout(() => {
        location.reload();
      }, 1000);
    } catch (error: any) {
      console.error('Error in handleSubmitForm:', error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div>
      <div className="w-[900px]">
        <div>
          <table className="w-full border-collapse text-sm">
            <thead className="bg-neutral-800  text-left border-b-2 border-black">
              <tr>
                <th className="py-3 px-4 text-[#FFDE5E] border-r-2 border-gray-700">
                  Nome Fantasia
                </th>
                <th className="py-3 px-4 text-center text-[#FFDE5E] w-48 border-r-2 border-gray-700">
                  Razão Social
                </th>
                <th className="py-3 px-4 text-center text-[#FFDE5E] w-10 border-r-2 border-gray-700">
                  Associada
                </th>
                <th className="py-3 px-4 text-center text-[#FFDE5E] w-36 border-r-2 border-gray-700">
                  CNPJ
                </th>
                <th className="py-3 px-4 text-center text-[#FFDE5E] w-52">
                  Categorias
                </th>
              </tr>
            </thead>
            <tbody>
              {csvTransform.map((elemento, index) => (
                <tr
                  key={index}
                  className={`${
                    index % 2 === 0 ? 'bg-neutral-700' : 'bg-neutral-600'
                  } hover:bg-gray-500`}
                >
                  <td className="border-r-2 border-gray-800">
                    {elemento.trade_name}
                  </td>
                  <td className="border-r-2 border-gray-800">
                    {elemento.company_name}
                  </td>
                  <td className="border-r-2 border-gray-800 text-center">
                    {elemento.associate ? 'SIM' : 'NÃO'}
                  </td>
                  <td className="border-r-2 border-gray-800">
                    {regexCNPJ(elemento.cnpj)}
                  </td>
                  <td>
                    {elemento.category
                      ? elemento.category.map((c, index) =>
                          index === elemento.category!.length - 1 ? c : `${c}, `
                        )
                      : ''}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-10 fixed bottom-10 left-10">
          <button
            type="button"
            className={`py-2.5 px-6 mr-2 text-sm font-medium text-[#7f5d00] bg-[#ffe45f] rounded 
            hover:bg-[#fce98c] hover:text-[#7f5d00] inline-flex items-center justify-center
            disabled:bg-[#fdf9e5] disabled:cursor-default `}
            onClick={() => setOpenModal(false)}
          >
            Cancelar
          </button>
        </div>
        <div className="mt-10 fixed bottom-10 right-10">
          <Button
            data-testid="comecar"
            size="medium"
            color="success"
            type="button"
            endIcon={<CiImport />}
            loading={loading}
            onClick={handleSubmit}
            loadingPosition="end"
            variant="contained"
            sx={{
              color: '#ffffff',
              backgroundColor: '#c2410c !important',
              '&.Mui-disabled': {
                color: '#fdba74',
                backgroundColor: '#fdba74 !important'
              }
            }}
          >
            <span>Importar</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
