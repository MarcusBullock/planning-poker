import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ThemeSwitch from './ThemeSwitch';
import styles from './Navbar.module.scss';
import lightLogo from '/planning-poker-logo-for-lightmode.png';
import darkLogo from '/planning-poker-logo-for-darkmode.png';

const Navbar = () => {
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

    useEffect(() => {
        const handleThemeChange = () => {
            setTheme(localStorage.getItem('theme') || 'light');
        };

        window.addEventListener('storage', handleThemeChange);
        return () => {
            window.removeEventListener('storage', handleThemeChange);
        };
    }, []);

    return (
        <nav className={styles.navbar}>
            <div className={styles.container}>
                <Link to="/" className={styles.logo}>
                    <img
                        src={theme === 'light' ? lightLogo : darkLogo}
                        alt="logo"
                        className={styles.brand}
                    />
                </Link>
                <div className={styles.switch}>
                    <ThemeSwitch />
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
