import { Dispatch, SetStateAction } from 'react';

type Props = {
  setOpenModalPercentagem: Dispatch<SetStateAction<boolean>>;
};
export default function ModalPercentage({ setOpenModalPercentagem }: Props) {
  return (
    <div className="w-80 h-62 flex flex-col items-center justify-center mx-auto">
      <h2 className="text-center">
        Votando acima de 70% das categorias, você concorre a uma TV de 50&quot;
      </h2>
      <div>
        <button
          type="button"
          onClick={() => setOpenModalPercentagem(false)}
          className="w-12 h-7 bg-[#ffe45f] text-[#7f5d00] rounded-md mt-10 hover:bg-[#ffe45fc3]"
        >
          OK
        </button>
      </div>
    </div>
  );
}
