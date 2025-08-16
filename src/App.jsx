// src/App.jsx
import { Route, Routes, NavLink, Navigate } from 'react-router-dom';
import { UserCard, EditUser } from './components/user';
import { Dashboard } from './components/navigation/dashboard';
import { Home, Settings } from './components/navigation';
import { NowDate } from './components/user/now-date';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { auth } from './firebase';
import { subscribeToUsersRealtime } from './store/user-reducer';
import { Login, Register } from './components/auth';
import './App.css';

export default function App() {
  const dispatch = useDispatch();
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
      setUser(firebaseUser);
      setLoadingAuth(false);
      if (firebaseUser) {
        dispatch(subscribeToUsersRealtime());
      }
    });
    return () => unsubscribe();
  }, [dispatch]);

  const PrivateRoute = ({ children }) => {
    return user ? children : <Navigate to="/login" />;
  };

  const PublicRoute = ({ children }) => {
    if (loadingAuth) return <p>Загрузка...</p>;
    return !user ? children : <Navigate to="/" />;
  };
  return (
    <>
      {user && (
        <div className="glass-app-container">
          <nav className="glass-navbar">
            <NowDate />
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive ? 'glass-link active' : 'glass-link'
              }
            >
              <i className="bi bi-house-fill"></i>
            </NavLink>

            <NavLink
              to="/settings"
              className={({ isActive }) =>
                isActive ? 'glass-link active' : 'glass-link'
              }
            >
              <i className="bi bi-gear-fill"></i>
            </NavLink>
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                isActive ? 'glass-link active' : 'glass-link'
              }
            >
              <i className="bi bi-person"></i>
            </NavLink>
          </nav>
        </div>
      )}

      <main className="glass-main">
        <Routes>
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />{' '}
              </PublicRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicRoute>
                <Register />{' '}
              </PublicRoute>
            }
          />

          <Route
            path="/"
            element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            }
          />
          <Route
            path="/user/:id"
            element={
              <PrivateRoute>
                <UserCard />
              </PrivateRoute>
            }
          />
          <Route
            path="/edit-user/:id"
            element={
              <PrivateRoute>
                <EditUser />{' '}
              </PrivateRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <PrivateRoute>
                <Settings />{' '}
              </PrivateRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />{' '}
              </PrivateRoute>
            }
          />
          <Route path="*" element={<Navigate to={user ? '/' : '/login'} />} />
        </Routes>
      </main>
    </>
  );
}
