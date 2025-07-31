import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { saveUser } from '../../../store/user-thunks';
import { useState } from 'react';
import './add-user.css';

export const AddUser = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [phone, setPhone] = useState('');

  const handleAdd = () => {
    if (!name.trim() || !age.trim() || !phone.trim()) {
      alert('Заполните все поля');
      return;
    }

    dispatch(
      saveUser({
        name,
        age: Number(age),
        phone,
        workingHours: [],
      })
    );

    navigate('/');
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
