import { Uf } from '@/model/uf';
import { getCitiesBrazil } from '@/service/ibge';

export function regexPhone(phone: string) {
  if (!phone) return '';
  phone = phone.replace(/\D/g, '');
  phone = phone.replace(/(\d{2})(\d)/, '($1) $2');
  phone = phone.replace(/(\d)(\d{4})$/, '$1-$2');
  return phone;
}

export function regexCPF(cpf: string) {
  const regex = /(\d{0,3})(\d{0,3})(\d{0,3})(\d{0,2})/;
  const x = cpf.replace(/\D/g, '').match(regex);
  const t = x
    ? x[2]
      ? x[1] + '.' + x[2] + (x[3] ? '.' : '') + x[3] + (x[4] ? '-' + x[4] : '')
      : x[1]
    : '';
  return t;
}

export async function filterCities(ufs: Uf[], state: string) {
  let citiesForUf;
  const uf: Uf[] = ufs?.filter((uf) => {
    return uf.nome.toLocaleLowerCase() === state.toLocaleLowerCase();
  });
  if (uf.length == 1) {
    citiesForUf = await getCitiesBrazil(uf[0].sigla);
  }
  return { citiesForUf, uf };
}
