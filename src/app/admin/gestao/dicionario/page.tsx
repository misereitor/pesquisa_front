'use client';

import Dictionary from '@/components/dictionary/dictionary';
import { DictionaryEntry } from '@/model/dictionary';
import { getAllDictionaryService } from '@/service/dictionary';
import { useEffect, useState } from 'react';

export default function Dicionario() {
  const [dictionary, setDictionary] = useState<DictionaryEntry[]>([]);

  useEffect(() => {
    const getData = async () => {
      const data = await getAllDictionaryService();
      setDictionary(data.data);
    };
    getData();
  }, []);
  return (
    <Dictionary dictionaryData={dictionary} setDictionary={setDictionary} />
  );
}
