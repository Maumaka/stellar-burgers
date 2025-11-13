import { FC, memo, useMemo } from 'react';
import { useLocation } from 'react-router-dom';

import { OrderCardProps } from './type';
import { TIngredient } from '@utils-types';
import { OrderCardUI } from '../ui/order-card';
import { useSelector } from '../../services/store';
import { ingredientsDataSelector as selectIngredients } from '@slices';

const MAX_ITEMS_SHOWN = 6;

export const OrderCard: FC<OrderCardProps> = memo(({ order }) => {
  const currentLocation = useLocation();

  const allIngredients: TIngredient[] = useSelector(selectIngredients);

  const computedOrder = useMemo(() => {
    if (!allIngredients.length) return null;

    const byId: Record<string, TIngredient> = {};
    for (const ing of allIngredients) {
      if (ing && ing._id) byId[ing._id] = ing;
    }

    const mappedIngredients: TIngredient[] = order.ingredients.reduce(
      (acc: TIngredient[], id: string) => {
        const found = byId[id];
        if (found) acc.push(found);
        return acc;
      },
      []
    );

    const total = mappedIngredients.reduce((sum, it) => sum + it.price, 0);
    const visibleIngredients = mappedIngredients.slice(0, MAX_ITEMS_SHOWN);

    const extraCount =
      mappedIngredients.length > MAX_ITEMS_SHOWN
        ? mappedIngredients.length - MAX_ITEMS_SHOWN
        : 0;
    const createdDate = new Date(order.createdAt);

    return {
      ...order,
      ingredientsInfo: mappedIngredients,
      ingredientsToShow: visibleIngredients,
      remains: extraCount,
      total,
      date: createdDate
    };
  }, [order, allIngredients]);

  if (!computedOrder) return null;

  return (
    <OrderCardUI
      orderInfo={computedOrder}
      maxIngredients={MAX_ITEMS_SHOWN}
      locationState={{ background: currentLocation }}
    />
  );
});
