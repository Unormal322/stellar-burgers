import { FC, useMemo } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useSelector, useDispatch, RootState } from '../../services/store';
import { clearConstructor } from '../../services/slices/constructorSlice';
import { clearOrderModalData } from '../../services/slices/ordersSlice';

export const BurgerConstructor: FC = () => {
  /** TODO: взять переменные constructorItems, orderRequest и orderModalData из стора */
  const { bun, ingredients } = useSelector(
    (state: RootState) => state.constructor
  );
  const orderRequest = useSelector((state) => state.order.orderRequest);
  const orderModalData = useSelector((state) => state.order.orderModalData);
  const dispatch = useDispatch();
  const constructorItems = {
    bun,
    ingredients
  };

  const onOrderClick = () => {
    if (!constructorItems.bun || orderRequest) return;
  };

  const closeOrderModal = () => {
    dispatch(clearOrderModalData());
    dispatch(clearConstructor());
  };

  const price = useMemo(() => {
    const bunPrice = bun ? bun.price * 2 : 0;
    const ingredientsPrice = (ingredients || []).reduce(
      // Если ingredients === undefined, используем []
      (sum, item) => sum + item.price,
      0
    );
    return bunPrice + ingredientsPrice;
  }, [bun, ingredients]);

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
