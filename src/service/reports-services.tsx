'use server';
import { unstable_noStore as noStore } from 'next/cache';
import { CategoryVotes, TotalCountForUser, TotalCountForCity, GraphReport, CategoryReports } from '../../src/model/reports';
import { UserVote } from '../../src/model/user-voting';

const { API_URL, X_API_KEY } = process.env;

export async function getAllDataDashboard() {
  noStore();
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
        graphReport: GraphReport[];
      };
      return data.data as Data;
    }
    const error = new Error(data.message || 'Erro desconhecido');
    error.name = 'ApiError';
    error.message = data.message;
    throw error;
  } catch (error) {
    console.error('Error in getAllDataDashboard:', error);
    throw error;
  }
}

export async function getAllDataGraph() {
  noStore();
  try {
    const response = await fetch(
      `${API_URL}/api/reports/dashboard/graph-report`,
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
      return data.data as GraphReport[];
    }
    const error = new Error(data.message || 'Erro desconhecido');
    error.name = 'ApiError';
    error.message = data.message;
    throw error;
  } catch (error) {
    console.error('Error in getAllDataDashboard:', error);
    throw error;
  }
}

export async function getAllDataReportGeral(limit: number, offset: number) {
  noStore();
  try {
    const response = await fetch(
      `${API_URL}/api/reports/get-all-data-report-geral?limit=${limit}&offset=${offset}`,
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
      total: number;
    };
    if (response.ok) {
      return data.data as Data;
    }
    const error = new Error(data.message || 'Erro desconhecido');
    error.name = 'ApiError';
    error.message = data.message;
    throw error;
  } catch (error) {
    console.error('Error in getAllDataReportGeral:', error);
    throw error;
  }
}

export async function getAllDataReportCategory() {
  noStore();
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
    const error = new Error(data.message || 'Erro desconhecido');
    error.name = 'ApiError';
    error.message = data.message;
    throw error;
  } catch (error) {
    console.error('Error in getAllDataReportCategory:', error);
    throw error;
  }
}

export async function getAllDataReportCity() {
  noStore();
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
    const error = new Error(data.message || 'Erro desconhecido');
    error.name = 'ApiError';
    error.message = data.message;
    throw error;
  } catch (error) {
    console.error('Error in getAllDataReportCity:', error);
    throw error;
  }
}

export async function getAllDataReportPercentagem() {
  noStore();
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
    const error = new Error(data.message || 'Erro desconhecido');
    error.name = 'ApiError';
    error.message = data.message;
    throw error;
  } catch (error) {
    console.error('Error in getAllDataReportPercentagem:', error);
    throw error;
  }
}
