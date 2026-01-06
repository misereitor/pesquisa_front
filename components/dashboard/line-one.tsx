'use client';
import { TotalCountForUser } from '@/src/model/reports';
import { Box, Fab } from '@mui/material';
import Link from 'next/link';
import { PieChart, Pie, Cell, Tooltip, Legend, PieLabelRenderProps } from 'recharts';
import PrintIcon from '@mui/icons-material/Print';

type Props = {
  countVotes: TotalCountForUser;
};

const COLORS = ['#00C49F', '#FFBB28'];

const renderCustomizedLabel = (props: PieLabelRenderProps) => {
  const {
    cx = 0,
    cy = 0,
    midAngle = 0,
    innerRadius = 0,
    outerRadius = 0,
    percent = 0
  } = props;

  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
  const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? 'start' : 'end'}
      dominantBaseline="central"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

export default function LineOneDashboard({ countVotes }: Props) {
  const data = [
    { name: 'VOTADOS', value: Number(countVotes.total_confirmed_true) },
    { name: 'NÃO VOTADOS', value: Number(countVotes.total_confirmed_false) }
  ];
  const data2 = [
    {
      name: 'ACIMA DE 70%',
      value: Number(countVotes.total_percentage_above_70)
    },
    {
      name: 'ABAIXO DE 70%',
      value: Number(countVotes.total_percentage_below_70)
    }
  ];
  return (
    <section id="1">
      <Box
        sx={{
          position: 'fixed',
          bottom: 25,
          right: 25,
          zIndex: 10
        }}
      >
        <Fab size="medium" color="secondary" aria-label="add">
          <Link href={'/admin/gestao/dashboard/print'} target="_blank">
            <PrintIcon />
          </Link>
        </Fab>
      </Box>
      <div className="flex m-4 gap-2">
        <div className="flex-1 px-2 justify-center bg-gray-700 shadow rounded">
          <div className="">
            <p className="text-green-300 font-bold">
              Total de cadastros: {countVotes.total_items}
            </p>
            <div className="flex justify-center">
              <PieChart width={400} height={160} id="piechart-unique-id1">
                <Pie
                  data={data}
                  cx={200}
                  cy={60}
                  labelLine={false}
                  label={renderCustomizedLabel}
                  outerRadius={60}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {data.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </div>
          </div>
        </div>
        <div className="flex-1 px-2 justify-center bg-gray-700 shadow rounded">
          <div className="">
            <p className="text-green-300 font-bold">
              Porcentagem de votos: {data2[0].value} acima - {data2[1].value}{' '}
              abaixo de 70%
            </p>
            <div className="flex justify-center">
              <PieChart width={400} height={160} id="piechart-unique-id2">
                <Pie
                  data={data2}
                  cx={200}
                  cy={60}
                  labelLine={false}
                  label={renderCustomizedLabel}
                  outerRadius={60}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {data2.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
