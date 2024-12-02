import { Dispatch, SetStateAction } from 'react';

type Props = {
  setOpenModalReturn: Dispatch<SetStateAction<boolean>>;
  setStage: Dispatch<SetStateAction<number>>;
  lastPage: number;
};

export default function ModalReturn({
  setOpenModalReturn,
  lastPage,
  setStage
}: Props) {
  return (
    <div>
      <div>Deseja realmente voltar?</div>
      <div className="flex justify-between mt-10">
        <button
          onClick={() => {
            setStage(lastPage);
            setOpenModalReturn(false);
          }}
          type="button"
          className="bg-orange-700 w-14 h-8 rounded-md text-white"
        >
          Sim
        </button>
        <button
          type="button"
          className="bg-yellow-500  w-14 h-8 rounded-md text-yellow-950"
          onClick={() => setOpenModalReturn(false)}
        >
          Não
        </button>
      </div>
    </div>
  );
}
