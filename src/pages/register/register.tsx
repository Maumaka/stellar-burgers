import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { RegisterUI } from '@ui-pages';
import { useDispatch, useSelector } from '../../services/store';
import {
  clearUserError,
  registerUserThunk,
  userErrorSelector as selectUserError
} from '@slices';

export const Register: FC = () => {
  const [nameValue, setNameValue] = useState('');
  const [emailValue, setEmailValue] = useState('');
  const [passwordValue, setPasswordValue] = useState('');

  const appDispatch = useDispatch();
  const rawError = useSelector(selectUserError);

  const errorText: string | undefined = (() => {
    if (!rawError) return undefined;
    if (typeof rawError === 'string') return rawError;
    if (rawError && typeof rawError === 'object' && 'message' in rawError) {
      return (rawError as { message: string }).message;
    }
    try {
      return JSON.stringify(rawError);
    } catch {
      return String(rawError);
    }
  })();

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
