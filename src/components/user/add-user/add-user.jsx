// src/components/user/add-user/add-user.jsx
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { auth, db } from '../../../firebase';
import { ref, push, set } from 'firebase/database';
import './add-user.css';

export const AddUser = () => {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [phone, setPhone] = useState('');

  const handleAdd = () => {
    if (!name.trim() || !age.trim() || !phone.trim()) {
      alert('Заполните все поля');
      return;
    }

    // Ссылка на карточки текущего пользователя
    const cardsRef = ref(db, `users/${auth.currentUser.uid}/cards`);
    const newCardRef = push(cardsRef); // создаём уникальный ID для новой карточки

    set(newCardRef, {
      name,
      age: Number(age),
      phone,
      workingHours: {},
    })
      .then(() => {
        navigate('/');
      })
      .catch((error) => {
        console.error('Ошибка при добавлении карточки:', error);
      });
  };

  return (
    <div className="add-user-glass glass-wrapper">
      <div className="glass-card-form">
        <h2 className="glass-title center-text">Добавить пользователя</h2>

        <input
          className="glass-input wide-input"
          placeholder="Имя"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          className="glass-input wide-input"
          type="number"
          placeholder="Возраст"
          value={age}
          onChange={(e) => setAge(e.target.value)}
        />

        <input
          className="glass-input wide-input"
          placeholder="Телефон"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        <button className="glass-btn glass-shadow" onClick={handleAdd}>
          <i className="bi bi-person-plus"></i> Добавить
        </button>
      </div>
    </div>
  );
};
