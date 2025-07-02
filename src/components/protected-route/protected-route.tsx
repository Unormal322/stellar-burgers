import { Navigate, useLocation } from 'react-router-dom';
import { ReactElement } from 'react';
import { Preloader } from '@ui';
import { userSelectors } from '../../services/selectors/userSelectors';
import { useSelector } from '../../services/store';

interface ProtectedRouteProps {
  onlyUnAuth?: boolean;
  children: ReactElement;
}

export const ProtectedRoute = ({
  onlyUnAuth = false,
  children
}: ProtectedRouteProps): ReactElement => {
  const location = useLocation();
  const isAuthChecked = useSelector(userSelectors.authChecked);
  const user = useSelector(userSelectors.user);

  if (!isAuthChecked) {
    return <Preloader />;
  }

  // Пользователь авторизован, но маршрут только для неавторизованных пользователей
  // либо перенаправляем пользователя на главную страницу, либо адрес из location.state.from
  if (onlyUnAuth && user) {
    const from = location.state?.from || '/';
    return <Navigate to={from} />;
  }

  // Пользователь не авторизован, но маршрут защищён, перенаправим на страницу авторизации с сохранением location
  if (!onlyUnAuth && !user) {
    return <Navigate to='/login' state={{ from: location }} />;
  }

  return children;
};
