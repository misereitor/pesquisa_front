import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { UserVote } from '@/src/model/user-voting';
import { checkCpfExist, confirmCode } from '@/src/service/login-voting';
import { useRouter } from 'next/navigation';
import ModalReturn from './modal-retuen';
import Modal from '../modal/modal';
import { setCookie } from 'cookies-next/client';
import { Button } from '@mui/material';
import { IoPlayCircleOutline } from 'react-icons/io5';
import Link from 'next/link';

type Props = {
  user: UserVote;
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

      // Focar no próximo input, se existir
      if (value && index < code.length - 1) {
        const nextInput = document.getElementById(`input-${index + 1}`);
        nextInput?.focus();
      }
    }
  };

  const handlePaste = (
    e: React.ClipboardEvent<HTMLInputElement>,
    index: number
  ) => {
    // Impede o comportamento padrão do "colar"
    e.preventDefault();

    // Pega o conteúdo colado
    const pastedValue = e.clipboardData.getData('Text');

    // Filtra apenas os números do valor colado
    const filteredValue = pastedValue.replace(/\D/g, '');

    // Cria um novo código com os valores filtrados
    const newCode = [...code];

    // Preenche os campos com os valores colados
    for (let i = 0; i < filteredValue.length; i++) {
      if (i + index < newCode.length) {
        newCode[i + index] = filteredValue[i];
      }
    }

    setCode(newCode);

    // Foca no último campo preenchido
    const lastFilledIndex = Math.min(
      index + filteredValue.length,
      code.length - 1
    );
    const lastInput = document.getElementById(`input-${lastFilledIndex}`);
    lastInput?.focus();
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
      console.error('Error in handleSubmitForm:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitForm = async () => {
    try {
      setLoading(true);
      setError('');
      const resp = (await confirmCode(code.join(''), user.phone)) as any;
      if (!resp.success) {
        setError(resp.message);
        setLoading(false);
        return;
      }
      if (resp.success) {
        const data = resp.data as { token: string; user: any };
        setCookie('token', data.token);
        setCookie('user', JSON.stringify(data.user));
        router.push('/votacao');
      }
    } catch (error: any) {
      console.error('Error in handleSubmitForm:', error);

      if (error.name === 'Error') {
        // Caso o backend tenha retornado uma mensagem de erro específica
        setError('código incorreto');
        setLoading(false);
      } else {
        // Erro genérico (ex.: problemas de rede)
        setError('Ocorreu um erro inesperado. Tente novamente mais tarde.');
        setLoading(false);
      }
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
      <div className="flex flex-col items-center max-w-[95%] w-[500px] justify-center mx-auto">
        <p className="text-center font-medium">
          Por favor, digite o código que enviamos para:
        </p>
        <p className="text-center font-semibold mt-2">{user.phone}</p>
        <form
          className="max-w-[95%] w-[500px]"
          onSubmit={(e) => {
            e.preventDefault(); // Previne o comportamento padrão do form
            handleSubmitForm(); // Chama o envio
          }}
        >
          <div className="flex justify-center mt-6">
            <div className="flex gap-2">
              {code.map((value, index) => (
                <input
                  key={index}
                  id={`input-${index}`}
                  type="number"
                  maxLength={1}
                  onPaste={(e) => handlePaste(e, index)}
                  value={value}
                  onChange={(e) => handleInputChange(e.target.value, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  className="w-10 h-12 text-center border-gray-300 rounded-md text-lg pl-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
              ))}
            </div>
          </div>
          <div className="h-5 mt-2">
            {error && (
              <span className="text-sm text-red-700 flex items-center justify-center">
                {error}
              </span>
            )}
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
          <div className="flex items-center justify-center mb-10">
            <button
              onClick={resendMessageHandle}
              type="button"
              disabled={time != 0}
            >
              Reenviar
            </button>
          </div>
          <div className="w-full mb-4 flex justify-center pr-2">
            <Link
              href={
                'https://wa.me/5575981976540?text=Ol%C3%A1%2C%20estou%20com%20problemas%20no%20sistema%20Melhores%20do%20Ano%202025'
              }
              target="_blank"
            >
              Precisa de ajuda? Clique aqui!
            </Link>
          </div>
          <div className="flex justify-between mt-4 w-full">
            <button
              disabled={loading}
              onClick={() => setOpenModalReturn(true)}
              type="button"
            >
              Voltar
            </button>
            <Button
              data-testid="comecar"
              size="medium"
              color="success"
              type="submit"
              endIcon={<IoPlayCircleOutline />}
              loading={loading}
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
              <span>Próximo</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
