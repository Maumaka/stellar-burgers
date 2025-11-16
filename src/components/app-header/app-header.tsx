import { FC } from 'react';
import { userDataSelector as selectUserData } from '@slices';
import { AppHeaderUI } from '@ui';
import { useSelector } from '../../services/store';

export const AppHeader: FC = () => {
  const currentUserName: string | undefined = useSelector(selectUserData)?.name;
  return <AppHeaderUI userName={currentUserName} />;
};
