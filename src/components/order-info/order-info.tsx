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
interface IOrder {
  _id: string;
  ingredients: string[];
  status: 'created' | 'pending' | 'done';
  name: string;
  createdAt: string;
  updatedAt: string;
  number: number;
}

interface IPreparedOrder extends IOrder {
  ingredientsInfo: Record<string, TIngredient & { count: number }>;
  date: Date;
  total: number;
}

export const OrderInfo: FC = () => {
  const appDispatch = useDispatch();
  const { number: orderNumberParam } = useParams<{ number?: string }>();

  const fetchedOrder = useSelector(selectOrderData) as IOrder | null;
  const allIngredients: TIngredient[] = useSelector(selectIngredients) ?? [];

  useEffect(() => {
    if (!orderNumberParam) return;
    appDispatch(getOrderThunk(Number(orderNumberParam)));
  }, [appDispatch, orderNumberParam]);

  const preparedOrder = useMemo(() => {
    if (!fetchedOrder) return null;
    if (!Array.isArray(fetchedOrder.ingredients) || allIngredients.length === 0)
      return null;

    const createdDate = new Date(fetchedOrder.createdAt);

    type TIngredientsWithCount = Record<
      string,
      TIngredient & { count: number }
    >;

    const ingredientsInfo =
      fetchedOrder.ingredients.reduce<TIngredientsWithCount>((acc, id) => {
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

    const total = Object.values(ingredientsInfo).reduce(
      (sum: number, item) => sum + (item.price ?? 0) * (item.count ?? 0),
      0
    );

    return {
      ...fetchedOrder,
      ingredientsInfo,
      date: createdDate,
      total
    } as IPreparedOrder;
  }, [fetchedOrder, allIngredients]);

  if (!preparedOrder) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={preparedOrder} />;
};
