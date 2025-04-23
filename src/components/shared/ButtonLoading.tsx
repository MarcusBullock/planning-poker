import React from 'react';
import styles from './ButtonLoading.module.scss';

const ButtonLoading: React.FC = () => {
    return (
        <div className={styles.loader}>
            <div></div>
            <div></div>
            <div></div>
        </div>
    );
};

export default ButtonLoading;
