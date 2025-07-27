// src/components/user-cart/add-user.jsx

import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addUser } from '../../store/user-reducer';
import { updateUser } from '../../store/user-reducer';
import { useState } from 'react';

export const AddUser = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [phone, setPhone] = useState('');

  const handelAdd = () => {
    if (!name || !age) {
      alert('Заполните все поля');
      return;
    }

    dispatch(addUser({ name, age: Number(age), phone: Number(phone) }));
    navigate('/');
  };

  const handleSave = () => {
    dispatch(
      updateUser({
        id: user.id,
        name,
        age,
        phone,
      })
    );
    navigate(`/`);
  };
  return (
    <div>
      <h2>Добавить пользователя</h2>
      <input
        placeholder="Имя"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="number"
        placeholder="Возраст"
        value={age}
        onChange={(e) => setAge(e.target.value)}
      />
      <input
        placeholder="Телефон"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />

      <button onClick={handelAdd}>Добавить</button>
      <hr />
    </div>
  );
};
