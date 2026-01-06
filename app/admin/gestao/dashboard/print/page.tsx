'use client';

import { GraphReport } from '@/src/model/reports';
import { getAllDataGraph } from '@/src/service/reports-services';
import { useEffect, useState } from 'react';
import { Cell, Legend, LegendProps, Pie, PieChart, Tooltip } from 'recharts';
import './print.css';
import { Payload } from 'recharts/types/component/DefaultTooltipContent';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#f54254'];
const RADIAN = Math.PI / 180;
type Render = {
  cx?: number;
  cy?: number;
  midAngle?: number;
  innerRadius?: number;
  outerRadius?: number;
  percent?: number;
  index: number;
  value?: number;
};
interface CustomLegendProps extends Omit<LegendProps, 'payload'> {
  payload: Payload<any, any>[];
}
const renderCustomizedLabel = (props: Render) => {
  const {
    cx = 0,
    cy = 0,
    midAngle = 0,
    outerRadius = 0,
    percent = 0,
    index
  } = props;

  const labelPosition = {
    x: cx + (outerRadius + 25) * Math.cos(-midAngle * RADIAN),
    y: cy + (outerRadius + 25) * Math.sin(-midAngle * RADIAN)
  };

  return (
    <text
      x={labelPosition.x}
      y={labelPosition.y}
      fill={COLORS[index % COLORS.length]}
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

export default function Print() {
  const [graph, setGraph] = useState<GraphReport[] | null>(null);
  useEffect(() => {
    const getData = async () => {
      const response = await getAllDataGraph();
      setGraph(response);
    };
    getData();
  }, []);

  return (
    <section className="flex px-4 flex-wrap">
      {graph &&
        graph.map((graphic) => (
          <div key={graphic.category_name} className=" w-full px-1 mb-1">
            <div className="h-[340px] bg-gray-700 rounded text-sm flex justify-center my-1 first:mt-5">
              <div className="print">
                <div className="h-1 w-full text-center mb-3">
                  <p className="text-yellow-500 font-bold max-w-[400px] mx-auto">
                    {graphic.category_name}
                  </p>
                </div>
                <PieChart width={500} height={220}>
                  <Pie
                    data={graphic.companies}
                    cx={248}
                    cy={100}
                    outerRadius={70}
                    isAnimationActive={false}
                    fill="#8884d"
                    dataKey="value"
                    label={(props) =>
                      renderCustomizedLabel({ ...props, index: props.index })
                    }
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
                    width={450}
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
