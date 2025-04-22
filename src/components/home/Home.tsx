import styles from './Home.module.scss';
import Start from './Start';
import Join from './Join';
import StartForm from './StartForm';
import { useState } from 'react';

function Home() {
    const [startClicked, setStartClicked] = useState(false);

    return (
        <div className={styles.home}>
            <Start onClick={() => setStartClicked((prev) => !prev)} />
            <div
                className={`${styles.startFormWrapper} ${
                    startClicked ? styles.enter : styles.exit
                }`}
            >
                <StartForm isVisible={startClicked} />
            </div>
            <Join />
        </div>
    );
}

export default Home;
