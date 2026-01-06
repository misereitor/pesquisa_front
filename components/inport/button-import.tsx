import { Csvimport } from '@/src/util/filterImportCSV';
import { CSSProperties, Dispatch, SetStateAction } from 'react';
import { CiImport } from 'react-icons/ci';
import { useCSVReader } from 'react-papaparse';

const styles = {
  csvReader: {
    display: 'flex',
    flexDirection: 'row',
    marginBottom: 0
  } as CSSProperties,
  browseFile: {
    width: '20%'
  } as CSSProperties,
  acceptedFile: {
    border: '1px solid #ccc',
    height: 45,
    lineHeight: 2.5,
    paddingLeft: 10,
    width: '80%'
  } as CSSProperties,
  remove: {
    borderRadius: 0,
    padding: '0 20px'
  } as CSSProperties,
  progressBarBackgroundColor: {
    backgroundColor: 'red'
  } as CSSProperties
};

type Props = {
  setImportCSV: Dispatch<SetStateAction<Csvimport | null>>;
  setOpenModalInsert: Dispatch<SetStateAction<boolean>>;
};

export default function ButtonImport({
  setImportCSV,
  setOpenModalInsert
}: Props) {
  const { CSVReader } = useCSVReader();
  const updateCSV = (result: any) => {
    setImportCSV(result);
    setOpenModalInsert(true);
  };
  return (
    <div>
      <CSVReader
        onUploadAccepted={updateCSV}
        config={{ encoding: 'ISO-8859-1', delimiter: ';' }}
      >
        {({ getRootProps }: any) => (
          <>
            <div style={styles.csvReader}>
              <button
                type="button"
                {...getRootProps()}
                className="px-4 py-2 bg-[#FFDE5E] h-12 text-black rounded-md hover:bg-yellow-600 transition flex items-center"
              >
                Importar
                <CiImport className="ml-2" size={20} />
              </button>
            </div>
          </>
        )}
      </CSVReader>
    </div>
  );
}
