import { FC, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';
import { useDispatch, useSelector } from '../../services/store';
import {
  getOrderThunk,
  ingredientsDataSelector as selectIngredients,
  orderDataSelector as selectOrderData
} from '@slices';

export const OrderInfo: FC = () => {
  const appDispatch = useDispatch();
  const { number: orderNumberParam } = useParams<{ number?: string }>();

  // заказ, полученный из стора
  const fetchedOrder = useSelector(selectOrderData) as any | null;
  // все ингредиенты из стора
  const allIngredients: TIngredient[] = useSelector(selectIngredients) ?? [];

  useEffect(() => {
    if (!orderNumberParam) return;
    appDispatch(getOrderThunk(Number(orderNumberParam)));
  }, [appDispatch, orderNumberParam]);

  const preparedOrder = useMemo(() => {
    if (!fetchedOrder) return null;
    if (!Array.isArray(fetchedOrder.ingredients) || allIngredients.length === 0)
      return null;

    // создаём дату из поля createdAt
    const createdDate = new Date(fetchedOrder.createdAt);

    // собираем объект ингредиентов с подсчётом каждого id
    type TIngredientsWithCount = Record<
      string,
      TIngredient & { count: number }
    >;

    const ingredientsInfo = (
      fetchedOrder.ingredients as string[]
    ).reduce<TIngredientsWithCount>((acc, id) => {
      if (!acc[id]) {
        const found = allIngredients.find((ing) => ing._id === id);
        if (found) {
          acc[id] = { ...found, count: 1 };
        }
      } else {
        acc[id].count += 1;
      }
      return acc;
    }, {});

    // считаем общую сумму
    const total = Object.values(ingredientsInfo).reduce(
      (sum: number, item) => sum + (item.price ?? 0) * (item.count ?? 0),
      0
    );

    return {
      ...fetchedOrder,
      ingredientsInfo,
      date: createdDate,
      total
    };
  }, [fetchedOrder, allIngredients]);

  if (!preparedOrder) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={preparedOrder} />;
};
