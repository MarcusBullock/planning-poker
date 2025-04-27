import { useState, useEffect } from 'react';
import sunIcon from '/sun.svg';
import moonIcon from '/moon.svg';
import styles from './ThemeSwitch.module.scss';

const ThemeSwitch = () => {
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        window.dispatchEvent(new Event('storage'));
    }, [theme]);

    const toggleTheme = () => {
        setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
    };

    return (
        <button onClick={toggleTheme} className={styles.themeSwitch}>
            <div className={styles.iconWrapper}>
                <img
                    className={`${styles.icon} ${styles.sun}`}
                    src={sunIcon}
                    alt="Switch to dark mode"
                />
                <img
                    className={`${styles.icon} ${styles.moon}`}
                    src={moonIcon}
                    alt="Switch to light mode"
                />
            </div>
        </button>
    );
};

export default ThemeSwitch;
