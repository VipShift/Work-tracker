import { useEffect, useState } from 'react';
import { auth, db } from '../../../firebase';
import { ref, onValue } from 'firebase/database';
import { useDispatch } from 'react-redux';
import {
  subscribeToUsersRealtime,
  logoutUserFr,
} from '../../../store/user-reducer';

export const Dashboard = () => {
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [loadingUser, setLoadingUser] = useState(true);
  const dispatch = useDispatch();
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      console.log('onAuthStateChanged:', user); // Debug: вывод состояния аутентификации
      setLoadingAuth(false);
      if (user) {
        const userRef = ref(db, `users/${user.uid}`);
        onValue(userRef, (snapshot) => {
          const data = snapshot.val();
          setCurrentUser(data);
          // Если в базе данных нет данных, используем информацию из аутентификации
          setCurrentUser({ email: user.email, name: user.displayName });

          setLoadingUser(false);
        });
        dispatch(subscribeToUsersRealtime());
      } else {
        setCurrentUser(null);
        setLoadingUser(false);
      }
    });

    return () => unsubscribe();
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(logoutUserFr());
    window.location.reload();
  };

  if (loadingAuth || loadingUser) return <p>Загрузка...</p>;
  if (!currentUser) return <p>Пользователь не авторизован</p>;
  return (
    <>
      <h2>Привет, {currentUser.email || 'Гость'}</h2>
      <button onClick={handleLogout}>Выйти</button>
    </>
  );
};
