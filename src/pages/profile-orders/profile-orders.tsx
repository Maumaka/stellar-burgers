import {
  getOrdersThunk,
  ordersDataSelector as selectOrdersData
} from '@slices';
import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';

export const ProfileOrders: FC = () => {
  // диспатч для вызова thunk-ов
  const appDispatch = useDispatch();

  // заказы пользователя из стора
  const userOrders: TOrder[] = useSelector(selectOrdersData);

  // функция для загрузки заказов
  const fetchOrders = () => {
    appDispatch(getOrdersThunk());
  };

  // при монтировании компонента загружаем заказы
  useEffect(() => {
    fetchOrders();
  }, [appDispatch]);

  return <ProfileOrdersUI orders={userOrders} />;
};
