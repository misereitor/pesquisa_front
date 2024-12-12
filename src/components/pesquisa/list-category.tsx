'use client';
import { Category } from '@/model/category';
import { Company } from '@/model/company';
import { UserVote } from '@/model/user-voting';
import { Vote, VoteRow } from '@/model/votes';
import AccordionCategoryVote from './accordionCategory';
import FooterVoting from './layout.footer';
import ProgressQuest from './progress-voting';
import { useEffect, useState } from 'react';
import LoadingButton from '../button/loading-button';
import Modal from '../modal/modal';
import ModalConfirmVote from './modal-confirm-vote';
import Loading from '@/app/loading';
import { DictionaryEntry } from '@/model/dictionary';

type Props = {
  categories: Category[];
  companies: Company[];
  userVotes: Vote[];
  user: UserVote;
  dictionaryFromService: DictionaryEntry[];
};
export default function ListCategoryPesquisa({
  categories,
  companies,
  userVotes,
  user,
  dictionaryFromService
}: Props) {
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [pageLoading, setPagLoading] = useState(true);
  const [voteRow, setVoteRow] = useState<VoteRow[]>([]);

  useEffect(() => {
    setProgress(Math.trunc((voteRow.length * 100) / categories.length));
  }, [categories, setProgress, voteRow]);

  useEffect(() => {
    const voteUser: VoteRow[] = [];
    categories.forEach((e, i) => {
      const vote = userVotes.filter((el) => el.id_category == e.id);
      if (vote.length === 1) {
        voteUser.push({
          row: i,
          voteRow: true
        });
      }
    });
    setVoteRow(voteUser);
    setPagLoading(false);
  }, [categories, userVotes]);

  const handleVote = async () => {
    setLoading(true);
    setOpenModal(true);
  };

  if (pageLoading) {
    return <Loading />;
  }
  console.log(dictionaryFromService);
  return (
    <div>
      <div className="w-3/4 max-w-3xl mx-auto">
        <div className="mt-28">
          <p>
            Olá, <span className="font-bold">{user.name + ' '}</span>
            bem vindo a nossa plataforma! Aqui, juntos vamos eleger as melhores
            empresas de Santo Antônio de Jesus em 2024!
          </p>
        </div>
        <div className="mt-8">
          <AccordionCategoryVote
            loading={loading}
            setLoading={setLoading}
            setVoteRow={setVoteRow}
            voteRow={voteRow}
            categories={categories}
            companies={companies}
            userVotes={userVotes}
            dictionaryFromService={dictionaryFromService}
          />
        </div>
        <div className="mt-6 mb-36 flex justify-end">
          <LoadingButton onClick={handleVote} loading={loading}>
            VOTAR
          </LoadingButton>
        </div>
        <div className="bottom-14 fixed w-3/4 max-w-3xl bg-black">
          {progress < 70 ? (
            <span className="text-sm">
              Você ainda não está concorrendo ao sorteio
            </span>
          ) : (
            <span className="text-sm">Você já está concorrendo ao sorteio</span>
          )}
          <ProgressQuest progress={progress} />
        </div>
        <div className="fixed bottom-0 w-3/4 max-w-3xl bg-black pb-2 mx-auto">
          <FooterVoting />
        </div>
      </div>
      <Modal setOpenModal={setOpenModal} openModal={openModal}>
        <ModalConfirmVote
          progress={progress}
          setLoading={setLoading}
          setOpenModal={setOpenModal}
          voteRow={voteRow}
        />
      </Modal>
    </div>
  );
}
