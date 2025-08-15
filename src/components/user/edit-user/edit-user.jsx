import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { updateWorkHourInFr } from '../../../store/user-reducer';
import { useState } from 'react';
import './edit-user.css';

export const EditUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector((state) =>
    state.userState.users.find((u) => u.id === id)
  );

  const [name, setName] = useState(user?.name || '');
  const [age, setAge] = useState(user?.age || '');
  const [phone, setPhone] = useState(user?.phone || '');

  const handleSave = () => {
    dispatch(
      updateWorkHourInFr({
        id,
        name,
        age,
        phone,
        workingHours: user.workingHours || [],
      })
    );
    navigate('/');
  };

  return (
    <div className="edit-user-glass">
      <h2 className="glass-title">Редактировать пользователя</h2>
      <input
        className="glass-input"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        className="glass-input"
        type="number"
        value={age}
        onChange={(e) => setAge(Number(e.target.value))}
      />
      <input
        className="glass-input"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />
      <button className="glass-btn" onClick={handleSave}>
        Сохранить
      </button>
    </div>
  );
};
