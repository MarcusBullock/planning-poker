import { CardSuit } from '../../types/CardSuit';
import PlayingCard from './PlayingCard';
import styles from './StartForm.module.scss';

function StartForm() {
    return (
        <div className={styles.startForm}>
            <PlayingCard suit={CardSuit.Hearts} rank="Q">
                <input className={styles.input} placeholder="YOUR NAME" />
            </PlayingCard>
        </div>
    );
}

export default StartForm;
