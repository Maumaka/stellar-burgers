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
  // локальные состояния для полей формы
  const [emailValue, setEmailValue] = useState('');
  const [passwordValue, setPasswordValue] = useState('');

  // сырой объект ошибки из стора
  const rawError = useSelector(selectUserError);

  // нормализуем ошибку в безопасную строку для отображения в ui
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

  // флаг авторизации пользователя
  const isAuth = useSelector(selectIsAuth);

  // диспатч для отправки thunk-ов
  const appDispatch = useDispatch();

  // обработчик сабмита формы логина
  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    // если поля пустые — ничего не отправляем
    if (!emailValue || !passwordValue) {
      return;
    }
    appDispatch(loginUserThunk({ email: emailValue, password: passwordValue }));
  };

  // если уже авторизованы — перенаправляем на главную
  if (isAuth) {
    return <Navigate to={'/'} />;
  }

  // передаём значения и сеттеры в ui-компонент, оставляем сигнатуру пропсов без изменений
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
