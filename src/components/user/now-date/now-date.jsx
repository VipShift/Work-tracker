// src/components/user-cart/now-date.jsx
import './now-date.css';

export const NowDate = () => {
  return (
    <div className="now-date">
      <p className="now-date-text">{new Date().toLocaleDateString()}</p>
    </div>
  );
};
