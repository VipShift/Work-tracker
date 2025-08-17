// src/components/auth/register.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { registerUserFr } from '../../store/user-reducer';
import './register.css';

export const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleRegister = (e) => {
    e.preventDefault();
    dispatch(registerUserFr({ email, password, name: email.split('@')[0] }));
    navigate('/dashboard');
  };

  return (
    <div className="glass-container register-card">
      <h2 className="glass-title">Регистрация</h2>
      <form className="glass-form" onSubmit={handleRegister}>
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
          Зарегистрироваться
        </button>
      </form>
      <button
        className="glass-btn glass-btn-secondary"
        onClick={() => navigate('/login')}
      >
        Уже есть аккаунт?
      </button>
    </div>
  );
};
