import { FC, useMemo } from 'react';
import { BurgerConstructorUI } from '@ui';
import { useSelector, useDispatch } from '../../services/store';
import { clearConstructor } from '../../services/slices/constructorSlice';
import {
  clearOrderModalData,
  createOrder
} from '../../services/slices/ordersSlice';
import { constructorSelectors } from '../../services/selectors/constructorSelectors';
import { orderSelectors } from '../../services/selectors/orderSelectors';
import { useNavigate } from 'react-router-dom';
import { userSelectors } from '../../services/selectors/userSelectors';

export const BurgerConstructor: FC = () => {
  /** TODO: взять переменные constructorItems, orderRequest и orderModalData из стора */
  const { bun, ingredients } = useSelector(constructorSelectors.state);
  const orderRequest = useSelector(orderSelectors.request);
  const orderModalData = useSelector(orderSelectors.modalData);
  const dispatch = useDispatch();
  const authChecked = useSelector(userSelectors.authChecked);
  const user = useSelector(userSelectors.user);
  const navigate = useNavigate();

  const onOrderClick = () => {
    if (!bun || orderRequest) return;

    if (!authChecked || !user) {
      navigate('/login');
      return;
    }

    const ingredientsIds = [
      bun._id,
      ...ingredients.map((item) => item._id),
      bun._id
    ];

    dispatch(createOrder(ingredientsIds));
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
      constructorItems={{ bun, ingredients }}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
