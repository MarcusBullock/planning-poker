import { AnimatePresence, motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { Tooltip } from 'react-tooltip';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy } from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames';
import styles from './Info.module.scss';

type InfoProps = {
    currentUserName?: string;
    ownerName?: string;
    gameStatus?: string;
    code: string;
    notEnoughPlayers: boolean;
    startGame: (start: boolean) => void;
    handleShowVotes: () => void;
    handleResetVotes: () => void;
    handleResetGame: () => void;
    voteCount: number;
};

function Info({
    currentUserName,
    ownerName,
    code,
    notEnoughPlayers,
    startGame,
    gameStatus,
    handleShowVotes,
    handleResetVotes,
    handleResetGame,
    voteCount,
}: InfoProps) {
    const handleCopy = () => {
        navigator.clipboard.writeText(code!);
        toast.success('Copied to clipboard!', {
            position: 'top-right',
            autoClose: 1000,
            hideProgressBar: true,
            closeOnClick: true,
        });
    };

    return (
        <div className={styles.info}>
            <div className={styles.controls}>
                <motion.h1
                    initial={{ x: -2500 }}
                    animate={{
                        x: 0,
                        scale: [1, 1.1, 0.9, 1],
                    }}
                    transition={{
                        duration: 1,
                        ease: 'easeOut',
                        scale: { duration: 0.5, delay: 1 },
                    }}
                >
                    WELCOME, <span>{currentUserName}</span>!
                </motion.h1>

                <motion.div
                    className={styles.controlBtns}
                    initial={{ x: -2500 }}
                    animate={{
                        x: 0,
                    }}
                    transition={{
                        duration: 1,
                        ease: 'easeOut',
                    }}
                >
                    {(gameStatus === 'voted' || gameStatus == 'active') && (
                        <motion.button
                            className={classNames(styles.btn, styles.red)}
                            type="button"
                            disabled={notEnoughPlayers}
                            onClick={handleResetGame}
                            data-tooltip-id="start-game-tooltip"
                            data-tooltip-content="Not enough players to start the game"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.5 }}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5 }}
                        >
                            STOP
                        </motion.button>
                    )}

                    {gameStatus === 'inactive' && (
                        <motion.button
                            className={classNames(styles.btn, styles.green)}
                            type="button"
                            disabled={notEnoughPlayers}
                            onClick={() => startGame(true)}
                            data-tooltip-id="start-game-tooltip"
                            data-tooltip-content="Not enough players to start the game"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.5 }}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5 }}
                        >
                            START GAME
                        </motion.button>
                    )}
                    {notEnoughPlayers && <Tooltip id="start-game-tooltip" place="bottom" />}
                    <AnimatePresence>
                        {gameStatus === 'active' && voteCount > 0 && (
                            <>
                                <motion.button
                                    key="show"
                                    type="button"
                                    className={styles.showVotes}
                                    initial={{ opacity: 0, y: -20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.5, ease: 'easeOut' }}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.5 }}
                                    onClick={handleShowVotes}
                                >
                                    SHOW VOTES
                                </motion.button>
                                <motion.button
                                    key="reset"
                                    type="button"
                                    className={styles.resetVotes}
                                    initial={{ opacity: 0, y: -20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.5, ease: 'easeOut' }}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.5 }}
                                    onClick={handleResetVotes}
                                >
                                    RESET VOTES
                                </motion.button>
                            </>
                        )}
                    </AnimatePresence>
                </motion.div>
            </div>
            <div className={styles.overviewCol}>
                <motion.div
                    className={styles.owner}
                    initial={{ x: 2500 }}
                    animate={{ x: 0 }}
                    transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
                >
                    <h2>
                        <span>OWNER: </span>
                        <span className={styles.name}>{ownerName}</span>
                    </h2>
                </motion.div>
                <motion.div
                    className={styles.btnRow}
                    initial={{ x: 2500 }}
                    animate={{ x: 0 }}
                    transition={{ duration: 1, ease: 'easeOut', delay: 0.8 }}
                >
                    <div className={classNames(styles.owner, styles.code)}>
                        <h2>
                            <span>CODE: </span>
                            <span className={styles.name}>{code}</span>
                        </h2>
                    </div>
                    <button type="button" onClick={handleCopy}>
                        <FontAwesomeIcon icon={faCopy} size="xl" color="#6d1513" />
                    </button>
                </motion.div>
            </div>
        </div>
    );
}

export default Info;
