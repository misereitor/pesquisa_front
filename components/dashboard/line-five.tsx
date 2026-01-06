'use client';
import { GraphReport } from '@/src/model/reports';
import { PieChart, Pie, Cell, Tooltip, Legend, LegendProps } from 'recharts';
import { Payload } from 'recharts/types/component/DefaultTooltipContent';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#f54254'];
const RADIAN = Math.PI / 180;

interface CustomLegendProps extends Omit<LegendProps, 'payload'> {
  payload: Payload<any, any>[];
}
const renderCustomizedLabel = (props: any) => {
  const {
    cx = 0,
    cy = 0,
    midAngle = 0,
    outerRadius = 0,
    percent = 0
  } = props;

  const labelPosition = {
    x: cx + (outerRadius + 25) * Math.cos(-midAngle * RADIAN),
    y: cy + (outerRadius + 25) * Math.sin(-midAngle * RADIAN)
  };

  return (
    <text
      x={labelPosition.x}
      y={labelPosition.y}
      fill="white"
      textAnchor={labelPosition.x > cx ? 'start' : 'end'}
      dominantBaseline="central"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const CustomLegend = ({ payload }: CustomLegendProps) => (
  <ul>
    {payload.map((entry, index) => (
      <li key={`item-${index}`} style={{ color: entry.color }}>
        <span>{entry.value}</span>: {entry.payload?.value} Votos
      </li>
    ))}
  </ul>
);

type Props = {
  graphReport: GraphReport[];
};

export default function LineFiveDashboard({ graphReport }: Props) {
  return (
    <section className="flex my-4 px-4 flex-wrap">
      {graphReport.map((graphic) => (
        <div
          key={graphic.category_name}
          className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 px-1 mb-1"
        >
          <div className="h-[500px] bg-gray-700 rounded text-sm flex justify-center">
            <div>
              <div className="h-1 w-11/12 text-center mb-7 mt-3">
                <p className="text-yellow-500 font-bold">
                  {graphic.category_name}
                </p>
              </div>
              <PieChart width={250} height={270}>
                <Pie
                  data={graphic.companies}
                  cx={120}
                  cy={130}
                  outerRadius={65}
                  isAnimationActive={false}
                  fill="#8884d8"
                  dataKey="value"
                  label={renderCustomizedLabel}
                >
                  {graphic.companies.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend
                  verticalAlign="bottom"
                  align="left"
                  width={200}
                  height={1}
                  layout="radial"
                  content={<CustomLegend payload={graphic.companies} />}
                />
              </PieChart>
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}
