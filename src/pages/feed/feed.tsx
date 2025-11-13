import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { feedDataSelector as selectFeedData, getFeedsThunk } from '@slices';

export const Feed: FC = () => {
  const appDispatch = useDispatch();
  const orders: TOrder[] = useSelector(selectFeedData);
  const fetchFeeds = () => {
    appDispatch(getFeedsThunk());
  };

  useEffect(() => {
    fetchFeeds();
  }, [appDispatch]);

  if (!orders || !orders.length) {
    return <Preloader />;
  }

  return <FeedUI orders={orders} handleGetFeeds={fetchFeeds} />;
};
