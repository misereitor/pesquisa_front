'use client';

import { UserVote } from "../model/user-voting";

type Data = {
  name: string;
  uv: number;
};
export const dateTrasnform = (value: UserVote[], date: string) => {
  const data: Data[] = [
    {
      name: '00',
      uv: 0
    },
    {
      name: '01',
      uv: 0
    },
    {
      name: '02',
      uv: 0
    },
    {
      name: '03',
      uv: 0
    },
    {
      name: '04',
      uv: 0
    },
    {
      name: '05',
      uv: 0
    },
    {
      name: '06',
      uv: 0
    },
    {
      name: '07',
      uv: 0
    },
    {
      name: '08',
      uv: 0
    },
    {
      name: '09',
      uv: 0
    },
    {
      name: '10',
      uv: 0
    },
    {
      name: '11',
      uv: 0
    },
    {
      name: '12',
      uv: 0
    },
    {
      name: '13',
      uv: 0
    },
    {
      name: '14',
      uv: 0
    },
    {
      name: '15',
      uv: 0
    },
    {
      name: '16',
      uv: 0
    },
    {
      name: '17',
      uv: 0
    },
    {
      name: '18',
      uv: 0
    },
    {
      name: '19',
      uv: 0
    },
    {
      name: '20',
      uv: 0
    },
    {
      name: '21',
      uv: 0
    },
    {
      name: '22',
      uv: 0
    },
    {
      name: '23',
      uv: 0
    }
  ];
  value.forEach((e) => {
    if (new Date(e.date_vote).toLocaleDateString() == date) {
      data[new Date(e.date_vote).getHours()].uv++;
    }
  });
  return data;
};
