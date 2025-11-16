import { FC } from 'react';
import { TOrder } from '@utils-types';
import { FeedInfoUI } from '../ui/feed-info';
import { useSelector } from '../../services/store';
import {
  feedDataSelector as selectFeedData,
  feedTotalSelector as selectFeedTotal,
  feedTotalTodaySelector as selectFeedTotalToday
} from '@slices';

const pickOrderNumbers = (orders: TOrder[], status: string): number[] =>
  orders
    .filter((item) => item.status === status)
    .map((item) => item.number)
    .slice(0, 20);

export const FeedInfo: FC = () => {
  const feedOrders: TOrder[] = useSelector(selectFeedData);
  const overallTotal = useSelector(selectFeedTotal);
  const todayTotal = useSelector(selectFeedTotalToday);
  const totals = { total: overallTotal, totalToday: todayTotal };

  const doneOrders = pickOrderNumbers(feedOrders, 'done');
  const inProgressOrders = pickOrderNumbers(feedOrders, 'pending');

  return (
    <FeedInfoUI
      readyOrders={doneOrders}
      pendingOrders={inProgressOrders}
      feed={totals}
    />
  );
};
