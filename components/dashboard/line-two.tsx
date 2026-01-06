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
  Brush,
  Bar
} from 'recharts';

type Props = {
  votesCategory: CategoryVotes[];
};

export default function LineTwoDashboard({ votesCategory }: Props) {
  return (
    <section className="flex my-4 px-4 gap-3" id="2">
      <div className="w-full h-[430px] bg-gray-700 rounded">
        <p className="text-green-300 text-center">
          Total de votos por categoria
        </p>
        <div className="flex justify-center">
          <BarChart
            width={1300}
            height={400}
            data={votesCategory}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="category_name" />
            <YAxis />
            <Tooltip />
            <Legend verticalAlign="top" wrapperStyle={{ lineHeight: '40px' }} />
            <ReferenceLine y={0} stroke="#000" />
            <Brush
              endIndex={
                votesCategory.length > 30 ? 30 : votesCategory.length - 1
              }
              dataKey="category_name"
              height={30}
              stroke="#8884d8"
            />
            <Bar dataKey="total" fill="#8884d8" />
          </BarChart>
        </div>
      </div>
    </section>
  );
}
