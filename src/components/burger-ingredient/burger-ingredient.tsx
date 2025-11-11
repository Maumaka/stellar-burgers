import { FC, memo } from 'react';
import { useLocation } from 'react-router-dom';
import { useDispatch } from '../../services/store';
import { addIngredient } from '@slices';
import { BurgerIngredientUI } from '@ui';
import { TBurgerIngredientProps } from './type';

export const BurgerIngredient: FC<TBurgerIngredientProps> = memo(
  ({ ingredient, count }) => {
    // хук для получения текущей локации (используется для модальных роутов)
    const currentLocation = useLocation();

    // диспатч для отправки действий в стор
    const appDispatch = useDispatch();

    // обработчик добавления ингредиента в конструктор
    const onAddIngredient = () => {
      appDispatch(addIngredient(ingredient));
    };

    return (
      <BurgerIngredientUI
        ingredient={ingredient}
        count={count}
        locationState={{ background: currentLocation }}
        handleAdd={onAddIngredient}
      />
    );
  }
);
