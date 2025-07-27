// src/App.jsx
import { Route, Routes, Link } from 'react-router';
import { UserCard } from './components/user-cart';
import { Home, Settings } from './components/navigation';
import './App.css';
import { EditUser } from './components/user-cart';

export default function App() {
  return (
    <>
      <div className="container">
        <nav className="nav">
          <Link to="/">Главная</Link>
          <Link to="/settings">Настройки</Link>
        </nav>
      </div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/user/:id" element={<UserCard />} />
        <Route path="/edit-user/:id" element={<EditUser />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </>
  );
}
