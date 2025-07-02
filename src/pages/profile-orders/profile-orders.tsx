import { ProfileOrdersUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import { useSelector, useDispatch } from '../../services/store';
import { fetchUserOrders } from '../../services/slices/ordersSlice';
import { orderSelectors } from '../../services/selectors/orderSelectors';
import { userSelectors } from '../../services/selectors/userSelectors';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();
  const userOrders = useSelector(orderSelectors.userOrders);
  const authChecked = useSelector(userSelectors.authChecked);

  useEffect(() => {
    if (authChecked) {
      dispatch(fetchUserOrders());
    }
  }, [dispatch, authChecked]);

  return <ProfileOrdersUI orders={userOrders || []} />;
};
