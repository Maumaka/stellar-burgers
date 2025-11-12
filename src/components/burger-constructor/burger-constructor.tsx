import { FC, useMemo } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useNavigate } from 'react-router-dom';
import store, { useDispatch, useSelector } from '../../services/store';
import {
  clearOrderModalData,
  constructorDataSelector as selectConstructorData,
  createBurgerThunk,
  isAuthSelector as selectIsAuth,
  orderModalDataSelector as selectOrderModalData,
  orderRequestSelector as selectOrderRequest,
  setOrderRequest
} from '@slices';

export const BurgerConstructor: FC = () => {
  const routerNavigate = useNavigate();
  const appDispatch = useDispatch();
  const userIsAuthenticated = useSelector(selectIsAuth);
  const constructorState = useSelector(selectConstructorData);
  const isOrderPending = useSelector(selectOrderRequest);
  const orderModalState = useSelector(selectOrderModalData);

  const onOrderClick = () => {
    if (!userIsAuthenticated) {
      routerNavigate('/login');
      return;
    }

    if (!constructorState.bun || isOrderPending) return;

    const order = [
      constructorState.bun?._id,
      ...constructorState.ingredients.map((ingredient) => ingredient._id),
      constructorState.bun?._id
    ].filter(Boolean);

    appDispatch(createBurgerThunk(order));
  };

  const closeOrderModal = () => {
    appDispatch(setOrderRequest(false));
    appDispatch(clearOrderModalData());
  };

  const price = useMemo(
    () =>
      (constructorState.bun ? constructorState.bun.price * 2 : 0) +
      constructorState.ingredients.reduce(
        (sum: number, item: TConstructorIngredient) => sum + item.price,
        0
      ),
    [constructorState]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={isOrderPending}
      constructorItems={constructorState}
      orderModalData={orderModalState}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};

//
