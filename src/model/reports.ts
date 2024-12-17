export interface VotesReports {
  id_company: number;
  id_category: number;
  company_name: string;
  category_name: string;
}

export interface CategoryVotes {
  category_name: string;
  total_votes: number;
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

export interface CategoryReports {
  id: number;
  name: string;
  active: boolean;
}
