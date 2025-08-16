// src/components/user/edit-user/edit-user.jsx
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { updateUserFr } from '../../../store/user-reducer';
import { useState, useEffect } from 'react';
import './edit-user.css';

export const EditUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Получаем конкретную карточку пользователя
  const user = useSelector((state) =>
    state.userState.users.find((u) => u.uid === id)
  );

  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [phone, setPhone] = useState('');

  useEffect(() => {
    if (user) {
      setName(user.name);
      setAge(user.age);
      setPhone(user.phone);
    }
  }, [user]);

  const handleSave = () => {
    if (!name.trim() || !age || !phone.trim()) {
      alert('Заполните все поля');
      return;
    }

    if (!user) return;

    dispatch(
      updateUserFr({
        uid: user.uid,
        name,
        age: Number(age),
        phone,
        workingHours: user.workingHours || {},
      })
    );
    navigate('/');
  };

  if (!user) return <p className="glass-text">Пользователь не найден</p>;

  return (
    <div className="edit-user-glass glass-wrapper">
      <h2 className="glass-title">Редактировать пользователя</h2>
      <input
        className="glass-input"
        placeholder="Имя"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        className="glass-input"
        type="number"
        placeholder="Возраст"
        value={age}
        onChange={(e) => setAge(e.target.value)}
      />
      <input
        className="glass-input"
        placeholder="Телефон"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />
      <button className="glass-btn" onClick={handleSave}>
        Сохранить
      </button>
    </div>
  );
};
