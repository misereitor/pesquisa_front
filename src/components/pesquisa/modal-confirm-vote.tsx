import { Dispatch, SetStateAction, useState } from 'react';
import { VoteRow } from '@/model/votes';
import { confirmVoteService } from '@/service/voting-service';
import { useRouter } from 'next/navigation';
import { LoadingButton } from '@mui/lab';
import { IoPlayCircleOutline } from 'react-icons/io5';

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
  const [loadinSubmit, setLoadingSubit] = useState(false);
  const route = useRouter();
  const handleSubmit = async () => {
    try {
      setLoadingSubit(true);
      await confirmVoteService(progress);
      route.push('/sucesso');
    } catch (error: any) {
      console.error('Error in handleSubmitForm:', error);
    } finally {
      setLoadingSubit(false);
    }
  };
  return (
    <div className="w-[300px]">
      <div>
        {voteRow.length === 0 && (
          <div>
            <p>Você votou {progress}%</p>
            <p>
              Ops! Parece que você não votou em nada ainda. Por favor, volte e
              selecione pelo menos uma opção para continuar. Sua voz é
              importante para nós!
            </p>
          </div>
        )}
        <p>Você votou {progress}%</p>
        {progress > 70 ? (
          <div>
            <p>
              Parabéns por ultrapassar os 70% de votos! Você está no sorteio.
            </p>
          </div>
        ) : (
          <div className="mt-3">
            <p>
              Infelizmente, seu voto não alcançou os 70% necessários para entrar
              no sorteio. Mas não desanime! Você ainda pode participar se voltar
              e completar sua votação.
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
          <LoadingButton
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
          </LoadingButton>
        )}
      </div>
    </div>
  );
}
