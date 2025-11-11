import { FC } from 'react';
import { useLocation } from 'react-router-dom';
import { ProfileMenuUI } from '@ui';
import { useDispatch } from '../../services/store';
import { logoutUserThunk } from '@slices';

export const ProfileMenu: FC = () => {
  // текущий путь маршрута
  const loc = useLocation();
  const currentPath = loc.pathname;

  // диспатч для вызова thunk-ов
  const appDispatch = useDispatch();

  // обработчик выхода: запускаем thunk выхода
  const onLogout = () => {
    appDispatch(logoutUserThunk());
  };

  return <ProfileMenuUI handleLogout={onLogout} pathname={currentPath} />;
};
