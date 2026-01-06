import { Dispatch, SetStateAction, useState } from 'react';
import { VoteRow } from '@/src/model/votes';
import { confirmVoteService } from '@/src/service/voting-service';
import { useRouter } from 'next/navigation';
import { Button } from '@mui/material';
import { IoPlayCircleOutline } from 'react-icons/io5';
import Final from '../final/final';

type Props = {
  setLoading: Dispatch<SetStateAction<boolean>>;
  setOpenModal: Dispatch<SetStateAction<boolean>>;
  progress: number;
  voteRow: VoteRow[];
};
export default function ModalConfirmVote({
  progress,
  setLoading,
  setOpenModal,
  voteRow
}: Props) {
  const [loadinSubmit, setLoadinSubmit] = useState(false);
  const route = useRouter();
  const handleSubmit = async () => {
    setLoadinSubmit(true);
    try {
      await confirmVoteService(progress);
      route.push('/sucesso');
    } catch (error: any) {
      console.error('Error in handleSubmitForm:', error);
    } finally {
      setLoadinSubmit(false);
    }
  };
  //return <Final />;
  return (
    <div className="w-[300px]">
      <div>
        {voteRow.length === 0 && (
          <div>
            <p className="text-justify">
              Ops! Você não votou. <br />
              Por favor, volte e selecione ao menos uma categoria para validar o
              seu voto. <br /> Sua opinião é importante para nós!
            </p>
          </div>
        )}
        {progress >= 70 && progress <= 100 && (
          <div className="mt-8">
            <div className="mb-3">
              <p>Você alcançou {progress.toFixed(1)}% da pesquisa.</p>
            </div>
            <p className="text-justify">
              Você alcançou 70% da pesquisa. Já está concorrendo a TV! <br />
              Continue votando para eleger as{' '}
              <span className="font-bold">Melhores do Ano 2025.</span>
            </p>
          </div>
        )}
        {progress < 70 && progress > 0 && (
          <div className="mt-8">
            <div className="mb-3">
              <p>Você alcançou {progress.toFixed(1)}% da pesquisa.</p>
            </div>
            <p className="text-justify">
              Seus votos não alcançaram os 70% para participar do sorteio.{' '}
              <br /> Não desanime, Você ainda pode participar! revise e complete
              sua votação.
            </p>
          </div>
        )}
      </div>
      <div className="flex justify-between mt-10">
        <button
          type="button"
          onClick={() => {
            setOpenModal(false);
            setLoading(false);
          }}
        >
          Revisar
        </button>
        {voteRow.length > 0 && (
          <Button
            data-testid="comecar"
            size="medium"
            color="success"
            type="button"
            onClick={handleSubmit}
            endIcon={<IoPlayCircleOutline />}
            loading={loadinSubmit}
            loadingPosition="end"
            variant="contained"
            sx={{
              color: '#7f5d00',
              backgroundColor: '#ffe45f !important',
              '&.Mui-disabled': {
                color: '#7f5d00',
                backgroundColor: '#fdf6d0 !important'
              }
            }}
          >
            <span>Confirmar</span>
          </Button>
        )}
      </div>
    </div>
  );
}
