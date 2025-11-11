import { FC } from 'react';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import { useParams } from 'react-router-dom';
import { useSelector } from '../../services/store';
import { ingredientsDataSelector as selectIngredients } from '@slices';

export const IngredientDetails: FC = () => {
  // список всех ингредиентов из стора
  const allIngredients = useSelector(selectIngredients);

  // параметры роута (ожидаем id)
  const routeParams = useParams();
  const id = routeParams.id;

  // пытаемся найти ингредиент по id
  const foundIngredient = allIngredients.find((item) => item._id === id);

  // если ингредиент не найден — показываем прелоадер
  if (!foundIngredient) {
    return <Preloader />;
  }

  // рендерим презентационный ui с найденными данными
  return <IngredientDetailsUI ingredientData={foundIngredient} />;
};
