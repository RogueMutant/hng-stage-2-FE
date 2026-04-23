import React from 'react';
import { useTheme } from '../hooks/useTheme';
import styles from './Sidebar.module.css';

const Sidebar: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logoContainer}>
        <div className={styles.logo}>
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="26">
            <path fill="#FFF" fillRule="evenodd" d="M20.513 0C24.965 2.309 28 6.91 28 12.21 28 19.826 21.732 26 14 26S0 19.826 0 12.21C0 6.91 3.035 2.309 7.487 0L14 12.9z"/>
          </svg>
        </div>
        <div className={styles.logoBottom}></div>
      </div>
      
      <div className={styles.actions}>
        <button onClick={toggleTheme} className={styles.themeToggle} aria-label="Toggle theme">
          <div className={`${styles.themeIcon} ${styles[theme]}`}></div>
        </button>
        <div className={styles.divider}></div>
        <div className={styles.avatar}>
          <img src="https://i.pravatar.cc/150?u=invoice-app" alt="User avatar" />
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
