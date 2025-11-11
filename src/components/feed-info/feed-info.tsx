import { FC } from 'react';
import { TOrder } from '@utils-types';
import { FeedInfoUI } from '../ui/feed-info';
import { useSelector } from '../../services/store';
import {
  feedDataSelector as selectFeedData,
  feedTotalSelector as selectFeedTotal,
  feedTotalTodaySelector as selectFeedTotalToday
} from '@slices';

// выбираем номера заказов по статусу (ограничиваем до 20)
const pickOrderNumbers = (orders: TOrder[], status: string): number[] =>
  orders
    .filter((item) => item.status === status)
    .map((item) => item.number)
    .slice(0, 20);

export const FeedInfo: FC = () => {
  // достаём список заказов из стора
  const feedOrders: TOrder[] = useSelector(selectFeedData);

  // общее количество завершённых и сегодняшних заказов
  const overallTotal = useSelector(selectFeedTotal);
  const todayTotal = useSelector(selectFeedTotalToday);

  // объект с общими числами для передачи в ui
  const totals = { total: overallTotal, totalToday: todayTotal };

  // готовые и ожидающие заказы (по номерам)
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
