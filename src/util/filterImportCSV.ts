import { ImportCSV } from '../model/import-csv';

export interface Csvimport {
  data: string[][];
  meta: string[];
  errors: string[];
}

export function filterImportCSV(csv: Csvimport) {
  const firstCollun = csv.data[0][0];
  console.log(firstCollun);
  const response: ImportCSV[] = [];
  if (
    firstCollun == '' ||
    cleanText('NOME FANTASIA') !== cleanText(firstCollun)
  ) {
    return false;
  }
  csv.data.filter((c) => {
    if (c[0].trim() == '') {
      return;
    }

    if (
      cleanText(c[0].trim()) == cleanText('NOME FANTASIA') ||
      cleanText(c[0].trim()) == cleanText('NOME FANTASIA')
    ) {
      return;
    }

    let category: string[] | null = null;

    if (c[4] !== '') {
      category = c[4].split('|');
    }
    const res: ImportCSV = {
      trade_name: c[0],
      company_name: c[1],
      associate: cleanText(c[2]) === 'sim' ? true : false,
      cnpj: c[3],
      category
    };
    response.push(res);
  });
  return response;
}

const cleanText = (text: string) => {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9\s]/g, '')
    .toLocaleLowerCase();
};

export function dividirEmLotes<T>(dados: T[], tamanhoLote: number): T[][] {
  const lotes = [];
  for (let i = 0; i < dados.length; i += tamanhoLote) {
    lotes.push(dados.slice(i, i + tamanhoLote));
  }
  return lotes;
}
