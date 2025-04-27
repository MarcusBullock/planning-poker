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
        if (highlightTrigger) {
            setLocalHighlight(true); // Trigger the highlight
            const timer = setTimeout(() => {
                setLocalHighlight(false); // Reset the highlight after 300ms
            }, 300);

            return () => clearTimeout(timer); // Cleanup the timer on unmount or re-trigger
        }
    }, [highlightTrigger]);

    return (
        <div className={classNames(styles.wrapper, showVote ? styles.visible : styles.concealed)}>
            <AnimatePresence>
                <motion.div
                    className={styles.vote}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{
                        opacity: 1,
                        y: 0,
                        backgroundColor: localHighlight ? '#ffeb3b' : showVote ? '#fff' : '#2f2b2b',
                    }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{
                        duration: 0.3,
                        ease: 'easeInOut',
                    }}
                >
                    {showVote ? (
                        <>
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
                        </>
                    ) : (
                        <div className={styles.nameConcealed}>{vote.userName}</div>
                    )}
                </motion.div>
            </AnimatePresence>
        </div>
    );
}

export default Vote;
