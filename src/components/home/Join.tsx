import PlayingCard from './PlayingCard';
import styles from './Join.module.scss';
import { CardSuit } from '../../types/CardSuit';

interface JoinProps {
    onClick: () => void;
}

function Join({ onClick }: JoinProps) {
    return (
        <PlayingCard className={styles.join} suit={CardSuit.Clubs} rank="K" onClick={onClick}>
            JOIN
        </PlayingCard>
    );
}

export default Join;
