import {
  CategoryVotes,
  TotalCountForCity,
  TotalCountForUser
} from '@/model/reports';
import { UserVote } from '@/model/user-voting';

const { API_URL, X_API_KEY } = process.env;

export async function getAllDataDashboard() {
  try {
    const response = await fetch(`${API_URL}/api/voting/dashboard`, {
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
