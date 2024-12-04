// import { Csvimport } from '@/types/types';

// export function filterImportCSVCategory(csv: Csvimport) {
//   const firstCollun = csv.data[0][0];
//   const collunNameValid = ['categoria'];
//   if (
//     firstCollun == '' ||
//     !collunNameValid.includes(firstCollun.toLocaleLowerCase())
//   ) {
//     return;
//   }
//   const csvFilter = csv.data.filter((c) => {
//     if (c[0].trim() == '') {
//       return;
//     }
//     if (
//       c[0].trim().toLocaleLowerCase() == 'categoria' ||
//       c[0].trim().toLocaleLowerCase() == 'categorias'
//     ) {
//       return;
//     }
//     return c;
//   });
//   return csvFilter;
// }

// export function filterImportCSVCompany(csv: Csvimport) {
//   const firstCollun = csv.data[0][0];
//   const collunNameValid = [
//     'nome fantasia',
//     'empresa',
//     'empresas',
//     'nome',
//     'fantasia'
//   ];
//   if (
//     firstCollun == '' ||
//     !collunNameValid.includes(firstCollun.toLocaleLowerCase())
//   ) {
//     return;
//   }
//   const csvFilter = csv.data.filter((c) => {
//     if (c[0].trim() == '') {
//       return;
//     }
//     if (
//       c[0].trim().toLocaleLowerCase() == 'nome fantasia' ||
//       c[0].trim().toLocaleLowerCase() == 'empresa' ||
//       c[0].trim().toLocaleLowerCase() == 'empresas'
//     ) {
//       return;
//     }
//     return c;
//   });
//   return csvFilter;
// }
