import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import './App.css';

// Схема валидации с Yup
const schema = yup.object().shape({
  email: yup
    .string()
    .email('Введите корректный email')
    .required('Email обязателен'),
  password: yup
    .string()
    .min(6, 'Пароль должен быть не менее 6 символов')
    .required('Пароль обязателен'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Пароли не совпадают')
    .required('Повторите пароль'),
});

export default function App() {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    setFocus,
  } = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange',
  });

  const onSubmit = (data) => {
    console.log('Данные формы:', data);
    alert('Регистрация успешна! Проверь консоль.');
  };

  return (
    <div className="container">
      <h2>Регистрация пользователя</h2>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="field">
          <label htmlFor="email">Email:</label>
          <input
            id="email"
            {...register('email')}
            className={errors.email ? 'input-error' : ''}
            onBlur={() => {
              if (isValid) setFocus('submitBtn');
            }}
          />
          {errors.email && (
            <span className="error">{errors.email.message}</span>
          )}
        </div>

        <div className="field">
          <label htmlFor="password">Пароль:</label>
          <input
            id="password"
            type="password"
            {...register('password')}
            className={errors.password ? 'input-error' : ''}
          />
          {errors.password && (
            <span className="error">{errors.password.message}</span>
          )}
        </div>

        <div className="field">
          <label htmlFor="confirmPassword">Повторите пароль:</label>
          <input
            id="confirmPassword"
            type="password"
            {...register('confirmPassword')}
            className={errors.confirmPassword ? 'input-error' : ''}
          />
          {errors.confirmPassword && (
            <span className="error">{errors.confirmPassword.message}</span>
          )}
        </div>

        <button type="submit" disabled={!isValid} name="submitBtn">
          Зарегистрироваться
        </button>
      </form>
    </div>
  );
}
