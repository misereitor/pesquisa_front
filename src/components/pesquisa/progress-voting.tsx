import {
  Box,
  LinearProgress,
  LinearProgressProps,
  Typography
} from '@mui/material';

interface Props {
  progress: number;
}
function LinearProgressWithLabel(
  props: LinearProgressProps & { value: number }
) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Box sx={{ width: '100%', mr: 1 }}>
        <LinearProgress
          variant="determinate"
          color="inherit"
          sx={{
            height: 10,
            borderRadius: '3px'
          }}
          {...props}
        />
      </Box>
      <Box sx={{ minWidth: 35 }}>
        <Typography
          variant="body2"
          sx={{ color: props.value < 70 ? '#ffe45f' : '#f2b40a' }}
        >{`${Math.round(props.value)}%`}</Typography>
      </Box>
    </Box>
  );
}
export default function ProgressQuest({ progress }: Props) {
  return (
    <div className={`${progress < 70 ? 'tect-[#ffe45f]' : 'text-[#f2b40a]'}`}>
      <div className="pb-2 mx-3">
        <Box sx={{ width: '100%' }}>
          <LinearProgressWithLabel value={progress} />
        </Box>
      </div>
    </div>
  );
}
