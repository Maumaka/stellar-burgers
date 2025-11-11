import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { RegisterUI } from '@ui-pages';
import { useDispatch, useSelector } from '../../services/store';
import {
  clearUserError,
  registerUserThunk,
  userErrorSelector as selectUserError
} from '@slices';

export const Register: FC = () => {
  // локальные состояния для полей формы
  const [nameValue, setNameValue] = useState('');
  const [emailValue, setEmailValue] = useState('');
  const [passwordValue, setPasswordValue] = useState('');

  // диспатч и ошибка пользователя из стора
  const appDispatch = useDispatch();
  const rawError = useSelector(selectUserError);

  // нормализуем ошибку в строку (безопасно) для передачи в ui
  const errorText: string | undefined = (() => {
    if (!rawError) return undefined;
    if (typeof rawError === 'string') return rawError;
    if (typeof (rawError as any)?.message === 'string')
      return (rawError as any).message;
    try {
      return JSON.stringify(rawError);
    } catch {
      return String(rawError);
    }
  })();

  // при монтировании очищаем возможные старые ошибки, при размонтировании тоже очищаем
  useEffect(() => {
    appDispatch(clearUserError());
    return () => {
      appDispatch(clearUserError());
    };
  }, [appDispatch]);

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    const name = nameValue;
    appDispatch(
      registerUserThunk({ email: emailValue, name, password: passwordValue })
    );
  };

  return (
    <RegisterUI
      errorText={errorText}
      email={emailValue}
      userName={nameValue}
      password={passwordValue}
      setEmail={setEmailValue}
      setPassword={setPasswordValue}
      setUserName={setNameValue}
      handleSubmit={handleSubmit}
    />
  );
};
