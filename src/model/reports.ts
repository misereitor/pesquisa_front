export interface CategoryVotes {
  category_name: string;
  companies: CategoryVotesCompany[];
}

export interface CategoryVotesCompany {
  name: string;
  value: number;
}

export interface TotalCountForUser {
  total_items: number;
  total_confirmed_true: number;
  total_confirmed_false: number;
  total_percentage_above_70: number;
  total_percentage_below_70: number;
}

export interface TotalCountForCity {
  city: string;
  total: number;
}

export interface DadaDashboardCOmpanyVotes {
  name: string;
  amt: number;
  Brancos: number;
  Validos: number;
}
