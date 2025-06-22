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
  // Затычка, далее будет проверка авторизации
  const isAuth = useSelector(userSelectors.isAuth);

  if (!isAuth) {
    return <Preloader />;
  }

  // Пользователь авторизован, но маршрут только для неавторизованных пользователей
  // либо перенаправляем пользователя на главную страницу, либо адрес из location.state.from
  if (onlyUnAuth && isAuth) {
    const from = location.state?.from || '/';
    return <Navigate to={from} />;
  }

  // Пользователь не авторизован, но маршрут защищён, перенаправим на страницу авторизации с сохранением location
  if (!onlyUnAuth && !isAuth) {
    return <Navigate to='/login' state={{ from: location }} />;
  }

  return children;
};
