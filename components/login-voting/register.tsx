'use client';

import { UserVote } from '@/src/model/user-voting';
import InputSimple from '../input/input';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
  FormUserVoting,
  schemaUserVoting
} from '@/src/schema/schemaLoginVoting';
import { zodResolver } from '@hookform/resolvers/zod';
import { regexCPF } from '@/src/util/dataProcessing';
import Modal from '../modal/modal';
import Termos from './termos';
import { registerUserVoting } from '@/src/service/login-voting';
import ModalReturn from './modal-retuen';
import { IoPlayCircleOutline } from 'react-icons/io5';
import { Button } from '@mui/material';
import Link from 'next/link';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

type Props = {
  user: UserVote;
  setStage: Dispatch<SetStateAction<number>>;
  setUser: Dispatch<SetStateAction<UserVote | undefined>>;
  setLastPage: Dispatch<SetStateAction<number>>;
};
export default function Register({
  user,
  setStage,
  setUser,
  setLastPage
}: Props) {
  const [loading, setLoading] = useState(false);
  const [checked, setChecked] = useState(false);
  const [openModel, setOpenModal] = useState(false);
  const [error, setError] = useState('');
  const [openModalReturn, setOpenModalReturn] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors }
  } = useForm<FormUserVoting>({
    mode: 'all',
    criteriaMode: 'all',
    resolver: zodResolver(schemaUserVoting),
    defaultValues: {
      cpf: regexCPF(user.cpf),
      city: user.city,
      name: user.name,
      phone: user.phone,
      country: user.country,
      state: user.state
    }
  });

  const handleSubmitForm = async (user: FormUserVoting) => {
    try {
      user.cpf = user.cpf.replaceAll(/\D/g, '');
      user.phone = user.phone.replaceAll(/\D/g, '');
      setLoading(true);
      setError('');
      console.log(user);
      const userRegistred = await registerUserVoting(user);
      if ('success' in userRegistred && !userRegistred.success) {
        setError(userRegistred.message);
        setLoading(false);
        return;
      }
      const newUser = userRegistred.data as UserVote;
      setUser(newUser);
      setStage(3);
    } catch (error: unknown) {
      console.error('Error in handleSubmitForm:', error);

      if (error instanceof Error) {
        // Caso o backend tenha retornado uma mensagem de erro específica
        if (error.message === 'Error') {
          setError('Telefone informado já cadastrado');
        } else {
          setError(error.message);
        }
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
      <Modal openModal={openModel} setOpenModal={setOpenModal}>
        <Termos />
      </Modal>
      <Modal openModal={openModalReturn} setOpenModal={setOpenModalReturn}>
        <ModalReturn
          lastPage={1}
          setOpenModalReturn={setOpenModalReturn}
          setStage={setStage}
        />
      </Modal>
      <form
        onSubmit={handleSubmit(handleSubmitForm)}
        className="max-w-[95%] w-[500px] mx-auto mt-16"
      >
        <div>
          <InputSimple
            className="rounded-lg w-[96%] h-7 capitalize"
            type="text"
            label="Seu nome completo:"
            data-testid="name"
            errortext={errors.name?.message}
            {...register('name')}
          />
          <div className="mb-5">
            <Controller
              control={control}
              name="phone"
              render={({ field }) => (
                <>
                  <style jsx global>{`
                    .react-tel-input .flag-dropdown,
                    .react-tel-input .selected-flag,
                    .react-tel-input .flag-dropdown.open,
                    .phone-flag-btn,
                    .phone-flag-btn:focus,
                    .phone-flag-btn:hover,
                    .phone-flag-btn:active {
                      background-color: rgba(
                        var(--background-input),
                        1
                      ) !important;
                      border: ${errors.phone
                        ? '1px solid #dc2626'
                        : '1px solid #d1d5db'} !important;
                      box-shadow: none !important;
                      outline: none !important;
                    }

                    .phone-input {
                      width: 100% !important;
                      height: 28px !important;
                      border-radius: 8px !important;
                      padding-left: 50px !important;
                      background-color: rgba(
                        var(--background-input),
                        1
                      ) !important;
                      border: ${errors.phone
                        ? '1px solid #dc2626'
                        : '1px solid #d1d5db'} !important;
                    }

                    /* For the dropdown list alignment and visibility */

                    .react-tel-input .flag-dropdown .country-list {
                      position: absolute !important;
                      top: 100% !important;
                      left: 0 !important;
                      right: auto !important;
                      z-index: 9999 !important;
                      background-color: rgba(
                        var(--background-input),
                        1
                      ) !important;
                      max-height: 200px;
                      overflow-y: auto;
                      min-width: 220px;
                      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                    }

                    /* Country rows styling: default + hover */
                    .react-tel-input .flag-dropdown .country-list .country {
                      background: transparent;
                      color: #ffffff;
                      padding: 6px 10px;
                    }
                    .react-tel-input
                      .flag-dropdown
                      .country-list
                      .country:hover {
                      background-color: #6b7280 !important; /* cinza */
                      color: #ffffff !important; /* letras brancas */
                    }

                    /* Ensure country name and dial code are white on hover and normally readable */
                    .react-tel-input
                      .flag-dropdown
                      .country-list
                      .country
                      .country-name,
                    .react-tel-input
                      .flag-dropdown
                      .country-list
                      .country
                      .dial-code {
                      color: #ffffff;
                    }
                    .react-tel-input
                      .flag-dropdown
                      .country-list
                      .country:hover
                      .country-name,
                    .react-tel-input
                      .flag-dropdown
                      .country-list
                      .country:hover
                      .dial-code {
                      color: #ffffff !important;
                    }

                    /* scrollbar tweaks for better UX */
                    .react-tel-input
                      .flag-dropdown
                      .country-list::-webkit-scrollbar {
                      width: 8px;
                      height: 8px;
                    }
                    .react-tel-input
                      .flag-dropdown
                      .country-list::-webkit-scrollbar-thumb {
                      background: rgba(255, 255, 255, 0.12);
                      border-radius: 6px;
                    }
                  `}</style>

                  <PhoneInput
                    country={'br'}
                    countryCodeEditable={true}
                    value={field.value}
                    onChange={(value: string) => field.onChange(value)}
                    onBlur={field.onBlur}
                    containerStyle={{ width: '96%', position: 'relative' }}
                    inputStyle={{
                      width: '100%',
                      borderRadius: 8,
                      backgroundColor: 'rgba(var(--background-input), 1)',
                      height: 28,
                      border: errors.phone
                        ? '1px solid #dc2626'
                        : '1px solid #d1d5db',
                      paddingLeft: 50,
                      outline: 'none',
                      boxShadow: 'none',
                      color: 'inherit'
                    }}
                    buttonStyle={{
                      borderRadius: '8px 0 0 8px',
                      border: errors.phone
                        ? '1px solid #dc2626'
                        : '1px solid #d1d5db',
                      background: 'rgba(var(--background-input), 1)',
                      height: 28,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      outline: 'none',
                      boxShadow: 'none',
                      WebkitTapHighlightColor: 'transparent'
                    }}
                    dropdownStyle={{ maxHeight: 200, overflowY: 'auto' }}
                    inputProps={{
                      name: 'phone',
                      required: true,
                      autoComplete: 'tel'
                    }}
                    buttonClass={
                      errors.phone ? 'phone-flag-btn error' : 'phone-flag-btn'
                    }
                    inputClass="phone-input"
                  />
                </>
              )}
            />
          </div>
        </div>
        <div>
          <InputSimple
            className="rounded-lg w-[96%] h-7 capitalize"
            type="text"
            disabled
            maxLength={14}
            label="CPF:"
            data-testid="cpf"
            errortext={errors.cpf?.message}
            {...register('cpf', {
              onChange: (e) => (e.target.value = regexCPF(e.target.value))
            })}
          />
        </div>
        <div>
          <InputSimple
            className="rounded-lg w-[96%] h-7 capitalize"
            type="text"
            label="País:"
            data-testid="country"
            errortext={errors.country?.message}
            {...register('country')}
          />
        </div>
        <div>
          <InputSimple
            className="rounded-lg w-[96%] h-7 capitalize"
            type="text"
            label="Estado:"
            data-testid="state"
            errortext={errors.state?.message}
            {...register('state')}
          />
        </div>
        <div>
          <InputSimple
            className="rounded-lg w-[96%] h-7 capitalize"
            type="text"
            label="Cidade:"
            data-testid="city"
            errortext={errors.city?.message}
            {...register('city')}
          />
        </div>
        <div className="w-full mb-4 flex justify-end pr-2">
          <Link
            href={
              'https://wa.me/5575981976540?text=Ol%C3%A1%2C%20estou%20com%20problemas%20no%20sistema%20Melhores%20do%20Ano%202025'
            }
            target="_blank"
          >
            Precisa de ajuda? Clique aqui!
          </Link>
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            name="terms"
            checked={checked}
            onChange={(e) => setChecked(e.target.checked)}
            id="terms"
            className="top-0 left-0 right-0 bottom-0 w-7 h-5"
          />
          <label>
            <b className="no-underline">Eu li e concordo com os </b>
            <b
              onClick={() => setOpenModal(true)}
              className="underline cursor-pointer"
            >
              termos de uso.
            </b>
          </label>
        </div>
        <div className="mt-3">
          {error && <span className="text-red-700">{error}</span>}
        </div>
        <div className="my-8 flex justify-between">
          <button
            disabled={loading}
            onClick={() => setOpenModalReturn(true)}
            type="button"
          >
            Voltar
          </button>

          {checked && (
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
          )}
        </div>
      </form>
    </div>
  );
}
