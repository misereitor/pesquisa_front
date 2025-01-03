'use client';

import Dictionary from '@/components/dictionary/dictionary';
import { Company } from '@/model/company';
import { DictionaryEntry } from '@/model/dictionary';
import { getAllCompany } from '@/service/company-service';
import { getAllDictionaryService } from '@/service/dictionary';
import { useEffect, useState } from 'react';

export default function Dicionario() {
  const [dictionary, setDictionary] = useState<DictionaryEntry[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  useEffect(() => {
    const getData = async () => {
      const data = await getAllDictionaryService();
      setDictionary(data.data);
      const data2 = await getAllCompany();
      setCompanies(data2);
    };
    getData();
  }, []);
  return (
    <Dictionary
      dictionaryData={dictionary}
      companies={companies}
      setDictionary={setDictionary}
    />
  );
}
