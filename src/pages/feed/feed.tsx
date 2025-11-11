import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { feedDataSelector as selectFeedData, getFeedsThunk } from '@slices';

export const Feed: FC = () => {
  // диспатч для отправки thunk-ов в стор
  const appDispatch = useDispatch();

  // список заказов из стора
  const orders: TOrder[] = useSelector(selectFeedData);

  // функция для получения ленты заказов
  const fetchFeeds = () => {
    appDispatch(getFeedsThunk());
  };

  useEffect(() => {
    // загружаем ленту при монтировании компонента
    fetchFeeds();
  }, [appDispatch]);

  // если заказов ещё нет — показываем прелоадер
  if (!orders || !orders.length) {
    return <Preloader />;
  }

  // передаём список заказов и функцию для обновления в ui-компонент
  return <FeedUI orders={orders} handleGetFeeds={fetchFeeds} />;
};
