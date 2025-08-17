import { useEffect, useState } from 'react';
import { auth, db } from '../../../firebase';
import { ref, onValue } from 'firebase/database';
import { useDispatch } from 'react-redux';
import {
  subscribeToUsersRealtime,
  logoutUserFr,
} from '../../../store/user-reducer';
import './dashboard.css';

export const Dashboard = () => {
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [loadingUser, setLoadingUser] = useState(true);
  const dispatch = useDispatch();
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setLoadingAuth(false);
      if (user) {
        const userRef = ref(db, `users/${user.uid}`);
        onValue(userRef, (snapshot) => {
          const data = snapshot.val();
          setCurrentUser(data);
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
      <div className="dashboard-glass">
        <h2>
          <i className="bi bi-person"></i>{' '}
          {currentUser.email ? currentUser.email.split('@')[0] : 'Гость'}
        </h2>
        <button className="dashboard-btn" onClick={handleLogout}>
          Выйти
        </button>
      </div>
    </>
  );
};
