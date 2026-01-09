'use client';

import { TotalCountForUser } from '@/src/model/reports';
import StatCard from './stat-card';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { Box, Fab } from '@mui/material';
import Link from 'next/link';
import PrintIcon from '@mui/icons-material/Print';
import {
  FaCheckCircle,
  FaVoteYea,
  FaPercentage,
  FaUsers
} from 'react-icons/fa';
import { useEffect, useState } from 'react';

type Props = {
  countVotes: TotalCountForUser;
};

const COLORS_VOTES = ['#10B981', '#6B7280']; // Emerald, Gray
const COLORS_PERCENTAGE = ['#8B5CF6', '#F59E0B']; // Violet, Amber

export default function DashboardSummary({ countVotes }: Props) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const dataVotes = [
    { name: 'Votados', value: Number(countVotes.total_confirmed_true) },
    { name: 'Não Votados', value: Number(countVotes.total_confirmed_false) }
  ];

  const dataPercentage = [
    {
      name: '> 70%',
      value: Number(countVotes.total_percentage_above_70)
    },
    {
      name: '< 70%',
      value: Number(countVotes.total_percentage_below_70)
    }
  ];

  return (
    <section className="mb-8">
      {/* Floating Print Button - Kept as per original functionality */}
      <Box
        sx={{
          position: 'fixed',
          bottom: 25,
          right: 25,
          zIndex: 50
        }}
      >
        <Fab color="primary" aria-label="print">
          <Link href={'/admin/gestao/dashboard/print'} target="_blank">
            <PrintIcon />
          </Link>
        </Fab>
      </Box>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Total de Cadastros"
          value={countVotes.total_items}
          icon={<FaUsers size={20} />}
          color="blue"
        />
        <StatCard
          title="Votos Confirmados"
          value={countVotes.total_confirmed_true}
          icon={<FaCheckCircle size={20} />}
          color="emerald"
          description={`${(
            (Number(countVotes.total_confirmed_true) /
              Number(countVotes.total_items)) *
            100
          ).toFixed(1)}% do total`}
        />
        <StatCard
          title="Acima de 70%"
          value={countVotes.total_percentage_above_70}
          icon={<FaVoteYea size={20} />}
          color="indigo"
        />
        <StatCard
          title="Abaixo de 70%"
          value={countVotes.total_percentage_below_70}
          icon={<FaPercentage size={20} />}
          color="amber"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Chart 1: Votes Status */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4">
            Status dos Votos
          </h3>
          <div className="h-64 w-full flex items-center justify-center">
            {isMounted ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={dataVotes}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {dataVotes.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS_VOTES[index % COLORS_VOTES.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1F2937',
                      borderColor: '#374151',
                      color: '#F3F4F6',
                      borderRadius: '8px'
                    }}
                    itemStyle={{ color: '#E5E7EB' }}
                  />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-32 h-32 rounded-full border-8 border-gray-200 dark:border-gray-700 border-t-emerald-500 animate-spin"></div>
            )}
          </div>
        </div>

        {/* Chart 2: Percentage Distribution */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4">
            Distribuição por Porcentagem
          </h3>
          <div className="h-64 w-full flex items-center justify-center">
            {isMounted ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={dataPercentage}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {dataPercentage.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={
                          COLORS_PERCENTAGE[index % COLORS_PERCENTAGE.length]
                        }
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1F2937',
                      borderColor: '#374151',
                      color: '#F3F4F6',
                      borderRadius: '8px'
                    }}
                    itemStyle={{ color: '#E5E7EB' }}
                  />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-32 h-32 rounded-full border-8 border-gray-200 dark:border-gray-700 border-t-emerald-500 animate-spin"></div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
