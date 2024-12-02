import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import LoadingButton from '../button/loading-button';
import { userVoting } from '@/model/user-voting';
import { checkCpfExist, confirmCode } from '@/service/login-voting';
import { useRouter } from 'next/navigation';
import ModalReturn from './modal-retuen';
import Modal from '../modal/modal';

type Props = {
  user: userVoting;
  setStage: Dispatch<SetStateAction<number>>;
  lastPage: number;
};

export default function ConfirmCode({ user, setStage, lastPage }: Props) {
  const [code, setCode] = useState(Array(6).fill(''));
  const [loading, setLoading] = useState(false);
  const [time, setTime] = useState(user.try_code_send * 60);
  const [error, setError] = useState('');
  const [openModalReturn, setOpenModalReturn] = useState(false);
  const router = useRouter();
  useEffect(() => {
    if (time != 0) {
      setTimeout(() => {
        setTime(time - 1);
      }, 1000);
    }
  }, [time]);

  const handleInputChange = (value: string, index: number) => {
    if (/^\d?$/.test(value)) {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);

      if (value && index < code.length - 1) {
        const nextInput = document.getElementById(`input-${index + 1}`);
        nextInput?.focus();
      }
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      const prevInput = document.getElementById(`input-${index - 1}`);
      prevInput?.focus();
    }
  };

  const resendMessageHandle = async () => {
    try {
      setLoading(true);
      await checkCpfExist(user.cpf);
      setTime(120);
    } catch (error: any) {
      console.warn(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitForm = async () => {
    try {
      setLoading(true);
      setError('');
      const success = await confirmCode(code.join(''), user.phone);
      if (success) router.push('/votacao');
    } catch (error: any) {
      if (error.message == 'Código incorreto')
        setError(
          'código incorreto, verifique o código digitado e tente novamente'
        );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Modal openModal={openModalReturn} setOpenModal={setOpenModalReturn}>
        <ModalReturn
          lastPage={lastPage}
          setOpenModalReturn={setOpenModalReturn}
          setStage={setStage}
        />
      </Modal>
      <div className="flex flex-col items-center justify-center w-4/5 mx-auto">
        <p className="text-center font-medium">
          Por favor, digite o código que enviamos para:
        </p>
        <p className="text-center font-semibold mt-2">{user.phone}</p>
        <div className="flex justify-center mt-6">
          <div className="flex gap-2">
            {code.map((value, index) => (
              <input
                key={index}
                id={`input-${index}`}
                type="text"
                maxLength={1}
                value={value}
                onChange={(e) => handleInputChange(e.target.value, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className="w-10 h-12 text-center border-gray-300 rounded-md text-lg pl-0"
              />
            ))}
          </div>
        </div>
        <div className="h-5 mt-2">
          {error && <span className="text-sm text-red-700">{error}</span>}
        </div>
        <div>
          <p className="text-center text-sm mt-4 mb-2">
            Não recebeu? <br />
          </p>
          <div className="h-10">
            {time != 0 && (
              <p className="text-sm text-center">
                Você pode solicitar um novo envio em {time} segundos
              </p>
            )}
          </div>
        </div>
        <button onClick={resendMessageHandle} disabled={time != 0}>
          Reenviar
        </button>
        <div className="flex justify-between mt-4 w-full">
          <LoadingButton
            loading={loading}
            onClick={() => setOpenModalReturn(true)}
            type="button"
          >
            Voltar
          </LoadingButton>
          <LoadingButton onClick={handleSubmitForm} loading={loading}>
            Próximo
          </LoadingButton>
        </div>
      </div>
    </div>
  );
}
