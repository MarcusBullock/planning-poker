import { motion } from 'framer-motion';
import styles from './VoteButton.module.scss';

type VoteButtonProps = {
    onClick: (vote: number) => void;
    value: number;
    delay: number;
};

function VoteButton({ value, onClick, delay }: VoteButtonProps) {
    return (
        <motion.button
            className={styles.voteButton}
            onClick={() => onClick(value)}
            initial={{ opacity: 0, y: 1500 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 1500 }}
            transition={{
                opacity: { duration: 0.3, delay },
                y: { duration: 0.3, delay },
            }}
            layout
            whileHover={{
                scale: 1.5,
                backgroundColor: '#e3f300',
                transition: {
                    scale: { duration: 0.2, delay: 0 },
                    backgroundColor: { duration: 0.2, delay: 0 },
                },
            }}
            whileTap={{
                scale: 0.9,
                transition: {
                    scale: { duration: 0.1, delay: 0 },
                },
            }}
        >
            {value}
        </motion.button>
    );
}

export default VoteButton;
