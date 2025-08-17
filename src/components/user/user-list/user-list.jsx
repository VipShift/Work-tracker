// src/components/user/user-list/user-list.jsx
import './user-list.css';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { auth, db } from '../../../firebase';
import { ref, onValue, push, set } from 'firebase/database';

export const UserList = () => {
  const [cards, setCards] = useState([]);
  const [inputs, setInputs] = useState({});
  const [currentAuthUser, setCurrentAuthUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentAuthUser(user);
      if (user) {
        const cardsRef = ref(db, `users/${user.uid}/cards`);
        onValue(cardsRef, (snapshot) => {
          const data = snapshot.val();
          if (data) {
            const arr = Object.keys(data).map((key) => ({
              id: key,
              ...data[key],
            }));
            setCards(arr);
          } else {
            setCards([]);
          }
        });
      } else {
        setCards([]);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleChange = (id, field, value) => {
    setInputs((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value,
      },
    }));
  };

  const handleAddHours = (cardId) => {
    const data = inputs[cardId] || {};
    const amount = data.amount !== undefined ? Number(data.amount) : 8;
    const shiftType = data.shiftType || 'Стандарт';
    const time = data.time || '';
    const today = new Date().toISOString().split('T')[0];

    const hourRef = ref(
      db,
      `users/${currentAuthUser.uid}/cards/${cardId}/workingHours`
    );
    const newHourRef = push(hourRef);

    set(newHourRef, {
      amount,
      shiftType,
      date: today,
      time,
    });

    setInputs((prev) => ({
      ...prev,
      [cardId]: { amount: undefined, time: '', shiftType: 'Стандарт' },
    }));
  };

  if (!currentAuthUser) return <p>Загрузка...</p>;
  if (cards.length === 0) return <p>Нет карточек для вашей учётной записи</p>;

  return (
    <div className="user-list-wrapper">
      <h2 className="glass-title">Список пользователей</h2>
      <div className="user-list-glass">
        {cards.map((card) => {
          const cardData = inputs[card.id] || {};
          const workingHoursValues = card.workingHours
            ? Object.values(card.workingHours).sort((a, b) =>
                a.date.localeCompare(b.date)
              )
            : [];

          const lastWork =
            workingHoursValues.length > 0
              ? workingHoursValues[workingHoursValues.length - 1]
              : null;

          return (
            <div className="user-one glass-item" key={card.id}>
              <p className="glass-text">
                <span className="user-open">
                  <i
                    className="bi bi-arrows-fullscreen"
                    onClick={() => navigate(`/user/${card.id}`)}
                  />
                </span>
                {card.name}
              </p>
              {lastWork && (
                <div className="glass-last-work">
                  <span className="glass-date"> {lastWork.date}</span>
                  <span className="glass-amount">
                    --
                    {lastWork.amount} ч. <i className="bi bi-clock"></i>
                  </span>
                </div>
              )}
              <input
                className="glass-input"
                type="number"
                placeholder="Часы"
                value={cardData.amount || ''}
                onChange={(e) =>
                  handleChange(card.id, 'amount', e.target.value)
                }
              />
              <select
                className="glass-select"
                value={cardData.shiftType || 'Стандарт'}
                onChange={(e) =>
                  handleChange(card.id, 'shiftType', e.target.value)
                }
              >
                <option value="Стандарт">Стандарт</option>
                <option value="Выходные">Выходные</option>
              </select>
              <i
                className="bi bi-calendar-plus glass-btn-add-hours"
                onClick={() => handleAddHours(card.id)}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};
