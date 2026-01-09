'use client';

import { CategoryVotes } from '@/src/model/reports';
import {
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ReferenceLine,
  ResponsiveContainer,
  Bar,
  Cell,
  Brush
} from 'recharts';
import { useEffect, useState } from 'react';

type Props = {
  votesCategory: CategoryVotes[];
};

export default function CategoryPerformance({ votesCategory }: Props) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <section className="mb-6">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-6">
          Desempenho por Categoria
        </h3>
        <div className="h-[400px] w-full flex items-end justify-center">
          {isMounted ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={votesCategory}
                margin={{
                  top: 20,
                  right: 30,
                  left: 10,
                  bottom: 80
                }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#374151"
                  opacity={0.3}
                />
                <XAxis
                  dataKey="category_name"
                  tick={false}
                  axisLine={false}
                  tickLine={false}
                  height={10}
                />
                <YAxis
                  tick={{ fill: '#9CA3AF' }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    borderColor: '#374151',
                    color: '#F3F4F6',
                    borderRadius: '8px'
                  }}
                  itemStyle={{ color: '#E5E7EB' }}
                  cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                />
                <Legend
                  verticalAlign="top"
                  wrapperStyle={{ paddingBottom: '20px' }}
                />
                <ReferenceLine y={0} stroke="#4B5563" />
                <Brush
                  dataKey="category_name"
                  height={30}
                  stroke="#6366f1"
                  tickFormatter={() => ''}
                  endIndex={
                    votesCategory.length > 20 ? 20 : votesCategory.length - 1
                  }
                />
                <Bar
                  dataKey="total"
                  name="Total de Votos"
                  radius={[4, 4, 0, 0]}
                >
                  {votesCategory.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill="#6366f1" />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="w-full h-full flex items-end gap-1 px-4 pb-4 animate-pulse">
              {[...Array(20)].map((_, i) => (
                <div
                  key={i}
                  className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-t"
                  style={{ height: `${Math.random() * 80 + 20}%` }}
                ></div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
