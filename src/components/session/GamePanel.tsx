import { AnimatePresence, motion } from 'framer-motion';
import { UserRow } from '../../types/DbModels';
import { UserVote } from '../../types/UserVote';
import Board from './Board';
import classNames from 'classnames';
import styles from './GamePanel.module.scss';
import Results from './Results';

type GamePanelProps = {
    players?: UserRow[];
    votes: UserVote[];
    gameStatus?: string;
    highlightedPlayerId?: number;
};

function GamePanel({ players, gameStatus, votes, highlightedPlayerId }: GamePanelProps) {
    return (
        <>
            <motion.div
                initial={{ width: 0, x: 0 }}
                animate={{
                    width: gameStatus === 'active' || gameStatus === 'voted' ? '100%' : '300px',
                    x: 0,
                }}
                exit={{ width: 0, x: 0 }}
                transition={{
                    duration: 0.5,
                    ease: 'easeInOut',
                }}
                className={classNames(
                    styles.players,
                    gameStatus === 'active' || gameStatus === 'voted'
                        ? styles.active
                        : styles.inactive,
                    gameStatus === 'voted' ? styles.voted : '',
                )}
            >
                <div className={styles.playerList}>
                    <h2>PLAYERS</h2>
                    <ol>
                        {players
                            ?.sort((a, b) =>
                                a.created > b.created ? 1 : a.created < b.created ? -1 : 0,
                            )
                            .map((player) => <li key={player.id}>{player.name}</li>)}
                    </ol>
                </div>
                <AnimatePresence>
                    <Board
                        gameStatus={gameStatus}
                        votes={votes}
                        highlightedPlayerId={highlightedPlayerId}
                    />
                </AnimatePresence>
            </motion.div>
            <AnimatePresence>
                <Results gameStatus={gameStatus} votes={votes} />
            </AnimatePresence>
        </>
    );
}

export default GamePanel;
