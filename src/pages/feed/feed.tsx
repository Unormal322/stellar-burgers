import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import { useSelector, useDispatch } from '../../services/store';
import { fetchFeeds } from '../../services/slices/ordersSlice';
import { orderSelectors } from '../../services/selectors/orderSelectors';

export const Feed: FC = () => {
  /** TODO: взять переменную из стора */
  const dispatch = useDispatch();
  const { feeds } = useSelector(orderSelectors.state);

  // Загружаем данные при монтировании
  useEffect(() => {
    dispatch(fetchFeeds());
  }, [dispatch]);

  // Функция обновления данных
  const updateFeeds = () => {
    dispatch(fetchFeeds());
  };

  if (!feeds?.orders?.length) {
    return <Preloader />;
  }

  return <FeedUI orders={feeds.orders} handleGetFeeds={updateFeeds} />;
};
