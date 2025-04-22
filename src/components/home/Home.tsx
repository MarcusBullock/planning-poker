import { useState } from 'react';
import Start from './Start';
import Join from './Join';
import StartForm from './StartForm';
import JoinForm from './JoinForm';
import classNames from 'classnames';
import styles from './Home.module.scss';

function Home() {
    const [startClicked, setStartClicked] = useState(false);
    const [joinClicked, setJoinClicked] = useState(false);

    const click = (isStart: boolean) => {
        if (isStart) {
            setJoinClicked(false);
            setStartClicked((prev) => !prev);
        }

        if (!isStart) {
            setStartClicked(false);
            setJoinClicked((prev) => !prev);
        }
    };

    return (
        <div
            className={classNames(
                styles.home,
                startClicked || joinClicked ? styles.startFormVisible : '',
            )}
        >
            <Start onClick={() => click(true)} />
            <div
                className={`${styles.startFormWrapper} ${
                    startClicked ? styles.enter : styles.exit
                }`}
            >
                <StartForm isVisible={startClicked} />
            </div>
            <div
                className={`${styles.startFormWrapper} ${joinClicked ? styles.enter : styles.exit}`}
            >
                <JoinForm isVisible={startClicked} />
            </div>
            <Join onClick={() => click(false)} />
        </div>
    );
}

export default Home;
