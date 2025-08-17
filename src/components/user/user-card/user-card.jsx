// src/components/user/user-card/user-card.jsx
import './user-card.css';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {
  updateUserHourFr,
  deleteUserHourFr,
  deleteUserFr,
} from '../../../store/user-reducer';
import { useState, useEffect } from 'react';
import { auth, db } from '../../../firebase';
import { ref, onValue } from 'firebase/database';

export const UserCard = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [user, setUser] = useState(null);
  const [editingHours, setEditingHours] = useState({});
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (!auth.currentUser) return;

    const userRef = ref(db, `users/${auth.currentUser.uid}/cards/${id}`);
    const unsubscribe = onValue(userRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setUser({ uid: id, ...data });

        setEditingHours((prev) =>
          Object.keys(prev).length === 0 ? data.workingHours || {} : prev
        );
      }
    });

    return () => unsubscribe();
  }, [id]);
  if (!user) return <p className="glass-text">Пользователь не найден</p>;

  const handleChange = (hourId, field, value) => {
    setEditingHours((prev) => ({
      ...prev,
      [hourId]: { ...prev[hourId], [field]: value },
    }));
  };

  const handleSave = (hourId) => {
    const entry = editingHours[hourId];
    dispatch(
      updateUserHourFr({
        uid: auth.currentUser.uid,
        cardId: user.uid,
        hourId,
        updatedHour: {
          amount: Number(entry.amount),
          date: entry.date,
          time: entry.time ?? '',
          shiftType: entry.shiftType,
        },
      })
    );

    // Локально обновляем user
    setUser((prev) => ({
      ...prev,
      workingHours: {
        ...prev.workingHours,
        [hourId]: { ...entry },
      },
    }));
  };

  const handleDeleteHour = (hourId) => {
    if (!window.confirm('Удалить эту запись?')) return;

    dispatch(
      deleteUserHourFr({
        uid: auth.currentUser.uid,
        cardId: user.uid,
        hourId,
      })
    );

    // Локально удаляем час
    setEditingHours((prev) => {
      const newHours = { ...prev };
      delete newHours[hourId];
      return newHours;
    });

    setUser((prev) => {
      const newWorkingHours = { ...prev.workingHours };
      delete newWorkingHours[hourId];
      return { ...prev, workingHours: newWorkingHours };
    });
  };

  const handleDeleteUser = () => {
    if (window.confirm('Удалить пользователя?')) {
      dispatch(deleteUserFr({ uid: auth.currentUser.uid, cardId: user.uid }));
      navigate('/');
    }
  };

  const totalAmount = user.workingHours
    ? Object.values(user.workingHours).reduce(
        (total, hour) => total + Number(hour.amount || 0),
        0
      )
    : 0;

  return (
    <div className="user-card-gradient glass-card">
      <h2 className="glass-title">Карточка {user.name}</h2>
      <div className="user-card-info">
        <div className="info-row">
          <span className="info-label">Имя:</span>
          <span className="info-value">{user.name}</span>
        </div>
        <div className="info-row">
          <span className="info-label">Возраст:</span>
          <span className="info-value">{user.age} лет</span>
        </div>
        <div className="info-row">
          <span className="info-label">Телефон:</span>
          <span className="info-value">{user.phone}</span>
        </div>
        <div className="info-row">
          <span className="info-label">Общее кол. часов:</span>
          <span className="info-value">{totalAmount}</span>
        </div>
      </div>

      <button
        className="glass-btn"
        onClick={() => navigate(`/edit-user/${user.uid}`)}
      >
        <i className="bi bi-pencil-square"></i> Редактировать{' '}
        <i className="bi bi-person"></i>
      </button>
      <button className="glass-btn" onClick={handleDeleteUser}>
        <i className="bi bi-trash"></i> Удалить <i className="bi bi-person"></i>
      </button>
      <button
        className="glass-btn"
        onClick={() => setIsEditing((prev) => !prev)}
      >
        <i className="bi bi-pencil-square"></i>
        {isEditing ? ' Отменить редактирование' : ' Редактировать'} ⏱
      </button>

      <hr />
      <h3 className="glass-subtitle">Рабочие часы:</h3>

      {!isEditing && (
        <ul className="glass-list">
          {user.workingHours && Object.keys(user.workingHours).length > 0 ? (
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
          )}
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
                  />
                  <input
                    className="glass-input"
                    type="date"
                    value={entry.date}
                    onChange={(e) =>
                      handleChange(hourId, 'date', e.target.value)
                    }
                  />
                  <select
                    className="glass-select"
                    value={entry.shiftType}
                    onChange={(e) =>
                      handleChange(hourId, 'shiftType', e.target.value)
                    }
                  >
                    <option value="Стандарт">Стандарт</option>
                    <option value="Выходные">Выходные</option>
                  </select>
                  <div className="button-row">
                    <button
                      className="glass-btn"
                      onClick={() => handleSave(hourId)}
                    >
                      <i className="bi bi-save"></i>
                    </button>
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
