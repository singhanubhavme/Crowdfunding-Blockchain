import { useContext } from 'react';
import { NotificationContext } from '../context/notification';

function useNotificationContext() {
  return useContext(NotificationContext);
}

export default useNotificationContext;
