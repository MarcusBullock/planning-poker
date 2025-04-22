import PlayingCard from './PlayingCard';
import { CardSuit } from '../../types/CardSuit';
import styles from './JoinForm.module.scss';

function JoinForm() {
    return (
        <div className={styles.joinForm}>
            <PlayingCard suit={CardSuit.Diamonds} rank="J">
                <input className={styles.input} placeholder="ENTER CODE" />
            </PlayingCard>
        </div>
    );
}

export default JoinForm;
