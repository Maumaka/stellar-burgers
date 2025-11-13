import { FC, SyntheticEvent, useState } from 'react';
import { LoginUI } from '@ui-pages';
import { useDispatch, useSelector } from '../../services/store';
import {
  isAuthSelector as selectIsAuth,
  loginUserThunk,
  userErrorSelector as selectUserError
} from '@slices';
import { Navigate } from 'react-router-dom';

export const Login: FC = () => {
  const [emailValue, setEmailValue] = useState('');
  const [passwordValue, setPasswordValue] = useState('');

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

  const isAuth = useSelector(selectIsAuth);
  const appDispatch = useDispatch();

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    if (!emailValue || !passwordValue) {
      return;
    }
    appDispatch(loginUserThunk({ email: emailValue, password: passwordValue }));
  };

  if (isAuth) {
    return <Navigate to={'/'} />;
  }

  return (
    <LoginUI
      errorText={errorText}
      email={emailValue}
      setEmail={setEmailValue}
      password={passwordValue}
      setPassword={setPasswordValue}
      handleSubmit={handleSubmit}
    />
  );
};
