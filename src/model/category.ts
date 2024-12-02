import { company } from './company';

export interface category {
  id?: number;
  category: string;
  companies?: company[];
}
