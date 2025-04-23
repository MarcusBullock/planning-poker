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
                        initial={{ width: 0, y: 1500, rotate: 0 }}
                        animate={{ width: '300px', y: 0, rotate: 360 }}
                        exit={{ width: 0, y: 1500, opacity: 0, rotate: 0 }}
                        transition={{
                            duration: 0.6,
                            ease: [0.25, 0.1, 0.25, 1],
                        }}
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
                        initial={{ width: 0, y: 1500, rotate: 0 }}
                        animate={{ width: '300px', y: 0, rotate: 360 }}
                        exit={{ width: 0, y: 1500, opacity: 0, rotate: 0 }}
                        transition={{
                            duration: 0.6,
                            ease: [0.25, 0.1, 0.25, 1],
                        }}
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
