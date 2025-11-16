import { FC } from 'react';
import { useLocation } from 'react-router-dom';
import { ProfileMenuUI } from '@ui';
import { useDispatch } from '../../services/store';
import { logoutUserThunk } from '@slices';

export const ProfileMenu: FC = () => {
  const loc = useLocation();
  const currentPath = loc.pathname;
  const appDispatch = useDispatch();

  const onLogout = () => {
    appDispatch(logoutUserThunk());
  };

  return <ProfileMenuUI handleLogout={onLogout} pathname={currentPath} />;
};
