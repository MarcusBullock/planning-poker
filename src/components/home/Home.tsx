//import { useState } from 'react';
import styles from './Home.module.scss';
import Start from './Start';
import Join from './Join';

function Home() {
    return (
        <div className={styles.home}>
            <Start />
            <Join />
        </div>
    );
}

export default Home;
