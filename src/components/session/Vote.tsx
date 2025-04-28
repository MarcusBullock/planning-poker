import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { UserVote } from '../../types/UserVote';
import { CardSuit } from '../../types/CardSuit';
import classNames from 'classnames';
import styles from './Vote.module.scss';

type VoteProps = {
    vote: UserVote;
    showVote: boolean;
    highlightTrigger: boolean;
};

function Vote({ vote, showVote, highlightTrigger }: VoteProps) {
    const isRedSuit = vote.suit === CardSuit.Hearts || vote.suit === CardSuit.Diamonds;
    const [localHighlight, setLocalHighlight] = useState(false);

    useEffect(() => {
        if (highlightTrigger && !showVote) {
            setLocalHighlight(true);
            const timer = setTimeout(() => {
                setLocalHighlight(false);
            }, 300);

            return () => clearTimeout(timer);
        }
    }, [highlightTrigger, showVote]);

    return (
        <div className={classNames(styles.wrapper)}>
            <AnimatePresence mode="wait" propagate>
                {showVote ? (
                    <motion.div
                        key="revealed"
                        className={styles.vote}
                        initial={{ y: 400 }}
                        animate={{
                            y: 0,
                            backgroundColor:
                                localHighlight && !showVote
                                    ? '#ffeb3b'
                                    : showVote
                                      ? '#fff'
                                      : '#2f2b2b',
                        }}
                        exit={{ y: 400 }}
                        transition={{
                            duration: 0.6,
                            ease: 'easeInOut',
                        }}
                    >
                        <div
                            className={classNames(
                                styles.rankAndSuit,
                                styles.top,
                                isRedSuit ? styles.red : styles.black,
                            )}
                        >
                            <div className={styles.rank}>{vote.vote}</div>
                            <div className={classNames(styles.suit, styles.suitLeft)}>
                                {vote.suit}
                            </div>
                        </div>
                        <div className={styles.name}>{vote.userName}</div>
                        <div
                            className={classNames(
                                styles.rankAndSuit,
                                styles.bottom,
                                styles.flip,
                                isRedSuit ? styles.red : styles.black,
                            )}
                        >
                            <div className={classNames(styles.suit, styles.suitRight)}>
                                {vote.suit}
                            </div>
                            <div className={classNames(styles.rank, styles.rankRight)}>
                                {vote.vote}
                            </div>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="concealed"
                        className={styles.vote}
                        initial={{ y: 400 }}
                        animate={{
                            y: 0,
                            backgroundColor: localHighlight
                                ? '#ffeb3b'
                                : showVote
                                  ? '#fff'
                                  : '#2f2b2b',
                        }}
                        exit={{ y: 400 }}
                        transition={{
                            duration: 0.6,
                            ease: 'easeInOut',
                        }}
                    >
                        <div className={styles.nameConcealed}>{vote.userName}</div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default Vote;
