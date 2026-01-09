import { ReactNode } from 'react';

type StatCardProps = {
  title: string;
  value: string | number;
  icon?: ReactNode;
  description?: string;
  trend?: {
    value: number;
    label: string;
  };
  color?: 'emerald' | 'blue' | 'amber' | 'rose' | 'indigo' | 'purple';
};

const colorMap = {
  emerald: 'bg-emerald-500/10 text-emerald-500',
  blue: 'bg-blue-500/10 text-blue-500',
  amber: 'bg-amber-500/10 text-amber-500',
  rose: 'bg-rose-500/10 text-rose-500',
  indigo: 'bg-indigo-500/10 text-indigo-500',
  purple: 'bg-purple-500/10 text-purple-500'
};

export default function StatCard({
  title,
  value,
  icon,
  description,
  color = 'indigo'
}: StatCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 p-4 md:p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col justify-between h-full transition-all hover:shadow-md">
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
            {title}
          </p>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {value}
          </h3>
        </div>
        {icon && (
          <div className={`p-3 rounded-lg ${colorMap[color]}`}>{icon}</div>
        )}
      </div>
      {description && (
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
          {description}
        </p>
      )}
    </div>
  );
}
