import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from '../services/store';
import { Preloader } from '@ui';
import {
  userDataSelector as selectUserData,
  isAuthCheckedSelector as selectIsAuthChecked
} from '@slices';

type ProtectedRouteProps = {
  onlyAuth?: boolean;
  children: React.ReactElement;
};

type FromLocation = { pathname: string };

type LocationState = { from?: FromLocation };

export const ProtectedRoute = ({ onlyAuth, children }: ProtectedRouteProps) => {
  const isAuthReady = useSelector(selectIsAuthChecked);
  const currentUser = useSelector(selectUserData);
  const currentLocation = useLocation();

  if (!isAuthReady) {
    return <Preloader />;
  }

  if (!onlyAuth && !currentUser) {
    return <Navigate replace to='/login' state={{ from: currentLocation }} />;
  }

  if (onlyAuth && currentUser) {
    const fromLocation = (currentLocation.state as LocationState | undefined)
      ?.from ?? { pathname: '/' };
    return <Navigate replace to={fromLocation} />;
  }

  return children;
};
