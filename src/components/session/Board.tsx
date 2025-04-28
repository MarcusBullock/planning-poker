import { AnimatePresence, motion } from 'framer-motion';
import { UserVote } from '../../types/UserVote';
import styles from './Board.module.scss';
import Vote from './Vote';
import classNames from 'classnames';

type BoardProps = {
    gameStatus?: string;
    votes: UserVote[];
    highlightedPlayerId?: number;
};

function Board({ gameStatus, votes, highlightedPlayerId }: BoardProps) {
    return (
        <AnimatePresence>
            {(gameStatus === 'active' || gameStatus === 'voted') && (
                <motion.div
                    className={classNames(
                        styles.board,
                        gameStatus === 'voted' ? styles.voted : styles.notvoted,
                    )}
                    initial={{ width: 0, x: 0 }}
                    animate={{ width: '100%', x: 0 }}
                    exit={{ width: 0, x: '100%' }}
                    transition={{
                        duration: 0.5,
                        ease: 'easeInOut',
                    }}
                >
                    <AnimatePresence>
                        {votes
                            ?.sort((a, b) => a.userName?.localeCompare(b.userName))
                            .map(
                                (vote) =>
                                    vote.vote && (
                                        <Vote
                                            key={vote.userId}
                                            vote={vote}
                                            showVote={gameStatus === 'voted'}
                                            highlightTrigger={highlightedPlayerId === vote.userId}
                                        />
                                    ),
                            )}
                    </AnimatePresence>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

export default Board;
