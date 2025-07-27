// src/components/home.jsx
import { UserList } from '../user-cart';
import './home.css';

export const Home = () => {
  return (
    <div className="home-gradient">
      <h1>🏠 Home</h1>
      <div className="user-list-wrapper">
        <UserList />
      </div>
    </div>
  );
};
