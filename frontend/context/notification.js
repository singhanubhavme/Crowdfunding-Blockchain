import { createContext } from 'react';
import { useNotification } from 'web3uikit';
const NotificationContext = createContext();

function HandleNotificationProvider({ children }) {
  const dispatch = useNotification();

  const handleNotification = (type, msg, icon) => {
    dispatch({
      type: type,
      message: msg,
      title: 'Tx Notification',
      position: 'bottomL',
      icon: icon,
    });
  };
  const value = {
    handleNotification,
  };
  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

export { NotificationContext, HandleNotificationProvider };
