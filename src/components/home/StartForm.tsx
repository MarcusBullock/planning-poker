import { CardSuit } from '../../types/CardSuit';
import PlayingCard from './PlayingCard';
import styles from './StartForm.module.scss';

function StartForm() {
    return (
        <div className={styles.startForm}>
            <PlayingCard suit={CardSuit.Hearts} rank="Q">
                <form>
                    <input placeholder="YOUR NAME" />
                    <button type="button">START</button>
                </form>
            </PlayingCard>
        </div>
    );
}

export default StartForm;
