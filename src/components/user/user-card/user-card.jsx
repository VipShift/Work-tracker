// src/components/user-cart/user-card.jsx

import './user-card.css';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { updateWorkHour, deleteWorkHour } from '../../../store/user-reducer';
import { useState, useEffect } from 'react';

export const UserCard = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector((state) =>
    state.userState.users.find((u) => u.id === Number(id))
  );

  const [localHours, setLocalHours] = useState([]);

  useEffect(() => {
    if (user?.workingHours && Array.isArray(user.workingHours)) {
      setLocalHours(user.workingHours);
    } else {
      setLocalHours([]);
    }
  }, [user?.workingHours]);

  const handleChange = (hourId, field, value) => {
    setLocalHours((prev) =>
      prev.map((entry) =>
        entry.id === hourId ? { ...entry, [field]: value } : entry
      )
    );
  };

  const handleSave = (entry) => {
    dispatch(
      updateWorkHour({
        userId: user.id,
        hourId: entry.id,
        newAmount: Number(entry.amount),
        newDate: entry.date,
        newTime: entry.time,
        newShiftType: entry.shiftType,
      })
    );
  };

  if (!user) {
    return <p className="glass-text">Пользователь не найден</p>;
  }

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
        <i className="bi bi-pencil-square"></i> Редактировать
      </button>

      <hr />
      <h3 className="glass-subtitle">Рабочие часы:</h3>

      {localHours.length === 0 ? (
        <p className="glass-text">⏳ Пока нет записей</p>
      ) : (
        <ul className="glass-list">
          {localHours.map((entry) => (
            <li
              className="glass-item"
              key={entry.id}
              style={{ marginBottom: '10px' }}
            >
              <input
                className="glass-input"
                type="number"
                value={entry.amount}
                onChange={(e) =>
                  handleChange(entry.id, 'amount', e.target.value)
                }
              />{' '}
              <input
                className="glass-input"
                type="date"
                value={entry.date}
                onChange={(e) => handleChange(entry.id, 'date', e.target.value)}
              />{' '}
              <select
                className="glass-select"
                value={entry.shiftType}
                onChange={(e) =>
                  handleChange(entry.id, 'shiftType', e.target.value)
                }
              >
                <option value="Стандарт">Стандарт</option>
                <option value="Выходные">Выходные</option>
              </select>{' '}
              <button className="glass-btn" onClick={() => handleSave(entry)}>
                <i className="bi bi-save"></i>
              </button>{' '}
              <button
                className="glass-btn"
                onClick={() =>
                  dispatch(
                    deleteWorkHour({ userId: user.id, hourId: entry.id })
                  )
                }
              >
                <i className="bi bi-trash"></i>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
