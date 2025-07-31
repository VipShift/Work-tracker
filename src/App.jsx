// src/App.jsx
import { Route, Routes, NavLink } from 'react-router-dom';
import { UserCard, EditUser } from './components/user';
import { Home, Settings } from './components/navigation';
import { NowDate } from './components/user/now-date';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { fetchUsers } from './store/user-thunks';
import './App.css';

export default function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  return (
    <>
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
        </nav>
      </div>

      <main className="glass-main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/user/:id" element={<UserCard />} />
          <Route path="/edit-user/:id" element={<EditUser />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </main>
    </>
  );
}
