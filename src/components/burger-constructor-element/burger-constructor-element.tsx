import { FC, memo } from 'react';
import { BurgerConstructorElementUI } from '@ui';
import { BurgerConstructorElementProps } from './type';
import {
  moveDownIngredient,
  moveUpIngredient,
  removeIngredient
} from '@slices';
import { useDispatch } from '../../services/store';

export const BurgerConstructorElement: FC<BurgerConstructorElementProps> = memo(
  ({ ingredient, index, totalItems }) => {
    const appDispatch = useDispatch();

    const onMoveDown = () => {
      appDispatch(moveDownIngredient(index));
    };

    const onMoveUp = () => {
      appDispatch(moveUpIngredient(index));
    };

    const onRemove = () => {
      if (!ingredient?.id) return;
      appDispatch(removeIngredient(ingredient.id));
    };

    return (
      <BurgerConstructorElementUI
        ingredient={ingredient}
        index={index}
        totalItems={totalItems}
        handleMoveUp={onMoveUp}
        handleMoveDown={onMoveDown}
        handleClose={onRemove}
      />
    );
  }
);
