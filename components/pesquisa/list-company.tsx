'use client';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import InputAutocomplete from '../input/input-autocomplete';
import { Category } from '@/src/model/category';
import { Company } from '@/src/model/company';
import { Vote, VoteRow } from '@/src/model/votes';
import { createVoteService } from '@/src/service/voting-service';

type Props = {
  companies: Company[];
  category: Category;
  setExpanded: Dispatch<SetStateAction<string | false>>;
  rowIndex: number;
  setVoteRow: Dispatch<SetStateAction<VoteRow[]>>;
  voteRow: VoteRow[];
  setLoading: Dispatch<SetStateAction<boolean>>;
  loading: boolean;
  userVotes: Vote[];
  universalDictionary: Record<string, string[]>;
  handleExpand: (
    // eslint-disable-next-line no-unused-vars
    panel: string
    // eslint-disable-next-line no-unused-vars
  ) => (event: React.SyntheticEvent, newExpanded: boolean) => void;
  setLocalUserVotes: Dispatch<SetStateAction<Vote[]>>;
};
export default function ListCompanyVoting({
  companies,
  category,
  rowIndex,
  setExpanded,
  setVoteRow,
  voteRow,
  userVotes,
  handleExpand,
  loading,
  setLoading,
  universalDictionary,
  setLocalUserVotes
}: Props) {
  const [companySelected, setCompanySelected] = useState<Company>();
  const [value, setValue] = useState('');
  /* category.companies sort removed as it was a side effect and seemingly unused */

  useEffect(() => {
    userVotes.forEach((el) => {
      if (el.id_category === category.id) {
        const company = companies.filter((co) => co.id == el.id_company);
        if (company.length > 0) {
          setValue(company[0].trade_name);
          setCompanySelected(company[0]);
        }
      }
    });
  }, [category, companies, userVotes]);

  const handleSubmit = async (row: Company) => {
    try {
      setLoading(true);
      await createVoteService(category.id, row.id);

      // Update localUserVotes state
      const newVote: Vote = {
        id_user_vote: 0, // Dummy ID, not used for display logic
        id_category: category.id,
        id_company: row.id
      };

      setLocalUserVotes((prevVotes) => {
        // Remove existing vote for this category if any
        const filteredVotes = prevVotes.filter(
          (v) => v.id_category !== category.id
        );
        return [...filteredVotes, newVote];
      });

      const isVote = voteRow.find((r) => r.row === rowIndex);
      setExpanded((rowIndex + 1).toString() as any);
      handleExpand((rowIndex + 1).toString())(
        {} as React.SyntheticEvent, // Simula um evento vazio
        true // Expande o Accordion
      );
      if (isVote) return;
      setVoteRow([
        ...voteRow,
        {
          row: rowIndex,
          voteRow: true
        }
      ]);
    } catch (error: any) {
      console.error('Error in handleSubmitForm:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <fieldset>
        <div className="flex w-full">
          <InputAutocomplete
            setValue={setValue}
            value={value}
            handleSubmit={handleSubmit}
            options={companies}
            companySelected={companySelected}
            setCompanySelected={setCompanySelected}
            universalDictionary={universalDictionary}
            name={category.name}
            placeholder={`Digite o nome da empresa`}
          />
        </div>
      </fieldset>
    </div>
  );
}
