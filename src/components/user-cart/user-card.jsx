import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { updateWorkHour, deleteWorkHour } from '../../store/user-reducer';
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
    // Делаем копию, чтобы редактировать локально
    setLocalHours(user.workingHours.map((entry) => ({ ...entry })));
  }, [user.workingHours]);

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

  return (
    <div className="user-card-gradient">
      <h2>Карточка пользователя</h2>
      <p>Имя: {user.name}</p>
      <p>Возраст: {user.age}</p>
      <p>Телефон: {user.phone}</p>
      <button onClick={() => navigate(`/edit-user/${user.id}`)}>
        ✏️ Редактировать
      </button>

      <hr />
      <h3>Рабочие часы:</h3>

      {localHours.length === 0 ? (
        <p>⏳ Пока нет записей</p>
      ) : (
        <ul>
          {localHours.map((entry) => (
            <li key={entry.id} style={{ marginBottom: '10px' }}>
              <input
                type="number"
                value={entry.amount}
                onChange={(e) =>
                  handleChange(entry.id, 'amount', e.target.value)
                }
              />{' '}
              <input
                type="date"
                value={entry.date}
                onChange={(e) => handleChange(entry.id, 'date', e.target.value)}
              />{' '}
              <select
                value={entry.shiftType}
                onChange={(e) =>
                  handleChange(entry.id, 'shiftType', e.target.value)
                }
              >
                <option value="Стандарт">Стандарт</option>
                <option value="Ночь">Виходние</option>
              </select>{' '}
              <button onClick={() => handleSave(entry)}>💾 Сохранить</button>{' '}
              <button
                onClick={() =>
                  dispatch(
                    deleteWorkHour({ userId: user.id, hourId: entry.id })
                  )
                }
              >
                🗑️ Удалить
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
