import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { UserVote } from '../../types/UserVote';
import classNames from 'classnames';
import styles from './Results.module.scss';

type ResultsProps = {
    gameStatus?: string;
    votes: UserVote[];
};

type VoteStats = {
    counts: Record<number, number>;
    maxVotes: number;
    winningVotes: number[];
    isTie: boolean;
    consensus: boolean;
    totalVotes: number;
};

function getVoteStats(votes: number[]): VoteStats | null {
    if (!votes.length) return null;

    const voteCounts = votes.reduce((acc, vote) => {
        acc.set(vote, (acc.get(vote) || 0) + 1);
        return acc;
    }, new Map<number, number>());

    const maxVotes = Math.max(...voteCounts.values());

    const winningVotes = Array.from(voteCounts.entries())
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        .filter(([_, count]) => count === maxVotes)
        .map(([vote]) => vote);

    const uniqueVoteValues = new Set(votes);
    const isTie = uniqueVoteValues.size > 1 && winningVotes.length > 1;

    return {
        counts: Object.fromEntries(voteCounts),
        maxVotes,
        winningVotes,
        isTie,
        consensus: uniqueVoteValues.size === 1,
        totalVotes: votes.length,
    };
}

function Results({ gameStatus, votes }: ResultsProps) {
    const [showMessage, setShowMessage] = useState(true);

    useEffect(() => {
        if (gameStatus === 'voted') {
            setShowMessage(true);
            const timer = setTimeout(() => setShowMessage(false), 1000);
            return () => clearTimeout(timer);
        }
    }, [gameStatus]);

    const voteValues = votes.map((x) => x.vote);
    const results = getVoteStats(voteValues)!;

    if (gameStatus !== 'voted') return null;

    return (
        <AnimatePresence>
            <motion.div
                className={styles.results}
                initial={{ height: 0 }}
                animate={{ height: 'fit-content' }}
                exit={{ height: 150 }}
                transition={{
                    duration: 0.5,
                    ease: 'easeInOut',
                }}
            >
                <AnimatePresence mode="wait">
                    {showMessage ? (
                        <motion.h2
                            key="message"
                            className={styles.resultsMessage}
                            initial={{ opacity: 0, scale: 0.7, y: 30 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.7, x: 300 }}
                            transition={{ duration: 0.7, type: 'spring', bounce: 0.4 }}
                        >
                            The results are in!
                        </motion.h2>
                    ) : (
                        <motion.div
                            key="results"
                            className={styles.stats}
                            initial={{ opacity: 0, x: -300 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -300 }}
                            transition={{ duration: 0.5 }}
                        >
                            <div className={styles.heading}>
                                <h3>Results</h3>
                            </div>
                            <div
                                className={classNames(
                                    styles.winOrTie,
                                    results.isTie ? styles.yellow : styles.green,
                                )}
                            >
                                {results.isTie ? 'TIE:' : 'WINNER:'}
                                <span className={styles.winningVote}>
                                    {results.winningVotes
                                        .sort((a, b) => a - b)
                                        .map(
                                            (vote, idx) =>
                                                vote !== null && (
                                                    <span
                                                        key={idx}
                                                        className={styles.winningVoteCircle}
                                                    >
                                                        {vote}
                                                    </span>
                                                ),
                                        )}
                                </span>
                            </div>
                            <div className={styles.breakdown}>
                                <h5>Breakdown</h5>
                                <div className={styles.voteCounts}>
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>Vote</th>
                                                <th>Count</th>
                                                <th>%</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {Object.entries(results.counts)
                                                .sort(
                                                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                                                    ([_XY, countA], [_X, countB]) =>
                                                        countB - countA,
                                                )
                                                .map(
                                                    ([vote, count]) =>
                                                        vote !== 'null' && (
                                                            <tr key={vote}>
                                                                <td>{vote}</td>
                                                                <td>{count}</td>
                                                                <td>
                                                                    {(
                                                                        (count /
                                                                            results.totalVotes) *
                                                                        100
                                                                    ).toFixed(0)}
                                                                </td>
                                                            </tr>
                                                        ),
                                                )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </AnimatePresence>
    );
}

export default Results;
