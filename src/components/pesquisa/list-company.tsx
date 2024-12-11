'use client';
import { Category } from '@/model/category';
import { Company } from '@/model/company';
import {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useEffect,
  useState
} from 'react';
import InputAutocomplete from '../input/input-autocomplete';
import { createVoteService } from '@/service/voting-service';
import { Vote, VoteRow } from '@/model/votes';

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
  handleExpand: (
    // eslint-disable-next-line no-unused-vars
    panel: string
    // eslint-disable-next-line no-unused-vars
  ) => (event: React.SyntheticEvent, newExpanded: boolean) => void;
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
  setLoading
}: Props) {
  const [selected, setSelected] = useState('');
  const [companySelected, setCompanySelected] = useState<Company>();
  const [value, setValue] = useState('');
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSelected(event.target.value);
  };

  useEffect(() => {
    userVotes.forEach((el) => {
      if (Array.isArray(companies)) {
        if (el.id_category === category.id) {
          const company = companies.filter((co) => co.id == el.id_company);
          if (company.length > 0) {
            const companyAssociate = category.companies?.filter(
              (e) => e.id === company[0].id
            );
            if (
              companyAssociate &&
              companyAssociate?.length > 0 &&
              company[0].associate
            ) {
              setSelected(`${category.name}${company[0].id}`);
              return;
            }
            setSelected('outros');
            setValue(company[0].trade_name);
            setCompanySelected(company[0]);
          }
        }
      } else {
        console.error('userVotes não é um array:', userVotes);
      }
    });
  }, [category, companies, userVotes]);

  const handleSubmit = async (row: Company) => {
    try {
      setLoading(true);
      await createVoteService(category.id, row.id);
      const isVote = voteRow.find((r) => r.row === rowIndex);
      setExpanded((rowIndex + 1).toString() as any);
      if (isVote) return;
      handleExpand(rowIndex.toString());
      setVoteRow([
        ...voteRow,
        {
          row: rowIndex,
          voteRow: true
        }
      ]);
    } catch (error: any) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <fieldset>
        {category.companies?.map((row, index) => (
          <div key={index} className="mb-2">
            {row.associate && (
              <div>
                <input
                  type="radio"
                  id={`${category.name}${row.id}`}
                  className="mr-2"
                  disabled={loading}
                  checked={selected === `${category.name}${row.id}`}
                  value={`${category.name}${row.id}`}
                  onChange={(e) => {
                    handleChange(e);
                    setCompanySelected(row);
                    handleSubmit(row);
                  }}
                />
                <label htmlFor={`${category.name}${row.id}`}>
                  {row.trade_name}
                </label>
              </div>
            )}
          </div>
        ))}
        <div className="flex">
          <input
            type="radio"
            disabled={loading}
            id={`${category.name}outros`}
            className="mr-2"
            value="outros"
            checked={selected === 'outros'}
            onChange={(e) => {
              handleChange(e);
            }}
          />
          {selected !== 'outros' ? (
            <label htmlFor={`${category.name}outros`}>OUTROS</label>
          ) : (
            <InputAutocomplete
              setValue={setValue}
              value={value}
              handleSubmit={handleSubmit}
              options={companies}
              companySelected={companySelected}
              setCompanySelected={setCompanySelected}
              name="outros"
            />
          )}
        </div>
      </fieldset>
    </div>
  );
}
