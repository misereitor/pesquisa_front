'use client';

import { styled } from '@mui/material/styles';
import MuiAccordionSummary, {
  AccordionSummaryProps
} from '@mui/material/AccordionSummary';
import MuiAccordion, { AccordionProps } from '@mui/material/Accordion';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import { RxChevronRight } from 'react-icons/rx';
import { Category } from '@/src/model/category';
import { Dispatch, SetStateAction, useState } from 'react';
import { FaCheck } from 'react-icons/fa';
import ListCompanyVoting from './list-company';
import { Company } from '@/src/model/company';
import { Vote, VoteRow } from '@/src/model/votes';

const Accordion = styled((props: AccordionProps) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(() => ({
  borderBottom: '1px solid rgb(203, 213, 225)',
  ':last-child': {
    borderBottom: '0px'
  },
  color: 'rgb(255, 222, 94)',

  '&::before': {
    display: 'none'
  }
}));

const AccordionSummary = styled((props: AccordionSummaryProps) => (
  <MuiAccordionSummary
    expandIcon={<RxChevronRight className="text-[#FFDE5E]" size={24} />}
    {...props}
  />
))(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === 'dark'
      ? 'rgba(255, 255, 255, .05)'
      : 'rgba(8, 8, 8)',
  flexDirection: 'row-reverse',
  '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
    transform: 'rotate(90deg)'
  },
  '& .MuiAccordionSummary-content': {
    display: 'flex',
    justifyContent: 'space-between',
    marginLeft: theme.spacing(1)
  }
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  backgroundColor: 'rgba(0, 0, 0, .96)'
}));

type Props = {
  categories: Category[];
  companies: Company[];
  userVotes: Vote[];
  setVoteRow: Dispatch<SetStateAction<VoteRow[]>>;
  voteRow: VoteRow[];
  setLoading: Dispatch<SetStateAction<boolean>>;
  loading: boolean;
  universalDictionary: Record<string, string[]>;
};

export default function AccordionCategoryVote({
  categories,
  companies,
  userVotes,
  setVoteRow,
  voteRow,
  loading,
  setLoading,
  universalDictionary
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
        <Accordion
          key={rowIndex}
          id={rowIndex.toString()}
          data-testid={rowIndex.toString()}
          className="accordion"
          expanded={expanded === rowIndex.toString()}
          onChange={handleExpand(rowIndex.toString())}
          onBlur={() => handleExpand(rowIndex.toString())}
        >
          <AccordionSummary
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              textTransform: 'capitalize'
            }}
            aria-controls="panel1d-content"
            id="panel1d-header"
          >
            <Typography
              id={row.name.replaceAll('/', '').toUpperCase()}
              className={rowIndex.toString()}
            >
              {row.name.replaceAll('/', '/ ').toUpperCase()}
            </Typography>
            {voteRow?.map((r, rIndex) =>
              r.row == rowIndex && r.voteRow ? (
                <div key={rIndex} className="flex items-center">
                  <FaCheck />
                </div>
              ) : (
                ''
              )
            )}
          </AccordionSummary>
          <AccordionDetails>
            <Typography component={'span'}>
              <ListCompanyVoting
                universalDictionary={universalDictionary}
                loading={loading}
                setLoading={setLoading}
                handleExpand={handleExpand}
                userVotes={userVotes}
                setVoteRow={setVoteRow}
                voteRow={voteRow}
                companies={companies}
                category={row}
                setExpanded={setExpanded}
                rowIndex={rowIndex}
              />
            </Typography>
          </AccordionDetails>
        </Accordion>
      ))}
    </div>
  );
}
