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

export const ProtectedRoute = ({ onlyAuth, children }: ProtectedRouteProps) => {
  // селектор, показывающий, что проверка авторизации завершена
  const isAuthReady = useSelector(selectIsAuthChecked);
  // данные текущего пользователя из стора (если есть)
  const currentUser = useSelector(selectUserData);
  const currentLocation = useLocation();

  // пока не известно состояние авторизации — показываем прелоадер
  if (!isAuthReady) {
    return <Preloader />;
  }

  // маршрут, доступный только авторизованным пользователям (protected route)
  if (!onlyAuth && !currentUser) {
    return <Navigate replace to='/login' state={{ from: currentLocation }} />;
  }

  // маршрут, доступный только неавторизованным пользователям (guest route)
  if (onlyAuth && currentUser) {
    const fromLocation = (currentLocation.state as any)?.from || {
      pathname: '/'
    };
    return <Navigate replace to={fromLocation} />;
  }

  return children;
};
