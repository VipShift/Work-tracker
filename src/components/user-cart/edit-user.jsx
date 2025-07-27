import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { updateUser } from '../../store/user-reducer';
import { useState } from 'react';

export const EditUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector((state) =>
    state.userState.users.find((u) => u.id === Number(id))
  );

  const [name, setName] = useState(user?.name || '');
  const [age, setAge] = useState(user?.age || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const handleSave = () => {
    dispatch(
      updateUser({
        id: Number(id),
        name,
        age,
        phone,
      })
    );
    navigate(`/`);
  };

  return (
    <div>
      <h2> Редактировать пользователя </h2>
      <input value={name} onChange={(e) => setName(e.target.value)} />
      <input
        type="number"
        value={age}
        onChange={(e) => setAge(Number(e.target.value))}
      />
      <input value={phone} onChange={(e) => setPhone(Number(e.target.value))} />
      <button onClick={handleSave}>Сохранить</button>
    </div>
  );
};
