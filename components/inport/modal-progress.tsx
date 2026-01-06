import {
  Box,
  LinearProgress,
  LinearProgressProps,
  Typography
} from '@mui/material';

type Props = {
  progress: number;
};

function LinearProgressWithLabel(
  props: LinearProgressProps & { value: number }
) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Box sx={{ width: '100%', mr: 1 }}>
        <LinearProgress
          variant="determinate"
          color="success"
          sx={{ height: 10, borderRadius: '3px' }}
          {...props}
        />
      </Box>
      <Box sx={{ minWidth: 35 }}>
        <Typography
          variant="body2"
          sx={{ color: '#FFDE5E' }}
        >{`${Math.round(props.value)}%`}</Typography>
      </Box>
    </Box>
  );
}

export default function ModalProgress({ progress }: Props) {
  return (
    <div className="w-96">
      <div>
        <h2 className="text-xl">Aguarde...</h2>
      </div>
      <div className="mt-2">
        <Box sx={{ width: '100%' }}>
          <LinearProgressWithLabel value={progress} />
        </Box>
      </div>
    </div>
  );
}
