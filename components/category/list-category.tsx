'use client';

import { Category } from '@/src/model/category';
import { useState } from 'react';

import CustomizedAccordions from './accordion-category';
import FilterCategory from './filter-category';
import { Company } from '@/src/model/company';

type Props = {
  categories: Category[];
  company: Company[];
};
const ITEMS_PER_PAGE = 10;
export default function ListCategory({ categories, company }: Props) {
  const [listCategories, setListCategories] = useState(
    categories.sort((a, b) => a.name.localeCompare(b.name))
  );
  const [expanded, setExpanded] = useState<string | false>('');
  const [currentPage, setCurrentPage] = useState(1);
  const totalIndex = Math.ceil(listCategories.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, categories.length);
  const [loading, setLoading] = useState(false);

  const pagination = (event: React.ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value);
  };
  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
      setExpanded(newExpanded ? panel : false);
    };
  console.log(listCategories)
  return (
    <div className="w-full">
      <FilterCategory
        setListCategories={setListCategories}
        categories={listCategories}
        currentPage={currentPage}
        pagination={pagination}
        totalIndex={totalIndex}
      />
      {listCategories.slice(startIndex, endIndex).map((category, index) => (
        <CustomizedAccordions
          company={company}
          loading={loading}
          setLoading={setLoading}
          key={index}
          categories={listCategories}
          category={category}
          setCategories={setListCategories}
          expanded={expanded}
          handleChange={handleChange}
          startIndex={startIndex}
          index={index}
        />
      ))}
    </div>
  );
}
