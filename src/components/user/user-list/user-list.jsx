// src/components/user-cart/user-list.jsx

import './user-list.css';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { addWorkHour } from '../../../store/user-reducer';

export const UserList = () => {
  const users = useSelector((state) => state.userState.users);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [inputs, setInputs] = useState({});

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
      [userId]: { time: '', shiftType },
    }));
  };

  return (
    <>
      <div className="user-list-wrapper">
        <h2 className="glass-title">Список пользователей</h2>
        <div className="user-list-glass">
          {users.map((user) => {
            const userData = inputs[user.id] || {};
            const lastWork =
              Array.isArray(user.workingHours) && user.workingHours.length > 0
                ? user.workingHours[user.workingHours.length - 1]
                : null;

            return (
              <div className="user-one glass-item" key={user.id}>
                <p className="glass-text">
                  <span className="user-open">
                    <i
                      className="bi bi-arrows-fullscreen"
                      onClick={() => navigate(`/user/${user.id}`)}
                    >
                      {' '}
                    </i>
                  </span>
                  {user.name}
                </p>

                {lastWork && (
                  <p>
                    Последний рабочий час: {lastWork.date} — {lastWork.amount} ⏱
                  </p>
                )}
                <input
                  className="glass-input"
                  type="number"
                  placeholder="Часы"
                  value={userData.amount || ''}
                  onChange={(e) =>
                    handleChange(user.id, 'amount', e.target.value)
                  }
                />
                <select
                  className="glass-select"
                  value={userData.shiftType}
                  onChange={(e) =>
                    handleChange(user.id, 'shiftType', e.target.value)
                  }
                >
                  <option value="Стандарт">Стандарт</option>
                  <option value="Выходные">Выходные</option>
                </select>
                <i
                  className="bi bi-calendar-plus  glass-btn-add-hours"
                  onClick={() => handleAdd(user.id)}
                ></i>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};
