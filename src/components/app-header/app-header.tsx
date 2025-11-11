import { FC } from 'react';
import { userDataSelector as selectUserData } from '@slices';
import { AppHeaderUI } from '@ui';
import { useSelector } from '../../services/store';

export const AppHeader: FC = () => {
  // получаем текущее имя пользователя из глобального селектора
  const currentUserName: string | undefined = useSelector(selectUserData)?.name;

  // рендерим ui-компонент шапки и передаём имя пользователя (если оно есть)
  return <AppHeaderUI userName={currentUserName} />;
};
