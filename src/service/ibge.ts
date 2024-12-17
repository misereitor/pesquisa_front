import { City } from '@/model/city';

export async function getCitiesBrazil(uf: string) {
  try {
    const response = await fetch(
      `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios`
    );
    if (response.ok) {
      const data = await response.json();
      const cities: City[] = data.map((e: any) => {
        return {
          id: e.id,
          label: e.nome
        };
      });
      return cities;
    }
    throw new Error('Falha na api externa do IBGE');
  } catch (error) {
    console.error('Erro ao fazer a requisição:', error);
    throw error;
  }
}
