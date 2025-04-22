import PlayingCard from './PlayingCard';
import { CardSuit } from '../../types/CardSuit';
import styles from './JoinForm.module.scss';

interface JoinFormProps {
    isVisible: boolean;
}

function JoinForm({ isVisible }: JoinFormProps) {
    return (
        <div className={`${styles.joinForm} ${isVisible ? styles.enter : styles.exit}`}>
            <PlayingCard suit={CardSuit.Diamonds} rank="J">
                <input className={styles.input} placeholder="ENTER CODE" />
            </PlayingCard>
        </div>
    );
}

export default JoinForm;
