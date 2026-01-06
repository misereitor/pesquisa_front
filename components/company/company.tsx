'use client';
import { Company } from '@/src/model/company';
import VirtualizedList from './list-company';
import { useState } from 'react';

type Props = {
  companies: Company[];
};
export default function ListCompan({ companies }: Props) {
  const [companiesList, setCompaniesList] = useState<Company[]>(companies);
  return (
    <div>
      <VirtualizedList
        companies={companiesList}
        setCompaniesList={setCompaniesList}
      />
    </div>
  );
}
