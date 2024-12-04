import { Company } from './company';

export interface category {
  id?: number;
  category: string;
  companies?: Company[];
}
