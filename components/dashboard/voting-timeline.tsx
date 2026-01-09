'use client';

import { UserVote } from '@/src/model/user-voting';
import { dateTrasnform } from '@/src/util/dateTransform';
import { InputMask } from '@react-input/mask';
import { useEffect, useState } from 'react';
import { MdChevronRight, MdKeyboardArrowLeft } from 'react-icons/md';
import {
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Area,
  AreaChart,
  ResponsiveContainer
} from 'recharts';

type Props = {
  usersVote: UserVote[];
};
const inputOptions = {
  mask: '__/__/____',
  replacement: { _: /\d/ }
};

export default function VotingTimeline({ usersVote }: Props) {
  const dateNow = new Date();
  const data = dateTrasnform(usersVote, dateNow.toLocaleDateString());
  const [date, setDate] = useState(dateNow.toLocaleDateString());
  const [dataNow, setDataNow] = useState(data);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    alterDate(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date]);

  const alterDate = (value: number) => {
    if (date == 'Invalid Date') {
      setDate(dateNow.toLocaleDateString());
      const dateSplit = dateNow.toLocaleDateString().split('/');
      const dateISO = `${dateSplit[1]}/${dateSplit[0]}/${dateSplit[2]}`;
      const dateUpdate = new Date(dateISO);
      const d = dateUpdate.setDate(dateUpdate.getDate() + value);
      setDate(new Date(d).toLocaleDateString());
      setDataNow(data);
      return;
    }
    const dateSplit = date.split('/');
    const dateISO = `${dateSplit[1]}/${dateSplit[0]}/${dateSplit[2]}`;
    const dateUpdate = new Date(dateISO);
    const d = dateUpdate.setDate(dateUpdate.getDate() + value);
    const newDate = new Date(d).toLocaleDateString();
    const dataTree = dateTrasnform(usersVote, newDate);
    setDataNow(dataTree);
    if (value !== 0) {
      setDate(newDate);
      return;
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDate(e.target.value);
  };

  return (
    <section className="mb-6">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">
            Linha do Tempo de Votos
          </h3>
          <div className="flex items-center gap-2 mt-4 md:mt-0 bg-gray-50 dark:bg-gray-700 p-2 rounded-lg">
            <button
              onClick={() => alterDate(-1)}
              className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full transition-colors"
            >
              <MdKeyboardArrowLeft
                size={24}
                className="text-gray-600 dark:text-gray-300"
              />
            </button>
            <InputMask
              {...inputOptions}
              onChange={handleChange}
              value={date}
              className="w-24 text-center bg-transparent text-gray-800 dark:text-gray-200 font-medium outline-none"
            />
            <button
              onClick={() => alterDate(1)}
              className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full transition-colors"
            >
              <MdChevronRight
                size={24}
                className="text-gray-600 dark:text-gray-300"
              />
            </button>
          </div>
        </div>

        <div className="h-[350px] w-full">
          {isMounted ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={dataNow}
                margin={{
                  top: 10,
                  right: 30,
                  left: 0,
                  bottom: 0
                }}
              >
                <defs>
                  <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#374151"
                  opacity={0.3}
                />
                <XAxis
                  dataKey="name"
                  tickFormatter={(value) => value.slice(0, 2)}
                  tick={{ fill: '#9CA3AF' }}
                  axisLine={false}
                  tickLine={false}
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
                />
                <Area
                  type="monotone"
                  dataKey="uv"
                  stroke="#8B5CF6"
                  fillOpacity={1}
                  fill="url(#colorUv)"
                  strokeWidth={3}
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="w-full h-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse relative overflow-hidden">
              <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent skew-x-12 -translate-x-full animate-shimmer"></div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
