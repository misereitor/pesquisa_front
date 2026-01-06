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
  AreaChart
} from 'recharts';

type Props = {
  usersVote: UserVote[];
};
const inputOptions = {
  mask: '__/__/____',
  replacement: { _: /\d/ }
};

export default function LineThreeDashboard({ usersVote }: Props) {
  const dateNow = new Date();
  const data = dateTrasnform(usersVote, dateNow.toLocaleDateString());
  const [date, setDate] = useState(dateNow.toLocaleDateString());
  const [dataNow, setDataNow] = useState(data);

  useEffect(() => {
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
    setDate(e.target.value); // Atualiza o estado com o novo valor
  };

  return (
    <section className="flex my-4 px-4 gap-2 flex-wrap">
      <div className=" w-full h-[430px] bg-gray-700 rounded">
        <p className="text-green-300 text-center">Votação por hora</p>
        <div className="flex justify-center">
          <AreaChart
            width={1200}
            height={300}
            data={dataNow}
            margin={{
              top: 40,
              right: 0,
              left: -10,
              bottom: 0
            }}
          >
            <CartesianGrid
              strokeDasharray="0 0"
              fill="#364563"
              stroke="#996d37"
            />
            <XAxis
              dataKey="name"
              tickFormatter={(value) => value.slice(0, 2)}
            />
            <YAxis />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="uv"
              stroke="#8884d8"
              fill="#8884d8"
            />
          </AreaChart>
        </div>
        <div className="flex justify-center mt-7">
          <div onClick={() => alterDate(-1)} className="cursor-pointer">
            <MdKeyboardArrowLeft size={30} />
          </div>
          <InputMask
            {...inputOptions}
            onChange={handleChange}
            value={date}
            className="w-24"
          />
          <div onClick={() => alterDate(1)} className="cursor-pointer">
            <MdChevronRight size={30} />
          </div>
        </div>
      </div>
    </section>
  );
}
