import { Company } from './company';

export interface Category {
  id: number;
  name: string;
  companies?: Company[];
}

export interface AssociationCategoryCompany {
  id_category: number;
  id_company: number;
}
