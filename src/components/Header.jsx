import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import styles from '../styles/Header.module.css';

function Header() {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/');
    };

	return (
		<header className={styles.header}>
			<h1 className={styles.logo}>Book Buddy</h1>
			<nav className={styles.nav}>
				<NavLink to="/" className={({ isActive }) => `${styles.navItem} ${isActive ? styles.active : ''}`}>
					Home
				</NavLink>

                {token && (
                    <NavLink to="/bookshelf" className={({ isActive }) => `${styles.navItem} ${isActive ? styles.active : ''}`}>
                        My Bookshelf
                    </NavLink>
                )}

                {token ? (
                    <button onClick={handleLogout} className={({ isActive }) => `${styles.navItem} ${isActive ? styles.active : ''}`} style={{ background: 'none', border: 'none'}}>
                        Logout
                    </button>
                ) : (
				<NavLink to="/login" className={({ isActive }) => `${styles.navItem} ${isActive ? styles.active : ''}`}>
					Login
				</NavLink>
                )}

			</nav>
		</header>
	);
}

export default Header;
