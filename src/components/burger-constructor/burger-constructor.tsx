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
  // навигатор для переходов между страницами
  const routerNavigate = useNavigate();

  // диспатч для отправки действий в стор
  const appDispatch = useDispatch();

  // флаг, указывающий, авторизован ли пользователь
  const userIsAuthenticated = useSelector(selectIsAuth);

  // данные конструктора (булка + ингредиенты)
  const constructorState = useSelector(selectConstructorData);

  // флаг, что запрос на создание заказа в процессе
  const isOrderPending = useSelector(selectOrderRequest);

  // данные для модального окна заказа
  const orderModalState = useSelector(selectOrderModalData);

  // обработчик нажатия на кнопку "оформить заказ"
  const onOrderClick = () => {
    // если пользователь не авторизован — отправляем на страницу логина
    if (!userIsAuthenticated) {
      routerNavigate('/login');
      return;
    }

    // если нет булки или уже идёт запрос — ничего не делаем
    if (!constructorState.bun || isOrderPending) return;

    // собираем массив id ингредиентов (начало и конец — булка)
    const order = [
      constructorState.bun?._id,
      ...constructorState.ingredients.map((ingredient) => ingredient._id),
      constructorState.bun?._id
    ].filter(Boolean);

    // отправляем thunk для создания бургера
    appDispatch(createBurgerThunk(order));
  };

  // закрыть модалку заказа и сбросить данные
  const closeOrderModal = () => {
    appDispatch(setOrderRequest(false));
    appDispatch(clearOrderModalData());
  };

  // вычисляем итоговую стоимость бургера
  const price = useMemo(
    () =>
      (constructorState.bun ? constructorState.bun.price * 2 : 0) +
      constructorState.ingredients.reduce(
        (sum: number, item: TConstructorIngredient) => sum + item.price,
        0
      ),
    [constructorState]
  );

  // рендерим презентационную часть конструктора
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
