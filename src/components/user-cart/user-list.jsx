// src/components/user-cart/user-list.jsx

import './user-list.css';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { addWorkHour } from '../../store/user-reducer';

export const UserList = () => {
  const users = useSelector((state) => state.userState.users);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [inputs, setInputs] = useState({}); // userId -> { amount, time, shiftType }

  const handleChange = (userId, field, value) => {
    setInputs((prev) => ({
      ...prev,
      [userId]: {
        ...prev[userId],
        [field]: value,
      },
    }));
  };

  const handleAdd = (userId) => {
    const data = inputs[userId] || {};
    const { time, amount = 10, shiftType = 'Стандарт' } = data;

    const today = new Date().toISOString().split('T')[0];

    dispatch(
      addWorkHour({
        userId,
        amount: Number(amount),
        shiftType,
        date: today,
        time,
      })
    );

    // Очистим поля после добавления
    setInputs((prev) => ({
      ...prev,
      [userId]: { time: '', amount: '', shiftType },
    }));
  };

  return (
    <div>
      <h2>Список пользователей</h2>
      {users.map((user) => {
        const userData = inputs[user.id] || {};

        return (
          <div className="user-one" key={user.id}>
            <p onClick={() => navigate(`/user/${user.id}`)}>{user.name}</p>
            <input
              type="number"
              placeholder="Часы"
              value={userData.amount || ''}
              onChange={(e) => handleChange(user.id, 'amount', e.target.value)}
            />{' '}
            <select
              value={userData.shiftType || 'Стандарт'}
              onChange={(e) =>
                handleChange(user.id, 'shiftType', e.target.value)
              }
            >
              <option value="Стандарт">Стандарт</option>
              <option value="Выходные">Выходные</option>
            </select>{' '}
            <button onClick={() => handleAdd(user.id)}>Добавить</button>
          </div>
        );
      })}
    </div>
  );
};
