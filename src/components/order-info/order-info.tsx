import { FC, useMemo, useEffect } from 'react';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';
import { useSelector, useDispatch } from '../../services/store';
import { useParams } from 'react-router-dom';
import { ingredientsSelectors } from '../../services/selectors/ingredientsSelectors';
import { orderSelectors } from '../../services/selectors/orderSelectors';
import { fetchOrderByNumber } from '../../services/slices/ordersSlice';
import { userSelectors } from '../../services/selectors/userSelectors';

export const OrderInfo: FC = () => {
  const { number } = useParams<{ number: string }>();
  const dispatch = useDispatch();

  // Получаем данные из стора
  const ingredients = useSelector(ingredientsSelectors.items);
  const authChecked = useSelector(userSelectors.authChecked);
  const orders = useSelector(orderSelectors.selectOrders);
  const userOrders = useSelector(orderSelectors.userOrders);
  const currentOrder = useSelector(orderSelectors.currentOrder);
  const modalData = useSelector(orderSelectors.modalData);
  const loading = useSelector(orderSelectors.request);

  // Ищем заказ в разных источниках данных
  const orderData = useMemo(() => {
    if (!number) return null;
    const orderNumber = parseInt(number);

    return (
      orders.find((order) => order.number === orderNumber) ||
      (userOrders
        ? userOrders.find((order) => order.number === orderNumber)
        : null) ||
      (currentOrder && currentOrder.number === orderNumber
        ? currentOrder
        : null) ||
      modalData
    );
  }, [number, orders, userOrders, currentOrder, modalData]);

  // Если заказ не найден, пытаемся загрузить его по номеру
  useEffect(() => {
    if (number && !orderData && !loading) {
      dispatch(fetchOrderByNumber(parseInt(number)));
    }
  }, [number, orderData, loading, dispatch]);

  // Если заказ не найден, пытаемся загрузить его по номеру
  useEffect(() => {
    if (number && !orderData && !loading) {
      dispatch(fetchOrderByNumber(parseInt(number)));
    }
  }, [number, orderData, loading, dispatch]);

  /* Готовим данные для отображения */
  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  if (!orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
