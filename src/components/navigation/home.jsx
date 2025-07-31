// src/components/home.jsx
import { UserList } from '../user';
import './home.css';

export const Home = () => {
  return (
    <div>
      <h1 className="glass-title center-text">Главная</h1>
      <div>
        <UserList />
      </div>
    </div>
  );
};
