'use client';

import { GraphReport } from '@/src/model/reports';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { useEffect, useState, useMemo } from 'react';

type Props = {
  graphReport: GraphReport[];
};

const COLORS = [
  '#3B82F6',
  '#10B981',
  '#F59E0B',
  '#F43F5E',
  '#8B5CF6',
  '#EC4899'
];

// Custom Legend to show value and label clearly
const CustomLegend = (props: any) => {
  const { companies } = props;
  return (
    <ul className="text-xs space-y-1 mt-2 max-h-32 overflow-y-auto custom-scrollbar">
      {companies.map((entry: any, index: number) => (
        <li key={`item-${index}`} className="flex items-center gap-2">
          <span
            className="w-2 h-2 rounded-full shrink-0"
            style={{ backgroundColor: COLORS[index % COLORS.length] }}
          />
          <span className="text-gray-300 truncate flex-1" title={entry.name}>
            {entry.name}
          </span>
          <span className="font-mono text-gray-400">{entry.value}</span>
        </li>
      ))}
    </ul>
  );
};

export default function CategoryBreakdown({ graphReport }: Props) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Process and sort data once (memoized)
  const processedData = useMemo(() => {
    return graphReport.map((graphic) => {
      const sortedCompanies = [...graphic.companies].sort((a, b) => {
        // Normalize strings for comparison
        const nameA = a.name ? a.name.trim().toLowerCase() : '';
        const nameB = b.name ? b.name.trim().toLowerCase() : '';

        const isSpecialA = nameA === 'brancos' || nameA === 'outros';
        const isSpecialB = nameB === 'brancos' || nameB === 'outros';

        if (isSpecialA && !isSpecialB) return 1; // A is special (brancos/outros), goes to bottom (after B)
        if (!isSpecialA && isSpecialB) return -1; // B is special, A goes before B

        // If both are normal or both are special, sort by value descending (highest votes first)
        return Number(b.value) - Number(a.value);
      });
      return {
        ...graphic,
        companies: sortedCompanies
      };
    });
  }, [graphReport]);

  return (
    <section className="mb-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 px-1">
        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">
          Detalhamento por Categoria
        </h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {processedData.map((graphic, gIndex) => {
          return (
            <div
              key={graphic.category_name + gIndex}
              className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col"
            >
              <h4
                className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-4 text-center truncate px-2"
                title={graphic.category_name}
              >
                {graphic.category_name}
              </h4>
              <div className="h-[300px] w-full relative flex items-center justify-center">
                {isMounted ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={graphic.companies}
                        cx="50%"
                        cy="40%"
                        innerRadius={40}
                        outerRadius={70}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {graphic.companies.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#1F2937',
                          borderColor: '#374151',
                          color: '#F3F4F6',
                          borderRadius: '8px',
                          fontSize: '12px'
                        }}
                        itemStyle={{ color: '#E5E7EB' }}
                      />
                      <Legend
                        content={<CustomLegend companies={graphic.companies} />}
                        verticalAlign="bottom"
                      />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="w-40 h-40 rounded-full border-8 border-gray-200 dark:border-gray-700 border-t-emerald-500 animate-spin"></div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
