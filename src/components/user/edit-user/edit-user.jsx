// src/components/user/edit-user/edit-user.jsx
import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { auth, db } from '../../../firebase';
import { ref, onValue, set } from 'firebase/database';
import './edit-user.css';

export const EditUser = () => {
  const { id } = useParams(); // cardId
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [phone, setPhone] = useState('');

  useEffect(() => {
    if (!auth.currentUser) return;
    const userRef = ref(db, `users/${auth.currentUser.uid}/cards/${id}`);
    const unsubscribe = onValue(userRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setUser({ id, ...data });
        setName(data.name);
        setAge(data.age);
        setPhone(data.phone);
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, [id]);

  const handleSave = () => {
    if (!name.trim() || !age || !phone.trim()) {
      alert('Заполните все поля');
      return;
    }
    if (!auth.currentUser || !user) return;

    const userRef = ref(db, `users/${auth.currentUser.uid}/cards/${id}`);
    set(userRef, {
      name,
      age: Number(age),
      phone,
      workingHours: user.workingHours || {},
    })
      .then(() => navigate('/'))
      .catch((err) => console.error('Ошибка при сохранении:', err));
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
