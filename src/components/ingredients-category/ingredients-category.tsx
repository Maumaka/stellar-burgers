import { forwardRef, useMemo } from 'react';
import { TIngredientsCategoryProps } from './type';
import { TIngredient } from '@utils-types';
import { IngredientsCategoryUI } from '../ui/ingredients-category';
import { useSelector } from '../../services/store';
import { constructorDataSelector as selectConstructorData } from '@slices';

export const IngredientsCategory = forwardRef<
  HTMLUListElement,
  TIngredientsCategoryProps
>(({ title, titleRef, ingredients }, ref) => {
  // данные конструктора (булка и список ингредиентов) из стора
  const constructorState = useSelector(selectConstructorData);

  // создаём мапу счётчиков по id ингредиента на основе текущего конструктора
  const ingredientsCounters = useMemo(() => {
    const { bun, ingredients: constructorIngredients } = constructorState || {};
    const counters: Record<string, number> = {};

    // считаем, сколько раз каждый ингредиент встречается в текущем заказе
    if (Array.isArray(constructorIngredients)) {
      for (const item of constructorIngredients) {
        if (!item || !item._id) continue;
        counters[item._id] = (counters[item._id] || 0) + 1;
      }
    }

    // булка учитывается дважды (верх + низ)
    if (bun && bun._id) {
      counters[bun._id] = 2;
    }

    return counters;
    // зависимости: пересчитываем при изменении состояния конструктора
  }, [constructorState]);

  return (
    <IngredientsCategoryUI
      title={title}
      titleRef={titleRef}
      ingredients={ingredients}
      ingredientsCounters={ingredientsCounters}
      ref={ref}
    />
  );
});
