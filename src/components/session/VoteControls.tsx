import { motion } from 'framer-motion';
import VoteButton from './VoteButton';
import styles from './VoteControls.module.scss';

type VoteControlsProps = {
    onVote: (vote: number) => void;
};

const containerVariants = {
    hidden: {
        opacity: 1,
        transition: {
            staggerChildren: 0.2,
        },
    },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.2,
        },
    },
};

function VoteControls({ onVote }: VoteControlsProps) {
    const voteOptions = [1, 2, 3, 5, 8, 13, 21];

    return (
        <motion.div
            className={styles.voteControls}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            {voteOptions.map((option, index) => (
                <VoteButton key={option} value={option} onClick={onVote} delay={index * 0.2} />
            ))}
        </motion.div>
    );
}

export default VoteControls;
