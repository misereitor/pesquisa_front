import { styled } from '@mui/material/styles';
import MuiAccordionSummary, {
  AccordionSummaryProps
} from '@mui/material/AccordionSummary';
import MuiAccordion, { AccordionProps } from '@mui/material/Accordion';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import { RxChevronRight } from 'react-icons/rx';
import { Category } from '@/src/model/category';
import { Dispatch, SetStateAction, memo } from 'react';
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
  category: Category;
  companies: Company[];
  userVotes: Vote[];
  setVoteRow: Dispatch<SetStateAction<VoteRow[]>>;
  voteRow: VoteRow[];
  setLoading: Dispatch<SetStateAction<boolean>>;
  loading: boolean;
  universalDictionary: Record<string, string[]>;
  expanded: string | false;
  // eslint-disable-next-line no-unused-vars
  handleChange: (
    panel: string
  ) => (event: React.SyntheticEvent, newExpanded: boolean) => void;
  // eslint-disable-next-line no-unused-vars
  setExpanded: Dispatch<SetStateAction<string | false>>;
  rowIndex: number;
};

const CategoryAccordionItem = memo(function CategoryAccordionItem({
  category,
  companies,
  userVotes,
  setVoteRow,
  voteRow,
  loading,
  setLoading,
  universalDictionary,
  expanded,
  handleChange,
  setExpanded,
  rowIndex
}: Props) {
  const isExpanded = expanded === rowIndex.toString();
  const hasVoted = voteRow?.some((r) => r.row == rowIndex && r.voteRow);

  return (
    <Accordion
      id={rowIndex.toString()}
      data-testid={rowIndex.toString()}
      className="accordion"
      expanded={isExpanded}
      onChange={handleChange(rowIndex.toString())}
    >
      <AccordionSummary
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          textTransform: 'capitalize'
        }}
        aria-controls={`panel${rowIndex}d-content`}
        id={`panel${rowIndex}d-header`}
      >
        <Typography id={category.name.replaceAll('/', '').toUpperCase()}>
          {category.name.replaceAll('/', '/ ').toUpperCase()}
        </Typography>
        {hasVoted && (
          <div className="flex items-center">
            <FaCheck />
          </div>
        )}
      </AccordionSummary>
      <AccordionDetails>
        {isExpanded && (
          <Typography component={'span'}>
            <ListCompanyVoting
              universalDictionary={universalDictionary}
              loading={loading}
              setLoading={setLoading}
              handleExpand={handleChange}
              userVotes={userVotes}
              setVoteRow={setVoteRow}
              voteRow={voteRow}
              companies={companies}
              category={category}
              setExpanded={setExpanded}
              rowIndex={rowIndex}
            />
          </Typography>
        )}
      </AccordionDetails>
    </Accordion>
  );
});

export default CategoryAccordionItem;
