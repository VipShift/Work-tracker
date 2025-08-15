// src/components/user-cart/user-card.jsx
import './user-card.css';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  updateWorkHourInFr,
  deleteWorkHourFromFr,
  deleteUserFr,
} from '../../../store/user-reducer';
import { useState, useEffect } from 'react';

export const UserCard = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);

  const user = useSelector((state) =>
    state.userState.users.find((u) => u.id === id)
  );

  const [editingHours, setEditingHours] = useState({});

  useEffect(() => {
    if (user?.workingHours) {
      setEditingHours({ ...user.workingHours });
    }
  }, [user]);

  if (!user) {
    return <p className="glass-text">Пользователь не найден</p>;
  }

  const handleChange = (hourId, field, value) => {
    setEditingHours((prev) => ({
      ...prev,
      [hourId]: {
        ...prev[hourId],
        [field]: value,
      },
    }));
  };

  const handleSave = (hourId) => {
    const entry = editingHours[hourId];
    dispatch(
      updateWorkHourInFr({
        userId: user.id,
        hourId,
        updatedHour: {
          amount: Number(entry.amount),
          date: entry.date,
          time: entry.time ?? '',
          shiftType: entry.shiftType,
        },
      })
    );
  };

  const handleDeleteHour = (hourId) => {
    if (window.confirm('Удалить эту запись?')) {
      dispatch(deleteWorkHourFromFr({ userId: user.id, hourId }));
    }
  };

  const handleDeleteUser = (userId) => {
    if (window.confirm('Удалить пользователя?')) {
      dispatch(deleteUserFr(userId));
    }
  };

  return (
    <div className="user-card-gradient glass-card">
      <h2 className="glass-title">Карточка пользователя</h2>
      <p className="glass-text">Имя: {user.name}</p>
      <p className="glass-text">Возраст: {user.age}</p>
      <p className="glass-text">Телефон: {user.phone}</p>
      <button
        className="glass-btn"
        onClick={() => navigate(`/edit-user/${user.id}`)}
      >
        <i className="bi bi-pencil-square"></i> Редактировать{' '}
        <i class="bi bi-person"></i>
      </button>
      <button className="glass-btn" onClick={() => handleDeleteUser(user.id)}>
        {' '}
        <i className="bi bi-trash"></i> Удалить {''}
        <i class="bi bi-person"></i>
      </button>
      <button
        className="glass-btn"
        onClick={() => setIsEditing((prev) => !prev)}
      >
        {' '}
        <i className="bi bi-pencil-square"></i>
        {isEditing ? ' Отменить редактирование' : ' Редактировать '} ⏱
      </button>
      <hr />
      <h3 className="glass-subtitle">Рабочие часы:</h3>
      {!isEditing && (
        <ul className="glass-list">
          {user.workingHours && Object.entries(user.workingHours).length > 0 ? (
            Object.entries(user.workingHours)
              .reverse()
              .map(([hourId, entry]) => (
                <li className="glass-item" key={hourId}>
                  <span className="date">{entry.date}</span>

                  <span className="amount">{entry.amount} ч</span>
                  <span className="type">({entry.shiftType})</span>
                </li>
              ))
          ) : (
            <p className="glass-text">⏳ Пока нет записей</p>
          )}{' '}
        </ul>
      )}

      {isEditing && (
        <ul className="glass-list">
          {Object.entries(editingHours)
            .reverse()
            .map(([hourId, entry]) => (
              <li
                className="glass-item"
                key={hourId}
                style={{ marginBottom: '10px' }}
              >
                <div className="flex-column">
                  <span className="date">{entry.date}</span>
                  <input
                    className="glass-input"
                    type="number"
                    value={entry.amount}
                    onChange={(e) =>
                      handleChange(hourId, 'amount', e.target.value)
                    }
                  />{' '}
                  <input
                    className="glass-input"
                    type="date"
                    value={entry.date}
                    onChange={(e) =>
                      handleChange(hourId, 'date', e.target.value)
                    }
                  />{' '}
                  <select
                    className="glass-select"
                    value={entry.shiftType}
                    onChange={(e) =>
                      handleChange(hourId, 'shiftType', e.target.value)
                    }
                  >
                    <option value="Стандарт">Стандарт</option>
                    <option value="Выходные">Выходные</option>
                  </select>{' '}
                  <div className="button-row">
                    <button
                      className="glass-btn"
                      onClick={() => handleSave(hourId)}
                    >
                      <i className="bi bi-save"></i>
                    </button>{' '}
                    <button
                      className="glass-btn"
                      onClick={() => handleDeleteHour(hourId)}
                    >
                      <i className="bi bi-trash"></i>
                    </button>
                  </div>
                </div>
              </li>
            ))}
        </ul>
      )}
    </div>
  );
};
