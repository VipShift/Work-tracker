// src/components/auth/login.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginUserFr } from '../../store/user-reducer';
import './login.css';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const cleanEmail = email.trim().toLowerCase();
      const cleanPassword = password.trim().toLowerCase();
      await dispatch(
        loginUserFr({ email: cleanEmail, password: cleanPassword })
      );
      navigate('/dashboard');
    } catch (error) {
      console.log('Ошибка логина:', error);
    }
  };

  return (
    <div className="glass-container login-card">
      <h2 className="glass-title">Вход</h2>
      <form className="glass-form" onSubmit={handleLogin}>
        <input
          className="glass-input"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          className="glass-input"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          required
        />
        <button className="glass-btn" type="submit">
          Войти
        </button>
      </form>
      <button
        className="glass-btn glass-btn-secondary"
        onClick={() => navigate('/register')}
      >
        Регистрация
      </button>
    </div>
  );
};
