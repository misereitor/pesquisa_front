'use client';

import { UserVote } from '@/model/user-voting';
import InputSimple from '../input/input';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FormUserVoting, schemaUserVoting } from '@/schema/schemaLoginVoting';
import { zodResolver } from '@hookform/resolvers/zod';
import { regexCPF, regexPhone } from '@/util/dataProcessing';
import LoadingButton from '../button/loading-button';
import { ufs } from '@/util/ufs';
import { Autocomplete } from '@mui/material';
import { City } from '@/model/city';
import { getCitiesBrazil } from '@/service/ibge';
import Modal from '../modal/modal';
import Termos from './termos';
import { registerUserVoting } from '@/service/login-voting';
import ModalReturn from './modal-retuen';

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
  const [cities, setCities] = useState<City[]>([]);
  const [citySelected, setCitySelected] = useState<City | null>(null);
  const [loadingCity, setLoadingCity] = useState(false);
  const [ufSelected, setUfSelected] = useState(ufs[0]);
  const [checked, setChecked] = useState(false);
  const [openModel, setOpenModal] = useState(false);
  const [error, setError] = useState('');
  const [openModalReturn, setOpenModalReturn] = useState(false);

  const {
    register,
    handleSubmit,
    getValues,
    setValue,
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
      uf: user.uf || ufs[0].sigla
    }
  });
  const getCities = async () => {
    try {
      setLoadingCity(true);
      const citiesIBGE = await getCitiesBrazil(getValues('uf'));
      setCities(citiesIBGE);
    } catch (error: any) {
      console.error(error.message);
    } finally {
      setLoadingCity(false);
    }
  };

  useEffect(() => {
    setLastPage(2);
    getCities();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ufSelected]);

  const handleSubmitForm = async (user: FormUserVoting) => {
    try {
      user.cpf = user.cpf.replaceAll(/\D/g, '');
      user.phone = user.phone.replaceAll(/\D/g, '');
      setLoading(true);
      setError('');
      const userRegistred = await registerUserVoting(user);
      if (userRegistred) {
        setUser(userRegistred);
        setStage(3);
      }
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
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
      <form onSubmit={handleSubmit(handleSubmitForm)} className="w-4/5 mx-auto">
        <div>
          <InputSimple
            className="rounded-lg w-[96%] h-7 capitalize"
            type="text"
            maxLength={14}
            label="Seu nome completo:"
            data-testid="name"
            errortext={errors.name?.message}
            {...register('name')}
          />
        </div>
        <div>
          <InputSimple
            className="rounded-lg w-[96%] h-7 capitalize"
            type="text"
            maxLength={15}
            label="Whatsapp:"
            data-testid="whatsapp"
            errortext={errors.phone?.message}
            {...register('phone', {
              onChange: (e) => (e.target.value = regexPhone(e.target.value))
            })}
          />
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
          <Autocomplete
            id="state"
            options={ufs}
            value={ufSelected}
            onChange={(event, newValue) => {
              if (newValue) {
                setUfSelected(newValue);
                setValue('uf', newValue.sigla);
                setCities([]);
                setCitySelected(null);
                getCities();
              }
            }}
            sx={() => ({
              '& input': {
                borderRadius: '0.5rem',
                height: '1.75rem'
              }
            })}
            renderInput={(params) => (
              <div ref={params.InputProps.ref} className="w-[96%] rounded-lg">
                <InputSimple
                  className="rounded-lg h-7 capitalize"
                  type="text"
                  label="Estado:"
                  data-testid="uf"
                  errortext={errors.uf?.message}
                  {...params.inputProps}
                />
              </div>
            )}
          />
        </div>
        <div>
          <Autocomplete
            id="city"
            options={cities}
            loading={loadingCity}
            value={citySelected}
            onChange={(event, newValue) => {
              if (newValue) {
                setCitySelected(newValue);
                setValue('city', newValue.label);
              }
            }}
            sx={() => ({
              '& input': {
                borderRadius: '0.5rem',
                height: '1.75rem'
              }
            })}
            renderInput={(params) => (
              <div ref={params.InputProps.ref} className="w-[96%] rounded-lg">
                <InputSimple
                  className="rounded-lg h-7 capitalize"
                  type="text"
                  label="Cidade:"
                  data-testid="city"
                  errortext={errors.city?.message}
                  {...params.inputProps}
                />
              </div>
            )}
          />
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
        <div className="mt-5 flex justify-between">
          <LoadingButton
            loading={loading}
            onClick={() => setOpenModalReturn(true)}
            type="button"
          >
            Voltar
          </LoadingButton>
          {checked && citySelected && (
            <LoadingButton loading={loading} type="submit">
              Próximo
            </LoadingButton>
          )}
        </div>
      </form>
    </div>
  );
}
