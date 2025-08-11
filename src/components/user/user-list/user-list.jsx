import './user-list.css';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { saveWorkHour } from '../../../store/user-thunks';

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
    const amount = data.amount !== undefined ? Number(data.amount) : 10;
    const shiftType = data.shiftType || 'Стандарт';
    const time = data.time || ' ';

    const today = new Date().toISOString().split('T')[0];

    dispatch(
      saveWorkHour({
        userId,
        hour: {
          amount,
          shiftType,
          date: today,
          time,
        },
      })
    );

    // Сбрасываем все поля, включая amount
    setInputs((prev) => ({
      ...prev,
      [userId]: { amount: '', time: '', shiftType: 'Стандарт' },
    }));
  };

  useEffect(() => {
    setInputs({});
  }, [users]);

  return (
    <div className="user-list-wrapper">
      <h2 className="glass-title">Список пользователей</h2>
      <div className="user-list-glass">
        {users.map((user) => {
          const userData = inputs[user.id] || {};
          const workingHoursValues = user.workingHours
            ? Object.values(user.workingHours).sort((a, b) =>
                a.date.localeCompare(b.date)
              )
            : [];

          const lastWork =
            workingHoursValues.length > 0
              ? workingHoursValues[workingHoursValues.length - 1]
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
                value={userData.shiftType || 'Стандарт'}
                onChange={(e) =>
                  handleChange(user.id, 'shiftType', e.target.value)
                }
              >
                <option value="Стандарт">Стандарт</option>
                <option value="Выходные">Выходные</option>
              </select>
              <i
                className="bi bi-calendar-plus glass-btn-add-hours"
                onClick={() => handleAdd(user.id)}
              ></i>
            </div>
          );
        })}
      </div>
    </div>
  );
};
