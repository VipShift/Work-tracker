// src/components/auth/login.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginUserFr } from '../../store/user-reducer';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await dispatch(loginUserFr({ email, password }));
      navigate('/dashboard');
    } catch (error) {
      console.log('Ошибка логина:', error);
    }
  };

  return (
    <>
      <form onSubmit={handleLogin}>
        <h2>Вход</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
        />
        <button type="submit">Войти</button>
      </form>
      <button onClick={() => navigate('/register')}>Регистрация</button>
    </>
  );
};
