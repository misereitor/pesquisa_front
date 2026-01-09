'use client';

import { Category } from '@/src/model/category';
import { Dispatch, SetStateAction, useState, useCallback } from 'react';
import { Company } from '@/src/model/company';
import { Vote, VoteRow } from '@/src/model/votes';
import CategoryAccordionItem from './category-accordion-item';

// Styled components moved to category-accordion-item.tsx

type Props = {
  categories: Category[];
  companies: Company[];
  userVotes: Vote[];
  setVoteRow: Dispatch<SetStateAction<VoteRow[]>>;
  voteRow: VoteRow[];
  setLoading: Dispatch<SetStateAction<boolean>>;
  loading: boolean;
  universalDictionary: Record<string, string[]>;
  setLocalUserVotes: Dispatch<SetStateAction<Vote[]>>;
};

export default function AccordionCategoryVote({
  categories,
  companies,
  userVotes,
  setVoteRow,
  voteRow,
  loading,
  setLoading,
  universalDictionary,
  setLocalUserVotes
}: Props) {
  const [expanded, setExpanded] = useState<string | false>('');

  const handleExpand =
    (panel: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
      setExpanded(newExpanded ? panel : false);
      scrollAccordion(panel, newExpanded);
    };

  const scrollAccordion = (accordionId: string, newExpanded: boolean) => {
    const accordion = document.getElementById(accordionId);
    let block: ScrollLogicalPosition | undefined = 'nearest';
    if (newExpanded) {
      block = 'center';
    }
    setTimeout(() => {
      accordion?.scrollIntoView({
        behavior: 'smooth',
        block,
        inline: 'end'
      });
    }, 500);
  };

  return (
    <div className="px-6 py-2 bg-[rgb(8,8,8)] border rounded-md border-slate-300 shadow-white w-full">
      {categories.map((row, rowIndex) => (
        <CategoryAccordionItem
          key={rowIndex}
          companies={companies}
          userVotes={userVotes}
          setVoteRow={setVoteRow}
          voteRow={voteRow}
          loading={loading}
          setLoading={setLoading}
          universalDictionary={universalDictionary}
          category={row}
          expanded={expanded}
          handleChange={handleExpand}
          setExpanded={setExpanded}
          rowIndex={rowIndex}
          setLocalUserVotes={setLocalUserVotes}
        />
      ))}
    </div>
  );
}
