'use client';

import TablePaginationReportGeral from '@/components/reports/geral/table-pagination';
import { CategoryReports } from '@/model/reports.js';
import { UserVote } from '@/model/user-voting.js';
import { getAllDataReportGeral } from '@/service/reports-services';
import { useEffect, useState } from 'react';

const { API_URL, X_API_KEY } = process.env;

export default function RelatorioGeral() {
  const [categories, setCategories] = useState<CategoryReports[]>([]);
  const [usersVote, setUsersVote] = useState<UserVote[]>([]);
  const [total, setTotal] = useState(0);
  const [limit, setLimit] = useState(50);
  const [offset, setOffset] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      const newData = await getAllDataReportGeral(limit, offset);
      if (newData) {
        setCategories(newData.categories);
        setUsersVote(newData.usersVote);
        setTotal(newData.total);
      }
      setLoading(false);
    };
    getData();
  }, [limit, offset]);

  return (
    <TablePaginationReportGeral
      loading={loading}
      limit={limit}
      offset={offset}
      setLimit={setLimit}
      setOffset={setOffset}
      total={total}
      apiUrl={String(API_URL)}
      categories={categories}
      usersVote={usersVote}
      xapikey={String(X_API_KEY)}
    />
  );
}
