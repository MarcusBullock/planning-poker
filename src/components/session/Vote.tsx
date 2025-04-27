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
    return (
        <div className={classNames(styles.wrapper, showVote ? styles.visible : styles.concealed)}>
            <AnimatePresence>
                <motion.div
                    className={styles.vote}
                    animate={{
                        backgroundColor: highlightTrigger ? '#ffeb3b' : '#fff', // dONT DO THIS, USE SIGNALR TO NOTIFY WHEN A PLAYER UPDATES A VOTE
                    }}
                    transition={{
                        duration: 0.3,
                        repeat: 1,
                        ease: 'easeInOut',
                        repeatType: 'reverse',
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
