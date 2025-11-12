import { FC } from 'react';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import { useParams } from 'react-router-dom';
import { useSelector } from '../../services/store';
import { ingredientsDataSelector as selectIngredients } from '@slices';

export const IngredientDetails: FC = () => {
  const allIngredients = useSelector(selectIngredients);
  const routeParams = useParams();
  const id = routeParams.id;

  const foundIngredient = allIngredients.find((item) => item._id === id);

  if (!foundIngredient) {
    return <Preloader />;
  }

  return <IngredientDetailsUI ingredientData={foundIngredient} />;
};
