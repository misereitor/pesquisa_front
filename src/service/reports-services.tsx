import {
  CategoryReports,
  CategoryVotes,
  TotalCountForCity,
  TotalCountForUser
} from '@/model/reports';
import { UserVote } from '@/model/user-voting';

const { API_URL, X_API_KEY } = process.env;

export async function getAllDataDashboard() {
  try {
    const response = await fetch(`${API_URL}/api/reports/dashboard`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': String(X_API_KEY)
      }
    });
    const data = await response.json();
    if (response.ok) {
      type Data = {
        votesCategory: CategoryVotes[];
        countVotes: TotalCountForUser;
        usersVote: UserVote[];
        totalCity: TotalCountForCity[];
      };
      return data.data as Data;
    }
    throw new Error(data.message);
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export async function getAllDataReportGeral() {
  try {
    const response = await fetch(
      `${API_URL}/api/reports/get-all-data-report-geral`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-API-KEY': String(X_API_KEY)
        }
      }
    );
    const data = await response.json();
    type Data = {
      categories: CategoryReports[];
      usersVote: UserVote[];
    };
    if (response.ok) {
      return data.data as Data;
    }
    throw new Error(data.message);
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export async function getAllDataReportCategory() {
  try {
    const response = await fetch(
      `${API_URL}/api/reports/get-all-data-report-category`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-API-KEY': String(X_API_KEY)
        }
      }
    );
    const data = await response.json();
    if (response.ok) {
      return data.data as CategoryVotes[];
    }
    throw new Error(data.message);
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export async function getAllDataReportCity() {
  try {
    const response = await fetch(
      `${API_URL}/api/reports/get-all-data-report-city`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-API-KEY': String(X_API_KEY)
        }
      }
    );
    const data = await response.json();
    if (response.ok) {
      return data.data as TotalCountForCity[];
    }
    throw new Error(data.message);
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export async function getAllDataReportPercentagem() {
  try {
    const response = await fetch(
      `${API_URL}/api/reports/get-all-data-report-percentagem`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-API-KEY': String(X_API_KEY)
        }
      }
    );
    const data = await response.json();
    if (response.ok) {
      return data.data as UserVote[];
    }
    throw new Error(data.message);
  } catch (error: any) {
    throw new Error(error.message);
  }
}
