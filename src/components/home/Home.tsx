import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Start from './Start';
import Join from './Join';
import StartForm from './StartForm';
import JoinForm from './JoinForm';
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
        <motion.div className={styles.home} layout transition={{ layout: { duration: 0.5 } }}>
            <Start onClick={() => click(true)} />
            <AnimatePresence>
                {startClicked && (
                    <motion.div
                        className={styles.formCard}
                        layout
                        initial={{ width: 0, y: 500 }}
                        animate={{ width: '300px', y: 0 }}
                        exit={{ width: 0, y: 500, opacity: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <StartForm />
                    </motion.div>
                )}
            </AnimatePresence>
            <AnimatePresence>
                {joinClicked && (
                    <motion.div
                        className={styles.formCard}
                        layout
                        initial={{ width: 0, y: 500 }}
                        animate={{ width: '300px', y: 0 }}
                        exit={{ width: 0, y: 500, opacity: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <JoinForm />
                    </motion.div>
                )}
            </AnimatePresence>
            <Join onClick={() => click(false)} />
        </motion.div>
    );
}

export default Home;
