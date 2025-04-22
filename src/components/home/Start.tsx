import { CardSuit } from '../../types/CardSuit';
import PlayingCard from './PlayingCard';
import styles from './Start.module.scss';

interface StartProps {
    onClick: () => void;
}

function Start({ onClick }: StartProps) {
    return (
        <PlayingCard className={styles.start} onClick={onClick} suit={CardSuit.Spades} rank="A">
            START
        </PlayingCard>
    );
}

export default Start;
