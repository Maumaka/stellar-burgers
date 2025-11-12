import { useInView } from 'react-intersection-observer';
import { useState, useRef, useEffect, FC } from 'react';
import { TTabMode } from '@utils-types';
import { BurgerIngredientsUI } from '../ui/burger-ingredients';
import { useSelector } from '../../services/store';
import { ingredientsDataSelector } from '@slices';

export const BurgerIngredients: FC = () => {
  const ingredientsAll = useSelector(ingredientsDataSelector);
  const bunItems = ingredientsAll.filter((it) => it.type === 'bun');
  const mainItems = ingredientsAll.filter((it) => it.type === 'main');
  const sauceItems = ingredientsAll.filter((it) => it.type === 'sauce');
  const [activeSection, setActiveSection] = useState<TTabMode>('bun');

  const bunHeadingRef = useRef<HTMLHeadingElement | null>(null);
  const mainHeadingRef = useRef<HTMLHeadingElement | null>(null);
  const saucesHeadingRef = useRef<HTMLHeadingElement | null>(null);

  const [bunsRef, bunsVisible] = useInView({ threshold: 0.2 });
  const [mainsRef, mainsVisible] = useInView({ threshold: 0.2 });
  const [saucesRef, saucesVisible] = useInView({ threshold: 0.2 });

  useEffect(() => {
    if (bunsVisible) {
      setActiveSection('bun');
    } else if (mainsVisible) {
      setActiveSection('main');
    } else if (saucesVisible) {
      setActiveSection('sauce');
    }
  }, [bunsVisible, mainsVisible, saucesVisible]);

  const onTabSelect = (tab: TTabMode) => {
    setActiveSection(tab);
    if (tab === 'bun') {
      bunHeadingRef.current?.scrollIntoView({ behavior: 'smooth' });
    } else if (tab === 'main') {
      mainHeadingRef.current?.scrollIntoView({ behavior: 'smooth' });
    } else if (tab === 'sauce') {
      saucesHeadingRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <BurgerIngredientsUI
      currentTab={activeSection}
      buns={bunItems}
      mains={mainItems}
      sauces={sauceItems}
      titleBunRef={bunHeadingRef}
      titleMainRef={mainHeadingRef}
      titleSaucesRef={saucesHeadingRef}
      bunsRef={bunsRef}
      mainsRef={mainsRef}
      saucesRef={saucesRef}
      onTabClick={(tab) => onTabSelect(tab as TTabMode)}
    />
  );
};
