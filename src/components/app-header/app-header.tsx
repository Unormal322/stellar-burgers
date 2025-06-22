import { FC } from 'react';
import { AppHeaderUI } from '@ui';
import { useSelector } from '../../services/store';
import { userSelectors } from '../../services/selectors/userSelectors';

export const AppHeader: FC = () => {
  const user = useSelector(userSelectors.user);
  return <AppHeaderUI userName={user?.name || ''} />;
};
