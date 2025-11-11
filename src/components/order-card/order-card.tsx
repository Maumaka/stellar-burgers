import { FC, memo, useMemo } from 'react';
import { useLocation } from 'react-router-dom';

import { OrderCardProps } from './type';
import { TIngredient } from '@utils-types';
import { OrderCardUI } from '../ui/order-card';
import { useSelector } from '../../services/store';
import { ingredientsDataSelector as selectIngredients } from '@slices';

const MAX_ITEMS_SHOWN = 6;

export const OrderCard: FC<OrderCardProps> = memo(({ order }) => {
  // текущая локация, нужна для модальных роутов
  const currentLocation = useLocation();

  // все доступные ингредиенты из стора
  const allIngredients: TIngredient[] = useSelector(selectIngredients);

  // вычисляем информацию о заказе: совпавшие ингредиенты, сумма, сколько скрыто и т.д.
  const computedOrder = useMemo(() => {
    if (!allIngredients.length) return null;

    // делаем быстрый словарь по id для поиска ингредиента
    const byId: Record<string, TIngredient> = {};
    for (const ing of allIngredients) {
      if (ing && ing._id) byId[ing._id] = ing;
    }

    // собираем реальные объекты ингредиентов для заказа в том же порядке
    const mappedIngredients: TIngredient[] = order.ingredients.reduce(
      (acc: TIngredient[], id: string) => {
        const found = byId[id];
        if (found) acc.push(found);
        return acc;
      },
      []
    );

    // общая стоимость заказа
    const total = mappedIngredients.reduce((sum, it) => sum + it.price, 0);

    // ингредиенты, которые показываем в карточке
    const visibleIngredients = mappedIngredients.slice(0, MAX_ITEMS_SHOWN);

    // сколько ещё ингредиентов не показываем
    const extraCount =
      mappedIngredients.length > MAX_ITEMS_SHOWN
        ? mappedIngredients.length - MAX_ITEMS_SHOWN
        : 0;

    // дата создания заказа как объект для удобного форматирования в ui
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
